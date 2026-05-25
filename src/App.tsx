import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import AuthPage from "./pages/Auth";
import AdminDashboard from "./pages/Admin";
import OrdersPage from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import About from "./pages/About";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-black font-sans flex flex-col">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />
            <Route path="/produk" element={<Products />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/produk/:id" element={<ProductDetail />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/payment" element={<Payment />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrdersPage />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />

            <Route path="/about" element={<About />} />
            <Route path="/tentang" element={<About />} />

            <Route path="/promo" element={<Products />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}