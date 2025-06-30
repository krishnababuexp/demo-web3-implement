require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("hardhat-ethernal");
require("@openzeppelin/hardhat-upgrades");
const { API_URL, PRIVATE_KEY, BSC_PK } = process.env;

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "shanghai",
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`${PRIVATE_KEY}`],
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [`${BSC_PK}`],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
    },
  },
};
