const hre = require("hardhat");

async function main() {
  console.log("Connecting to Base Sepolia...");
  
  const provider = hre.ethers.provider;
  
  try {
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name);
    console.log("Chain ID:", network.chainId);
    
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
    
    const balance = await provider.getBalance("0x0000000000000000000000000000000000000000");
    console.log("Balance of 0x0 address:", hre.ethers.utils.formatEther(balance), "ETH");
  } catch (error) {
    console.error("Failed to connect to Base Sepolia:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });