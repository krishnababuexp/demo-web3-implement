import { BrowserProvider, ethers } from "ethers";

const NETWORKS = {
  ethereum: {
    chainId: "0x1", // Ethereum Mainnet
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://ethereum-rpc.com"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.com"],
  },
  sepolia: {
    chainId: "0xaa36a7", // Sepolia Testnet (decimal: 11155111)
    chainName: "Sepolia Testnet",
    rpcUrls: ["https://rpc.sepolia.org"],
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "SETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Mainnet",
    rpcUrls: ["rpc.ankr.com/polygon"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  amoy: {
    chainId: "0x13882",
    chainName: "Amoy",
    rpcUrls: ["https://rpc-amoy.polygon.technology"],
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18,
    },
    blockExplorerUrls: ["www.oklink.com/amoy"],
  },
  bnb: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    blockExplorerUrls: ["https://bscscan.com"],
  },
  // Add other networks here as needed
};

function getNetworkBySymbol(symbol) {
  const lowerSymbol = symbol.toUpperCase();
  return Object.values(NETWORKS).find(
    (net) => net.nativeCurrency.symbol.toUpperCase() === lowerSymbol
  );
}

export const getMetamaskAccount = async (networkKey = "ETH") => {
  const provider = new BrowserProvider(window.ethereum);
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  const selectedNetwork = getNetworkBySymbol(networkKey);
  if (!selectedNetwork) {
    throw new Error(`Unsupported network: ${networkKey}`);
  }
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });
  console.log("Current chain ID:", currentChainId, selectedNetwork);
  // If not Ethereum Mainnet, attempt to switch
  if (currentChainId !== selectedNetwork.chainId) {
    console.log("Switching to network:", selectedNetwork.chainName);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: selectedNetwork.chainId }],
      });
      console.log("Switched to network:", selectedNetwork.chainName);
    } catch (switchError) {
      // This error code indicates the chain has not been added to MetaMask
      // If not added, try to add it
      if (switchError.code === 4902 && selectedNetwork.rpcUrls) {
        console.log("Adding network:", selectedNetwork.rpcUrls);
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [selectedNetwork],
        });
        console.log("Added network:", selectedNetwork.chainName);
      } else {
        console.error("Failed to switch network:", switchError);
        throw new Error("Failed to switch network: " + switchError.message);
      }
    }
  }
  // Request accounts (triggers MetaMask popup)
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const network = await provider.getNetwork();
  console.log("Accounts:", accounts, network);
  return { account: accounts[0], network: network.name, provider };
};

export const getPhantomAccount = async () => {
  // Request accounts (triggers Phantom popup)
  try {
    const provider = window?.solana;
    const response = await provider.connect();
    const publicKey = response.publicKey.toString();
    return { account: publicKey, network: "solana" };
  } catch (error) {
    console.error("Error connecting to Phantom:", error);
    return { account: null, network: null };
  }
};

export const getPhantomProvider = async (networkKey = "SOL") => {
  if (networkKey === "SOL") {
    return window.solana;
  } else if (networkKey === "ETH") {
    const phantom = window.phantom?.ethereum;
    if (!phantom) {
      throw new Error("Phantom wallet with Ethereum support not found");
      return;
    }
    // Request wallet connection
    await phantom.request({ method: "eth_requestAccounts" });
    // Create ethers provider
    return new ethers.BrowserProvider(phantom);
  } else if (networkKey === "POL") {
    const phantom = window.phantom?.ethereum;
  } else if (networkKey === "BTC") {
    const phantom = window.phantom?.bitcoin;
  } else {
    throw new Error("Unsupported network for Phantom: " + networkKey);
  }
};
