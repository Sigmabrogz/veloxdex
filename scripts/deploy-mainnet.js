const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying to BASE MAINNET with:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  // Base Mainnet addresses
  const WETH = "0x4200000000000000000000000000000000000006";
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  console.log("\n--- Deploying Factory ---");
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("Factory:", factoryAddress);

  console.log("\n--- Deploying Router ---");
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router:", routerAddress);

  console.log("\n--- Creating WETH/USDC Pair ---");
  const createPairTx = await factory.createPair(WETH, USDC);
  await createPairTx.wait();
  const pairAddress = await factory.getPair(WETH, USDC);
  console.log("Pair:", pairAddress);

  // Save deployment
  const deployment = {
    network: "base",
    chainId: "8453",
    deployer: deployer.address,
    factory: factoryAddress,
    router: routerAddress,
    pair: pairAddress,
    weth: WETH,
    usdc: USDC,
    timestamp: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir);
  fs.writeFileSync(path.join(deploymentsDir, "base.json"), JSON.stringify(deployment, null, 2));

  console.log("\n========================================");
  console.log("VELOX DEX - BASE MAINNET DEPLOYMENT");
  console.log("========================================");
  console.log("Factory:", factoryAddress);
  console.log("Router:", routerAddress);
  console.log("WETH/USDC Pair:", pairAddress);
  console.log("========================================");

  return deployment;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
