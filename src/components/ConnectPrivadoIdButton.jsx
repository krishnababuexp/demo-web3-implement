'use client';
import React, { useState } from 'react';
import {auth, resolver, protocol} from "@iden3/js-iden3-auth";
import QRModal from './QRModal';
import axios from 'axios';
function ConnectPrivadoIdButton() {
    const [account, setAccount] = useState(null);
      const [network, setNetwork] = useState(null);
      const [displayQR, setDisplayQR] = useState(false);
      const [qrRequest, setQRRequest] = useState(null);
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_VERIFIER_URL}/api/auth/did/login/init/`);
        console.log("verifier response",response.data);
        const hostUrl = process.env.NEXT_PUBLIC_VERIFIER_URL;
        const sessionId = 1;
        const callbackURL = "/api/callback";
        const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;
        const nonce = "privado id wallet nonce";
        const message = "App wants to connect with your wallet: " + nonce;
        const reason = "login";
        const audience = "did:polygonid:polygon:amoy:2qUZdNSFwKXVf4VLGSnaEBnzTei9rDY4qHYhZpadiU";
        const request = auth.createAuthorizationRequest(reason, audience, uri)
        const request_msg = auth.createAuthorizationRequestWithMessage(reason, message,audience, uri)

        // console.log(request_msg)
        // Base64 encode the verification request
        const base64EncodedRequest = btoa(JSON.stringify(request));
        
        // Define the URLs for redirection
        const url = `${process.env.NEXT_PUBLIC_VERIFIER_URL}?redirect_ext=https://metamask.dyneum.io`;
        const backUrl = encodeURIComponent(url);
        const finishUrl = encodeURIComponent(`${url}?sessionId=${sessionId}`);
        console.log(request)
        const final_url = `https://wallet.privado.id/#i_m=${base64EncodedRequest}=&back_url=${backUrl}&finish_url=${finishUrl}`;
        setQRRequest({"mobile":JSON.stringify(request), "web":final_url});
        setDisplayQR(true);
        // const scope = request.body.scope ?? [];
        // request.body.scope = [...scope, proofRequest];
      };
    return (
    <>
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
      <div className="flex flex-col items-center gap-4 mt-4">
      {displayQR && (
        <QRModal
          onClose={() => setDisplayQR(false)}
          qrValue={qrRequest}
        />
      )}
    </div>
  </>
  );
}

export default ConnectPrivadoIdButton;