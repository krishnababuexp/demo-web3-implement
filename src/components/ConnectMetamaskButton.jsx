'use client';
import React, { useState } from 'react';
import api from '../api/apiInstance'; 
import { getCryptoLoginNonce } from '../utils/nonceUtils'; 
import {getMetamaskAccount} from '../utils/walletAccountUtils'; 
import { PulseLoader } from 'react-spinners';
function ConnectMetamaskButton() {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...');
    setAccount(null);
    setNetwork(null); // if you're storing network info too
    setError(null);
    setSignature(null);
  };

  const handleBackendLogin = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    const from = await getMetamaskAccount();
    
    const nonce = await getCryptoLoginNonce(from.account, from.network);
    const message = "App wants to connect with your wallet: " + nonce;
    console.log(nonce);
    // Using personal_sign
    try {
        // Note: personal_sign expects the message hex encoded, but MetaMask accepts the raw string.
        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, from.account],
        });
        setSignature(signature);
        console.log("Signature:", signature);
        await api.post('/vendor-auth/meta-mask-login/', {
          crypto_address: from.account,
          signature: signature,
          message: message
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
      } catch (error) {
        console.error('Error signing message:', error);
        setError('Signing failed: ' + error.message);
      }
      finally {
        setLoading(false);
      }
}

return (
  <div className="flex flex-col items-center gap-4 mt-4">
    <div className="flex gap-4">

    {loading ? (
        <PulseLoader color="#ffffff" size={10} />
      ) : (
        !account ?
          <button
            onClick={handleBackendLogin}
            className="px-4 py-2 bg-white text-black rounded-md hover:opacity-80 transition cursor-pointer"
          >
            Connect
          </button>
          : <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-white text-black rounded-md hover:opacity-80 transition cursor-pointer"
        >
          Disconnect {network ? `(${network})` : ''}
        </button>
      )}
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

export default ConnectMetamaskButton;
