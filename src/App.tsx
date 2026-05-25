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
import InfoPage from "./pages/InfoPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-black font-sans flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000 }}
        />

        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* PRODUCTS */}
            <Route path="/products" element={<Products />} />
            <Route path="/produk" element={<Products />} />

            {/* PRODUCT DETAIL */}
            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/produk/:id"
              element={<ProductDetail />}
            />

            {/* CART */}
            <Route path="/cart" element={<Cart />} />

            {/* PAYMENT */}
            <Route path="/payment" element={<Payment />} />

            {/* AUTH */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />

            {/* PROFILE */}
            <Route path="/profile" element={<Profile />} />

            {/* ORDERS */}
            <Route path="/orders" element={<OrdersPage />} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminDashboard />} />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            {/* ABOUT */}
            <Route path="/about" element={<About />} />
            <Route path="/tentang" element={<About />} />

            {/* PROMO */}
            <Route path="/promo" element={<Products />} />

            {/* FOOTER MENU */}
            <Route
              path="/pengiriman"
              element={<InfoPage />}
            />

            <Route
              path="/refund"
              element={<InfoPage />}
            />

            <Route
              path="/garansi"
              element={<InfoPage />}
            />

            <Route
              path="/faq"
              element={<InfoPage />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}