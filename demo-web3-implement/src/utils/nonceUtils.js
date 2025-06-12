// src/hooks/useLogin.js or component
import api from "../api/apiInstance";

// React - Get message with nonce from backend
export const getCryptoLoginNonce = async (account, chain) => {
  console.log(account, chain);
  const res = await api.get("/vendor-auth/get-nonce", {
    params: { account, chain },
  });
  return res.data.nonce;
};
