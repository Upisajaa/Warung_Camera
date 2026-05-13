import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AuthPage from "./pages/Auth";
import AdminDashboard from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-black font-sans">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/promo" element={<Products />} />
          <Route path="/about" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <Footer />

        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}