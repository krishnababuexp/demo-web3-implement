'use client'
import { useState } from "react";
import { ethers, parseEther } from "ethers";
import { getMetamaskAccount } from "../utils/walletAccountUtils";
import { Connection, PublicKey, Transaction, SystemProgram, clusterApiUrl } from "@solana/web3.js";


export default function Payment() {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("ETH");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const contractABI = [
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "ERC1967InvalidImplementation",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC1967NonPayable",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedCall",
          type: "error",
        },
        {
          inputs: [],
          name: "InvalidInitialization",
          type: "error",
        },
        {
          inputs: [],
          name: "NotInitializing",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [],
          name: "UUPSUnauthorizedCallContext",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "slot",
              type: "bytes32",
            },
          ],
          name: "UUPSUnsupportedProxiableUUID",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "EtherSent",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "oldFee",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "newFee",
              type: "uint256",
            },
          ],
          name: "FeeUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint64",
              name: "version",
              type: "uint64",
            },
          ],
          name: "Initialized",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address[]",
              name: "recipients",
              type: "address[]",
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "totalFee",
              type: "uint256",
            },
          ],
          name: "MassPayoutCompleted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "implementation",
              type: "address",
            },
          ],
          name: "Upgraded",
          type: "event",
        },
        {
          stateMutability: "payable",
          type: "fallback",
        },
        {
          inputs: [],
          name: "UPGRADE_INTERFACE_VERSION",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "feePercent",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "initialize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "recipients",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "amounts",
              type: "uint256[]",
            },
          ],
          name: "payout",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "proxiableUUID",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable",
              name: "recipient",
              type: "address",
            },
          ],
          name: "sendEth",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "newFeePercentage",
              type: "uint256",
            },
          ],
          name: "updateFeePercent",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newImplementation",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "upgradeToAndCall",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address payable",
              name: "recipient",
              type: "address",
            },
          ],
          name: "withdrawEther",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ]
    const handleAmountClick = (e) => {
        e.preventDefault();
        setError('');
        console.log("Selected amount:", e.target.value);
        setSelectedAmount(parseFloat(e.target.value));
    };

    const amounts = [0.0001, 0.001, 0.01, 0.1, 1.0, 2.0];

    const handlePayWithMetamask = async() => {
        const recipientAddress = "0x6D10Ec92754DA798CD89770442153d07f89ea0c9"
        if (!window.ethereum || !selectedAmount) return;

        try {
        setLoading(true);
          setError('');
          setTxHash('');
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const contractAddress = "0xF2154747DAC6d1ED393450e4a1bA69F98d3De788"
          const { account, network, provider } = await getMetamaskAccount(selectedPaymentMethod);
          const sender = account;
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          const amountInEth = selectedAmount.toString(); // assume it's already in ETH (can convert USD to ETH via an API)
        
          try{
              const txResponse = await contract.sendEth(recipientAddress, {
                value: parseEther(amountInEth),
                // gasPrice: parseInt(estimatedGasPrice),
              });
              setTxHash("Waiting for confirmation...");
              // This waits for 1 confirmation (default)
              const receipt = await txResponse.wait();
              console.log('Transaction receipt:', receipt);
              setTxHash(receipt.hash);
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
          setLoading(false);
        }
      };
      
      const handlePayWithPhantom = async() => {
        const recipient = "9qSVBA4ny5BDZAyVmmu1ep9mFpANymQk6eFSB9MZtTDu"
        const provider = window.solana;
        if (!provider || !provider.isPhantom) {
          throw new Error("Phantom Wallet not found");
        }
        const connection = new Connection(clusterApiUrl("devnet"),"confirmed"); // or 'mainnet-beta'/'testnet'
        const resp = await provider.connect();
        const sender = resp.publicKey;
        const recipientPubKey = new PublicKey(recipient);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: recipientPubKey,
            lamports: selectedAmount * 1e9, // 1 SOL = 10^9 lamports
          })
        );

        transaction.feePayer = sender;
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;

        const signed = await provider.signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signed.serialize());
        console.log("Transaction ID:", txid);

        await connection.confirmTransaction(txid);
        setTxHash(txid);
      };
      const connectSolflare = async () => {
        if (!window.solflare?.isSolflare) {
          alert("Solflare wallet not found");
          return null;
        }
      
        await window.solflare.connect(); // triggers Solflare popup
        return window.solflare;
      };
      
      const handlePayWithSolflare = async() => {
        const recipient = "9qSVBA4ny5BDZAyVmmu1ep9mFpANymQk6eFSB9MZtTDu";
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");  // or 'mainnet-beta'/'testnet'
        const wallet = await connectSolflare();

        if (!wallet || !wallet.publicKey) return;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(recipient),
            lamports: selectedAmount * 1e9, // 1 SOL = 1e9 lamports
          })
        );

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        const signedTx = await wallet.signTransaction(transaction);
        const txid = await connection.sendRawTransaction(signedTx.serialize());

        await connection.confirmTransaction(txid, "confirmed");
        console.log("✅ Transaction confirmed:", txid);
        setTxHash(txid);
      };
      
    return (
   
      <>
        <div className="flex items-center justify-center min-h-screen overflow-hidden">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Crypto Payment</h2>
            <form className="flex flex-col gap-4">
                <div className="p-4">
                {/* Currency Dropdown */}
                <div className="p-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 cursorr-pointer">
                    Cryptocurrency
                    </label>
                    <select
                    id="currency"
                    name="currency"
                    value = {selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="SETH">Ethereum Sepolia (SETH)</option>
                        <option value="MATIC">Polygon (MATIC)</option>
                        <option value="POL">Polygon Amoy Testnet(POL)</option>
                        <option value="SOL">Solana (SOL)</option>
                        <option value="USDC">USDC</option>
                    </select>
                </div>
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
                </div>
            </form>
            <div className="p-2">
                {error ? (
                    <p className="text-red-600 text-sm">{error}</p>
                ) : (
                    <>
                        {selectedAmount && (
                            <p className="text-sm text-green-600">
                            Selected Amount: <strong>${selectedAmount}</strong>
                            </p>
                        )}
                    
                        <p className="text-sm text-blue-600">
                            Receiver Address: <strong>0x6D10Ec92754DA798CD89770442153d07f89ea0c9</strong>
                        </p>
                    </>
                )}
                {txHash && (
                    <p className="text-sm text-blue-600">
                        Transaction Hash: <strong>{txHash}</strong>
                    </p>
                )}
            </div>
            {/* Wallet Payment Buttons */}
            <div className="mt-6 flex flex-col gap-3">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : (
                    <>
                        <button
                            onClick={handlePayWithMetamask}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition"
                            >
                            Pay with MetaMask
                        </button>

                        <button
                            onClick={handlePayWithPhantom}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                            Pay with Phantom
                        </button>

                        <button
                            onClick={handlePayWithSolflare}
                            className="w-full bg-blue-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
                            >
                            Pay with Solflare
                        </button>
                        {/* <SolanaWalletProvider>
                        <PayWithSolana />
                      </SolanaWalletProvider> */}

                    </> 
            
                )}
            

          
            </div>
          </div>
        </div>

      </>
                    
    );
}