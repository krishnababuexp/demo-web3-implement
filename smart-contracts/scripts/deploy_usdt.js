const hre = require("hardhat");

async function main() {
  const USDTCoin = await hre.ethers.getContractFactory("TestUSD");
  const token = await USDTCoin.deploy();
  await token.waitForDeployment();

  console.log(`✅ Contract deployed to: ${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
