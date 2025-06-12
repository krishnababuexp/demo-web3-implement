// src/components/Sidebar.jsx
import { Link } from "react-router-dom";
import { HomeIcon, WalletIcon } from "lucide-react";

export default function Sidebar() {
  const links = [
    { to: "/", label: "Home", icon: <HomeIcon size={20} /> },
    { to: "/payment", label: "Payment", icon: <WalletIcon size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6 space-y-6">
      <div className="text-2xl font-bold border-b border-gray-700 pb-4">MyApp</div>
      <nav className="space-y-4">
        {links.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
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
