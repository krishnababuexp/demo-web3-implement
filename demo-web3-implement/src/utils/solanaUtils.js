import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  clusterApiUrl,
} from "@solana/web3.js";

export const createSolTxn = (sender, recipient, amount) => {
  const recipientPubKey = new PublicKey(recipient);
  const platformFee = import.meta.env.VITE_DYNEUM_FEE; // 5% platform fee
  const feeAmount = (amount * platformFee) / 100; // Calculate the fee amount
  const amountAfterFee = amount - feeAmount; // Amount after deducting the fee

  const transaction = new Transaction().add(
    // Create a transfer instruction
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipientPubKey,
      lamports: amountAfterFee * 1e9, // 1 SOL = 10^9 lamports
    })
  );
  if (feeAmount > 0) {
    // Add platform fee transfer
    const platformFeeAddress = new PublicKey(
      import.meta.env.VITE_DYNEUM_SOL_ADDRESS
    );
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: platformFeeAddress,
        lamports: feeAmount * 1e9, // 1 SOL = 10^9 lamports
      })
    );
  }
  transaction.feePayer = sender;
  console.log("Transaction created:", transaction);
  return transaction;
};

export const getSolanaConnection = () => {
  console.log("connection", import.meta.env.VITE_TXN_MODE);
  const connection = new Connection(
    clusterApiUrl(
      import.meta.env.VITE_TXN_MODE === "development"
        ? "devnet"
        : "mainnet-beta"
    ),
    "confirmed"
  ); // or "production"
  return connection;
};

export const sendSolTransaction = async (txn, connection, provider) => {
  const { blockhash } = await connection.getLatestBlockhash();
  txn.recentBlockhash = blockhash;
  try {
    const signed = await provider.signTransaction(txn);
    const txid = await connection.sendRawTransaction(signed.serialize());
    console.log("Transaction ID:", txid);
    await connection.confirmTransaction(txid);
    return txid;
  } catch (err) {
    console.log("error in sending transaction", err);
    return null;
  }
};

export const connectSolflare = async () => {
  if (!window.solflare?.isSolflare) {
    alert("Solflare wallet not found");
    return null;
  }

  await window.solflare.connect(); // triggers Solflare popup
  return window.solflare;
};
