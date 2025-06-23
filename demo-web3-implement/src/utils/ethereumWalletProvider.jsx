import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, polygon, sepolia, polygonAmoy } from 'wagmi/chains'
import { metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
console.log('projectId',projectId)
export const config = createConfig({
  chains: [mainnet, base, polygon, polygonAmoy, optimism, sepolia],
  connectors: [
    // injected(),
    walletConnect({ projectId }),
    metaMask(),
   
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})