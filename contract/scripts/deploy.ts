import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LoreKeeper to Ritual Chain Testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", ethers.formatEther(balance), "RITUAL\n");

  const LoreKeeper = await ethers.getContractFactory("LoreKeeper");
  const contract = await LoreKeeper.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ LoreKeeper deployed to:", address);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Add this to frontend/.env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
