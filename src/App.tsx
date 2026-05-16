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
      <div className="min-h-screen bg-[#f5f5f5] text-black font-sans flex flex-col">
        
        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="flex-1">
          <Routes>

            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* PRODUCTS */}
            <Route path="/products" element={<Products />} />
            <Route path="/produk" element={<Products />} />

            {/* PRODUCT DETAIL */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/produk/:id" element={<ProductDetail />} />

            {/* CART */}
            <Route path="/cart" element={<Cart />} />

            {/* LOGIN */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* ABOUT */}
            <Route path="/about" element={<Home />} />

            {/* PROMO */}
            <Route path="/promo" element={<Products />} />

          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />

        {/* TOASTER */}
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}