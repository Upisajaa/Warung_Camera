/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AuthPage from './pages/Auth';
import AdminDashboard from './pages/Admin';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-gold/30">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#d4af37',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '0'
            },
          }}
        />
      </div>
    </Router>
  );
}

