import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const PayWithSolana = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [txHash, setTxHash] = useState("");
  const [amount] = useState(0.01); // 0.01 SOL

  const recipient = new PublicKey("9qSVBA4ny5BDZAyVmmu1ep9mFpANymQk6eFSB9MZtTDu");

  const handlePay = async () => {
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
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <WalletMultiButton />
      <button
        onClick={handlePay}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Pay {amount} SOL
      </button>
    
    </div>
  );
};
