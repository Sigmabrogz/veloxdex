const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Continuing deployment with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  const network = hre.network.name;
  console.log("Network:", network);

  // Already deployed Factory
  const factoryAddress = "0x47a76Cf3cE4ba9Ce8619e1b7aBa5d6817B5Ffc29";
  console.log("Using existing Factory:", factoryAddress);

  // WETH and USDC addresses for Base Sepolia
  const WETH = "0x4200000000000000000000000000000000000006";
  const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

  console.log("\n--- Deploying Router ---");
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factoryAddress, WETH);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Router deployed to:", routerAddress);

  console.log("\n--- Creating WETH/USDC Pair ---");
  const Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = Factory.attach(factoryAddress);
  
  const createPairTx = await factory.createPair(WETH, USDC);
  await createPairTx.wait();
  const pairAddress = await factory.getPair(WETH, USDC);
  console.log("WETH/USDC Pair deployed to:", pairAddress);

  // Save deployment info
  const deploymentInfo = {
    network,
    chainId: "84532",
    deployer: deployer.address,
    factory: factoryAddress,
    router: routerAddress,
    pair: pairAddress,
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
  console.log("========================================");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
