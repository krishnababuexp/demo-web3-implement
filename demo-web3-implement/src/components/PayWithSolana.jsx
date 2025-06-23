import React, { useState } from "react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const PayWithSolana = ({amount, receiver}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const [txHash, setTxHash] = useState("");
  console.log("publicKey",publicKey);
  
  const handlePay = async () => {
    const recipient = new PublicKey(receiver);
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * 1e9,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setTxHash(signature);
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transaction failed: " + error.message);
    }
  };
  return (
    <div >
      <button
        onClick={handlePay}
        className="w-full bg-blue-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
      >
        Pay {amount} SOL
      </button>
      <WalletMultiButton />
    
    </div>
  );
};
