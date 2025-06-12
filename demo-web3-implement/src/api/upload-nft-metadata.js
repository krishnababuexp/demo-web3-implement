// pages/api/upload-metadata.ts
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { name, description, image } = req.body;

  const metadata = {
    name,
    description,
    image, // ipfs://CID from previous step
  };

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          pinata_api_key: process.env.VITE_PINATA_API_KEY!,
          pinata_secret_api_key: process.env.VITE_PINATA_SECRET_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ IpfsHash: response.data.IpfsHash });
  } catch (err) {
    console.error("Metadata upload failed", err);
    res.status(500).json({ error: "Failed to upload metadata" });
  }
}
