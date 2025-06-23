'use client'
import { useState } from "react";
import { ethers, parseEther } from "ethers";
import { getMetamaskAccount } from "../utils/walletAccountUtils";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl  } from "@solana/web3.js";
import {SolanaWalletProvider} from "../utils/solanaWalletProvider";
import { PayWithSolana } from "../components/PayWithSolana";
import { PulseLoader } from "react-spinners";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName,WagmiProvider } from 'wagmi'
import { WalletOptions } from "../components/EthWalletOptions";
import { Account } from "../components/ethAccount";
import { config } from "../utils/ethereumWalletProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getSolanaConnection, connectSolflare, createSolTxn, sendSolTransaction } from "../utils/solanaUtils";
import { createEthTxn } from "../utils/ethereumUtils";
import { getPhantomProvider } from "../utils/walletAccountUtils";
const queryClient = new QueryClient()

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

export default function Payment() {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [receiver, setReceiver] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ETH");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(null);
    const [txHash, setTxHash] = useState('');
    
    const handleAmountClick = (e) => {
        e.preventDefault();
        setError('');
        console.log("Selected amount:", e.target.value);
        setSelectedAmount(parseFloat(e.target.value));
    };

    const handleReceiverChange = (e) => {
        e.preventDefault();
        setError('');
        setReceiver(e.target.value);
    };

    const amounts = [0.0001, 0.001, 0.01, 0.1, 1.0, 2.0];
    console.log("loading", loading);
    const handlePayWithMetamask = async() => {
      const recipientAddress = receiver;
      if (!window.ethereum || !selectedAmount || !recipientAddress) return;

      try {
        setLoading("metamask-btn");
        setError('');
        setTxHash('');
        const {provider} = await getMetamaskAccount(selectedPaymentMethod);
        try{
          const transactionHash = await createEthTxn(provider, selectedAmount, recipientAddress);
          if (!transactionHash) {
            setError("Transaction failed");
          }
          console.log('Transaction receipt:', transactionHash);
          setTxHash(transactionHash);
          }
          catch(err){
            if (err.message && err.message.includes('insufficient funds')) {
              setError('Insufficient funds');
            }
            else if (err.message && err.message.includes('user rejected action')) {
              setError('User rejected action');
            }
            else {

              console.log("error in sending transaction",err);
              setError(err.message);
            }
          }     
      } catch (err) {
        if (err.message && err.message.includes('insufficient funds')) {
          setError('Insufficient funds');
        } else {
        setError(err.message || 'Transaction failed');
      }
      } finally {
        setLoading(null);
      }
    };
      
      const handlePayWithPhantom = async() => {
        const recipientAddress = receiver;
        if (!recipientAddress) return;
        setLoading("phantom-btn");
        let provider = null;
        try{
          provider = await getPhantomProvider(selectedPaymentMethod);
          console.log("provider",provider);
        }
        catch(err){
          console.error("Error connecting to Phantom:", err);
          setError(err.message);
          setLoading(null);
        };
        if (selectedPaymentMethod === "ETH") {
          try{
            const transactionHash = await createEthTxn(provider, selectedAmount, recipientAddress);
            if (!transactionHash) {
              setError("Transaction failed");
              setLoading(false);
              return;
            }
            console.log('Transaction receipt:', transactionHash);
            setTxHash(transactionHash);
            }
            catch(err){
              if (err.message && err.message.includes('insufficient funds')) {
                setError('Insufficient funds');
              }
              else if (err.message && err.message.includes('user rejected action')) {
                setError('User rejected action');
              }
              else {
  
                console.log("error in sending transaction",err);
                setError(err.message);
              }
            }     
          setLoading(null);
          return;
        }
        else if (selectedPaymentMethod === "SOL"){
          let resp = null;  
          try {
            resp = await provider.connect();
            
          }
          catch(err){
            console.log("error in connecting to phantom",err);
            setError(err.message);
            setLoading(null);
            return;
          }
          const sender = resp.publicKey;
          const transaction = createSolTxn(sender, receiver, selectedAmount);
          try{
            const connection = getSolanaConnection();  
            const txid = await sendSolTransaction(transaction, connection, provider);
            if (!txid) {
              setError("Transaction failed");
              return;
            }
            setTxHash(txid);
          }
          catch(err){
            console.error("Error sending transaction:", err);
            setError(err.message);
          }

        }
        else if (selectedPaymentMethod === "BTC") {
          console.error("BTC payments not supported yet");
        };
      };
      
      const handlePayWithSolflare = async() => {
        if (!receiver) return;
        try{
          setLoading("solflare-btn");
          const connection = getSolanaConnection();  
          const wallet = await connectSolflare();
          if (!wallet || !wallet.publicKey) return;
          const transaction = createSolTxn(wallet.publicKey, receiver, selectedAmount);
            try{
              const txid = await sendSolTransaction(transaction, connection, wallet);
              if (!txid) {
                setError("Transaction failed");
                return;
              }
              setTxHash(txid);
            }
            catch(err){
              console.error("Error sending transaction:", err);
              setError(err.message);
            }

        }
        catch(err){
          console.error("Error connecting to Solflare:", err);
          setError(err.message);
          setLoading(null);
          return;
        }
        
        finally {
          setLoading(null);
        }
        
      };
      
    return (
   
      <>
        <div className="flex items-center justify-center min-h-screen overflow-hidden">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Crypto Payment</h2>
            <form className="flex flex-col gap-4">
                  {/* Currency Dropdown */}
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cryptocurrency
                  </label>
                  <select
                  id="currency"
                  name="currency"
                  value = {selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-2 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="SETH">Ethereum Sepolia (SETH)</option>
                      <option value="MATIC">Polygon (MATIC)</option>
                      <option value="POL">Polygon Amoy Testnet(POL)</option>
                      <option value="SOL">Solana (SOL)</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="USDC">USDC</option>
                  </select>
                {/* Amounts */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                </label>
                <div className="flex flex-wrap gap-3 justify-center">
                    {amounts.map((amt) => (
                    <button
                        key={amt}
                        value={amt}
                        onClick={(e) => handleAmountClick(e)}
                        className={`px-4 py-2 rounded-full border font-medium transition duration-200
                            ${
                              selectedAmount === amt
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 shadow-md'
                                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        {amt}{" "}{selectedPaymentMethod}
                    </button>
                    ))}
                  </div>
          
                {/* Reeiver */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Receiver
                </label>
                <input type="text" name="receiver" value={receiver} onChange={handleReceiverChange} placeholder="Receiver Address" className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </form>
            <div className="p-2">
                {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                )}
                {txHash && (
                    <p className="break-words whitespace-pre-wrap text-sm text-blue-600">
                        Transaction Hash: <strong>{txHash}</strong>
                    </p>
                )}
            </div>
            {/* Wallet Payment Buttons */}
            <div className="mt-6 flex flex-col gap-3">
               
            {loading === "metamask-btn" ? (
                    <button  
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition"
                            >
                            <PulseLoader color="#000000" size={10} />
              </button>):(

              <button
                  onClick={handlePayWithMetamask}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition"
                  >
                  Pay with MetaMask
              </button>
              )}
              {loading === "phantom-btn" ? (
                    <button  
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                            <PulseLoader color="#000000" size={10} />
              </button>):(
              <button
                  onClick={handlePayWithPhantom}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
                  >
                  Pay with Phantom
              </button>
              )}
              {loading === "solflare-btn" ? (
                    <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                            <PulseLoader color="#000000" size={10} />
              </button>):(

              <button
                  onClick={handlePayWithSolflare}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                  >
                  Pay with Solflare
              </button>
            )}

            </div>
              {/* <SolanaWalletProvider>
                <PayWithSolana amount={selectedAmount} receiver={receiver} />
              </SolanaWalletProvider> 
              <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                  <ConnectWallet />         
                </QueryClientProvider>
              </WagmiProvider> */}

          </div>
        </div>

      </>
                    
    );
}