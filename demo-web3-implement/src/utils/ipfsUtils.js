import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "",
  pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

export async function uploadToPinata(name, description, image) {
  const formData = new FormData();
  formData.append("file", image);

  // Upload image to IPFS via Pinata
  const imageRes = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        pinata_api_key: process.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: process.env.VITE_PINATA_SECRET_API_KEY, // only for server-side
      },
      body: formData,
    }
  );

  const imageData = await imageRes.json();
  const imageCID = imageData.IpfsHash;
  const imageUrl = `ipfs://${imageCID}`;

  // Call backend to pin metadata JSON
  const metadataRes = await fetch("/api/upload-metadata", {
    method: "POST",
    body: JSON.stringify({ name, description, image: imageUrl }),
    headers: { "Content-Type": "application/json" },
  });

  const metadataData = await metadataRes.json();
  return `ipfs://${metadataData.IpfsHash}`;
}
