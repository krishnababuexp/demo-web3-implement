import { ethers } from "hardhat";

async function main() {
  const NFT = await ethers.getContractFactory("SimpleTestNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("NFT deployed to:", await nft.getAddress());

  const NFTMarket = await ethers.getContractFactory("TestNFTMarketplace");
  const nftMarket = await NFTMarket.deploy(nft.getAddress());
  await nftMarket.waitForDeployment();
  console.log("NFTMarket deployed to:", await nftMarket.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
