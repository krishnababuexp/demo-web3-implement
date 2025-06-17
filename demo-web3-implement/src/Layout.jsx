// src/Layout.jsx
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
  <Sidebar /> {/* fixed left sidebar */}
  <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
    <Outlet /> {/* renders form or page content */}
  </main>
</div>

  );
}
