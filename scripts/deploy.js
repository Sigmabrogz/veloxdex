const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const network = hre.network.name;
  console.log("Network:", network);

  // WETH addresses
  const WETH_ADDRESSES = {
    base: "0x4200000000000000000000000000000000000006",
    baseSepolia: "0x4200000000000000000000000000000000000006"
  };

  // USDC addresses
  const USDC_ADDRESSES = {
    base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  };

  const WETH = WETH_ADDRESSES[network];
  const USDC = USDC_ADDRESSES[network];

  if (!WETH) {
    throw new Error(`WETH address not configured for network: ${network}`);
  }

  console.log("\n--- Deploying Factory ---");
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("Factory deployed to:", factoryAddress);

  console.log("Waiting for contract to be indexed...");
  await sleep(5000);

  let pairCodeHash;
  for (let i = 0; i < 5; i++) {
    try {
      pairCodeHash = await factory.pairCodeHash();
      console.log("Pair code hash:", pairCodeHash);
      break;
    } catch (e) {
      console.log("Retrying pairCodeHash call...");
      await sleep(3000);
    }
  }
  if (!pairCodeHash) {
    pairCodeHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    console.log("Could not get pairCodeHash, using placeholder");
  }

  console.log("\n--- Deploying Router ---");
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router deployed to:", routerAddress);

  console.log("\n--- Creating WETH/USDC Pair ---");
  const createPairTx = await factory.createPair(WETH, USDC);
  await createPairTx.wait();
  const pairAddress = await factory.getPair(WETH, USDC);
  console.log("WETH/USDC Pair deployed to:", pairAddress);

  // Save deployment info
  const deploymentInfo = {
    network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    factory: factoryAddress,
    router: routerAddress,
    pair: pairAddress,
    pairCodeHash,
    weth: WETH,
    usdc: USDC,
    timestamp: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\nDeployment info saved to:", deploymentFile);

  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log("Factory:", factoryAddress);
  console.log("Router:", routerAddress);
  console.log("WETH/USDC Pair:", pairAddress);
  console.log("Pair Code Hash:", pairCodeHash);
  console.log("========================================");

  console.log("\nNext steps:");
  console.log("1. Add liquidity to the WETH/USDC pair");
  console.log("2. Run the trading script to generate volume");
  console.log("3. Submit DefiLlama adapter");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
