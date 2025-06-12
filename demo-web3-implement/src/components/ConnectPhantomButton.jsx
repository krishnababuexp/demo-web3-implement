import React, { useState } from 'react';
import bs58 from 'bs58';
import api from '../api/apiInstance'; 
import {getPhantomAccount} from '../utils/walletAccountUtils'; 
import { getCryptoLoginNonce } from '../utils/nonceUtils'; 
function ConnectPhantomButton() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);

  const disconnectWallet = async() => {
    console.log('Disconnecting wallet...');
    if (window?.solana?.isPhantom) {
        await window.solana.disconnect();
        setAccount(null);
        setNetwork(null); // if you're storing network info too
      }
  };

  const handleBackendLogin = async () => {
    const provider = window?.solana;
    if (!provider?.isPhantom) {
      setError('Phantom wallet not found. Please install it from https://phantom.app/');
      return;
    }
    const from = await getPhantomAccount();
    if (!from.account) {
      setError('Failed to connect to Phantom wallet. Make sure Solana is the active account.');
      return;
    }
    const nonce = await getCryptoLoginNonce(from.account, from.network);
    const rawMsg = "App wants to connect to your wallet: " + nonce;
    const message = new TextEncoder().encode(rawMsg);
    // Using personal_sign
      // Note: personal_sign expects the message hex encoded, but MetaMask accepts the raw string
      try{
        const {signature} = await provider.signMessage(message, "utf8");
        const base58Signature = bs58.encode(signature);
        console.log("Signature (base58):", base58Signature);
        await api.post('/vendor-auth/phantom-login/', {
          crypto_address: from.account,
          signature: base58Signature,
          message: rawMsg
        })
        .then(response => {
          console.log(response.data);
          setError(null); // Clear any previous errors
          setAccount(from.account);
          setNetwork(from.network);
        })
        .catch(error => {
          console.error('Error:', error);
          setError('Login failed: ' + error.message);
        });
      }
     catch (error) {
      console.error('Error signing message:', error);
      setError('Signing failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex gap-4">
        {!account ?
      <button
        onClick={handleBackendLogin}
        className="px-4 py-2 bg-white text-black rounded-md hover:opacity-80 transition"
      >
        Connect
      </button>
      : <button
      onClick={disconnectWallet}
      className="px-4 py-2 bg-white text-black rounded-md hover:opacity-80 transition"
    >
      Disconnect {network ? `(${network})` : ''}
    </button>}
   
    </div>

    {account && (
      <p className="mt-2 text-sm text-green-400 text-center">
        ✅ Connected Address: <span className="font-semibold">
  {account.slice(0, 6)}...{account.slice(-4)}
</span>
      </p>
    )}
    {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}
  </div>
);

};

export default ConnectPhantomButton;
