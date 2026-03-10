const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("Adding liquidity with account:", deployer.address);

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found: ${deploymentFile}. Run deploy.js first.`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  console.log("Loaded deployment:", deployment);

  const routerAddress = deployment.router;
  const wethAddress = deployment.weth;
  const usdcAddress = deployment.usdc;
  const pairAddress = deployment.pair;

  // Get contract instances
  const router = await hre.ethers.getContractAt("UniswapV2Router02", routerAddress);
  const usdc = await hre.ethers.getContractAt("IERC20", usdcAddress);
  const pair = await hre.ethers.getContractAt("UniswapV2Pair", pairAddress);

  // Check balances
  const ethBalance = await hre.ethers.provider.getBalance(deployer.address);
  const usdcBalance = await usdc.balanceOf(deployer.address);
  
  console.log("\nCurrent balances:");
  console.log("ETH:", hre.ethers.formatEther(ethBalance));
  console.log("USDC:", hre.ethers.formatUnits(usdcBalance, 6));

  // Amount to add as liquidity
  const ethAmount = hre.ethers.parseEther("0.01"); // 0.01 ETH (~$25 at $2500/ETH)
  const usdcAmount = hre.ethers.parseUnits("25", 6); // 25 USDC

  if (ethBalance < ethAmount) {
    throw new Error("Insufficient ETH balance");
  }

  if (usdcBalance < usdcAmount) {
    console.log("\nInsufficient USDC balance. You need at least 25 USDC.");
    console.log("Get USDC from a faucet or swap some ETH for USDC first.");
    return;
  }

  // Approve USDC
  console.log("\nApproving USDC...");
  const approveTx = await usdc.approve(routerAddress, usdcAmount);
  await approveTx.wait();
  console.log("USDC approved");

  // Add liquidity
  console.log("\nAdding liquidity...");
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

  const addLiqTx = await router.addLiquidityETH(
    usdcAddress,
    usdcAmount,
    0, // min USDC (accept any)
    0, // min ETH (accept any)
    deployer.address,
    deadline,
    { value: ethAmount }
  );

  const receipt = await addLiqTx.wait();
  console.log("Liquidity added! Tx:", receipt.hash);

  // Check LP tokens
  const lpBalance = await pair.balanceOf(deployer.address);
  console.log("LP tokens received:", hre.ethers.formatEther(lpBalance));

  // Check reserves
  const reserves = await pair.getReserves();
  const token0 = await pair.token0();
  
  console.log("\nPool reserves:");
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
