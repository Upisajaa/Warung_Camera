import { useStore } from '../store/useStore';
import { formatPrice } from '../lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + tax;

  const handleCheckout = () => {
    toast.success('Checkout process started!');
    // Simulation of transaction creation could go here
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
          <ShoppingBag className="w-10 h-10 text-white/20" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Your Bag is Empty</h1>
        <p className="text-white/40 mb-10 max-w-sm mx-auto">Looks like you haven't picked out any gear yet. Explore our latest catalog to find your next companion.</p>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-gold transition-all"
        >
          Explore Gear <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-light font-serif italic tracking-tighter text-white mb-12 uppercase">
        In Your <span className="text-gold italic font-black">Bag.</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col sm:flex-row gap-6 p-5 bg-dark-card border border-white/10 relative group"
              >
                <div className="w-28 h-28 bg-dark-bg border border-white/5 flex-shrink-0 flex items-center justify-center p-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-serif italic text-white tracking-tighter">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-white/20 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm font-mono text-gold mb-auto">{formatPrice(item.price)}</p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-white/30 tracking-[0.2em]">Total: {formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <button 
            onClick={clearCart}
            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors mt-4"
          >
            Clear bag contents
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-surface border border-white/10 p-8 sticky top-32">
            <h2 className="text-xl font-serif italic tracking-tighter text-white mb-8 border-b border-white/5 pb-6 uppercase">Shipment Detail</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-white/40">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-white/40">Tax (11%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-white/40">Express Courier</span>
                <span className="text-gold">COMPLIMENTARY</span>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/60">Grand Total</span>
                <span className="text-2xl font-mono text-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-gold transition-all flex items-center justify-center gap-3"
            >
              Confirm Order
            </button>
            
            <p className="mt-6 text-[9px] text-white/20 uppercase tracking-[0.2em] text-center">
              Global shipping insurance applied automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
