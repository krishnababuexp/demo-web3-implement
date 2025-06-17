// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Payment from "./pages/Payment";
import CreateNFT from "./pages/CreateNFT";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="payment" element={<Payment />} />
          <Route path="nft" element={<CreateNFT />} />
        </Route>
      </Routes>
    </Router>
  );
}
