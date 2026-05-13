import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const cartCount = useStore((state) => state.cart.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistCount = useStore((state) => state.wishlist.length);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 py-4",
      isScrolled ? "bg-dark-bg/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Camera className="w-6 h-6 text-gold" />
          <div>
            <h1 className="text-lg font-bold tracking-tighter text-white italic">Warung</h1>
            <p className="text-[8px] font-black uppercase tracking-widest text-gold">Camera</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-white transition-colors">Home</Link>
          <Link to="/products" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-gold transition-colors">Kategori</Link>
          <Link to="/products" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-white transition-colors">Produk</Link>
          <Link to="/products" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-white transition-colors">Promo</Link>
          <Link to="/" className="text-sm font-medium uppercase tracking-widest text-white/70 hover:text-white transition-colors">Tentang</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/wishlist" className="relative group p-2">
            <Heart className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold px-1 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative group p-2">
            <ShoppingCart className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold px-1 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/auth" className="hidden md:flex items-center gap-2 text-sm font-medium bg-gold/20 hover:bg-gold/30 px-4 py-2 rounded-full transition-colors border border-gold/40 text-gold">
            <User className="w-4 h-4" />
            {user ? 'Profile' : 'Login/Register'}
          </Link>
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-dark-bg border-t border-white/10 p-6 md:hidden flex flex-col gap-4"
          >
            <Link to="/" className="text-lg font-medium uppercase tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-lg font-medium uppercase tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>Kategori</Link>
            <Link to="/products" className="text-lg font-medium uppercase tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>Produk</Link>
            <Link to="/products" className="text-lg font-medium uppercase tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>Promo</Link>
            <Link to="/" className="text-lg font-medium uppercase tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
            <div className="border-t border-white/10 my-4 pt-4">
              <Link to="/wishlist" className="flex items-center gap-2 text-lg font-medium text-white mb-3" onClick={() => setIsMobileMenuOpen(false)}>
                <Heart className="w-5 h-5" /> Wishlist ({wishlistCount})
              </Link>
              <Link to="/cart" className="flex items-center gap-2 text-lg font-medium text-white mb-3" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5" /> Keranjang ({cartCount})
              </Link>
              <Link to="/auth" className="flex items-center gap-2 text-lg font-medium text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="w-5 h-5" /> {user ? 'Profile' : 'Login/Register'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
