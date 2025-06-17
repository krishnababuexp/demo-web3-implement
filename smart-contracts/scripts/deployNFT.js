const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const name = "TestNFT";
  const symbol = "TNFT";

  const NFT = await ethers.getContractFactory("SimpleTestNFT");
  const nft = await NFT.deploy(name, symbol, deployer.address);
  await nft.waitForDeployment();

  console.log("NFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
