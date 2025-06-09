// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { HomeIcon, User, WalletIcon } from "lucide-react";
import Payment from "@/pages/Payment";
import Home from "@/pages/Home";
export default function Sidebar() {
  const links = [
    { href: "/", label: "Home", icon: <HomeIcon size={20} /> },
    { href: "/Payment", label: "Payment", icon: <WalletIcon size={20} /> },
    // { href: "/CreateNFT", label: "Craete NFT", icon: <WalletIcon size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 space-y-6">
      <div className="text-2xl font-bold border-b border-gray-700 pb-4">MyApp</div>
      <nav className="space-y-4">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center space-x-2 hover:text-blue-400"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}