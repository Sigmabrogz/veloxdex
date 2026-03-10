const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const [trader] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("Trading bot started with account:", trader.address);

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found: ${deploymentFile}. Run deploy.js first.`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  const routerAddress = deployment.router;
  const wethAddress = deployment.weth;
  const usdcAddress = deployment.usdc;
  const pairAddress = deployment.pair;

  // Get contract instances
  const router = await hre.ethers.getContractAt("UniswapV2Router02", routerAddress);
  const usdc = await hre.ethers.getContractAt("IERC20", usdcAddress);
  const pair = await hre.ethers.getContractAt("UniswapV2Pair", pairAddress);

  // Configuration
  const NUM_TRADES = parseInt(process.env.NUM_TRADES || "100");
  const TRADE_AMOUNT_ETH = hre.ethers.parseEther(process.env.TRADE_AMOUNT || "0.001"); // 0.001 ETH per trade
  const DELAY_BETWEEN_TRADES = parseInt(process.env.TRADE_DELAY || "2000"); // 2 seconds

  console.log("\nTrading configuration:");
  console.log("Number of trades:", NUM_TRADES);
  console.log("Trade amount:", hre.ethers.formatEther(TRADE_AMOUNT_ETH), "ETH");
  console.log("Delay between trades:", DELAY_BETWEEN_TRADES, "ms");

  // Check initial balances
  let ethBalance = await hre.ethers.provider.getBalance(trader.address);
  let usdcBalance = await usdc.balanceOf(trader.address);
  
  console.log("\nInitial balances:");
  console.log("ETH:", hre.ethers.formatEther(ethBalance));
  console.log("USDC:", hre.ethers.formatUnits(usdcBalance, 6));

  // Approve USDC for router (max approval)
  console.log("\nApproving USDC for trading...");
  const approveTx = await usdc.approve(routerAddress, hre.ethers.MaxUint256);
  await approveTx.wait();
  console.log("USDC approved");

  let totalVolumeETH = BigInt(0);
  let totalVolumeUSDC = BigInt(0);
  let successfulTrades = 0;

  console.log("\n--- Starting trades ---\n");

  for (let i = 0; i < NUM_TRADES; i++) {
    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

      if (i % 2 === 0) {
        // ETH -> USDC
        console.log(`Trade ${i + 1}/${NUM_TRADES}: Swapping ETH -> USDC`);
        
        const path = [wethAddress, usdcAddress];
        const amounts = await router.getAmountsOut(TRADE_AMOUNT_ETH, path);
        const expectedUSDC = amounts[1];

        const tx = await router.swapExactETHForTokens(
          0, // accept any amount
          path,
          trader.address,
          deadline,
          { value: TRADE_AMOUNT_ETH }
        );
        
        const receipt = await tx.wait();
        console.log(`  Received: ${hre.ethers.formatUnits(expectedUSDC, 6)} USDC | Gas: ${receipt.gasUsed}`);
        
        totalVolumeETH += TRADE_AMOUNT_ETH;
        totalVolumeUSDC += expectedUSDC;
        
      } else {
        // USDC -> ETH
        console.log(`Trade ${i + 1}/${NUM_TRADES}: Swapping USDC -> ETH`);
        
        usdcBalance = await usdc.balanceOf(trader.address);
        const usdcToSwap = usdcBalance / BigInt(2); // Swap half of USDC balance
        
        if (usdcToSwap > 0) {
          const path = [usdcAddress, wethAddress];
          const amounts = await router.getAmountsOut(usdcToSwap, path);
          const expectedETH = amounts[1];

          const tx = await router.swapExactTokensForETH(
            usdcToSwap,
            0, // accept any amount
            path,
            trader.address,
            deadline
          );
          
          const receipt = await tx.wait();
          console.log(`  Received: ${hre.ethers.formatEther(expectedETH)} ETH | Gas: ${receipt.gasUsed}`);
          
          totalVolumeUSDC += usdcToSwap;
          totalVolumeETH += expectedETH;
        }
      }

      successfulTrades++;

      // Progress update every 10 trades
      if ((i + 1) % 10 === 0) {
        ethBalance = await hre.ethers.provider.getBalance(trader.address);
        usdcBalance = await usdc.balanceOf(trader.address);
        console.log(`\n--- Progress: ${i + 1}/${NUM_TRADES} trades ---`);
        console.log(`Current ETH: ${hre.ethers.formatEther(ethBalance)}`);
        console.log(`Current USDC: ${hre.ethers.formatUnits(usdcBalance, 6)}`);
        console.log(`Total volume: ~$${Number(hre.ethers.formatUnits(totalVolumeUSDC, 6)).toFixed(2)}\n`);
      }

      // Delay between trades
      if (i < NUM_TRADES - 1) {
        await sleep(DELAY_BETWEEN_TRADES);
      }

    } catch (error) {
      console.log(`  Trade ${i + 1} failed:`, error.message);
    }
  }

  // Final summary
  ethBalance = await hre.ethers.provider.getBalance(trader.address);
  usdcBalance = await usdc.balanceOf(trader.address);

  console.log("\n========================================");
  console.log("TRADING SUMMARY");
  console.log("========================================");
  console.log("Successful trades:", successfulTrades, "/", NUM_TRADES);
  console.log("Total ETH volume:", hre.ethers.formatEther(totalVolumeETH));
  console.log("Total USDC volume:", hre.ethers.formatUnits(totalVolumeUSDC, 6));
  console.log("\nFinal balances:");
  console.log("ETH:", hre.ethers.formatEther(ethBalance));
  console.log("USDC:", hre.ethers.formatUnits(usdcBalance, 6));
  console.log("========================================");

  // Check pool reserves
  const reserves = await pair.getReserves();
  const token0 = await pair.token0();
  
  console.log("\nPool reserves after trading:");
  if (token0.toLowerCase() === wethAddress.toLowerCase()) {
    console.log("WETH:", hre.ethers.formatEther(reserves[0]));
    console.log("USDC:", hre.ethers.formatUnits(reserves[1], 6));
  } else {
    console.log("USDC:", hre.ethers.formatUnits(reserves[0], 6));
    console.log("WETH:", hre.ethers.formatEther(reserves[1]));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
