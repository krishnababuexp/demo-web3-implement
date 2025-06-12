import { useState } from "react";
import { useMintNFT } from "../hooks/useMarketplace";
import { uploadToPinata } from "../utils/ipfsUtils";

export default function MintForm() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { mint } = useMintNFT();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload image");

    const metadataURI = await uploadToPinata(name, desc, file);
    await mint(metadataURI);
    alert("NFT Minted!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-md shadow-md">
      <input
        type="text"
        placeholder="Name"
        className="input input-bordered w-full"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="textarea textarea-bordered w-full"
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="file-input"
      />
      <button className="btn btn-primary" type="submit">Mint NFT</button>
    </form>
  );
}
