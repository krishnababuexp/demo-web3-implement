import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Sidebar from "@/components/Sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata = {
  title: "Demo Web3 Implementation",
  keywords: ["web3", "nextjs", "metamask", "phantom", "privado"],
  authors: [
    {
      name: "Krishna Bhandari",
      url: "https://yourwebsite.com",
    },
  ],
  description:
    "A demo implementation of web3 wallet connections and other web3 features using Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Sidebar is fixed to the left */}
        <div className="flex min-h-screen">
          <aside className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 bg-white z-50">
            <Sidebar />
          </aside>

          {/* Main content area with padding to accommodate sidebar */}
          <main className="flex-1 pl-64 p-6 relative">{children}</main>
        </div>
      </body>
    </html>
  );
}
