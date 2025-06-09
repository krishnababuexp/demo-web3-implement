"use client";
import dynamic from "next/dynamic";
import "@rainbow-me/rainbowkit/styles.css";
import MintForm from "@/components/NFTMintForm";

export default function Home() {
  return (
    
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-4">Mint NFT</h1>
          <MintForm />
        </main>

  );
}
