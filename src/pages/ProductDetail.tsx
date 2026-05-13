import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../services/firestore';
import { formatPrice } from '../lib/utils';
import { useStore } from '../store/useStore';
import { 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const wishlist = useStore((state) => state.wishlist);

  useEffect(() => {
    async function load() {
      if (id) {
        const data = await ProductService.getById(id);
        if (data) {
          setProduct(data);
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || `https://picsum.photos/seed/${product.id}/800/800`,
      quantity: 1
    });
    toast.success('Added to cart');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="aspect-square bg-dark-card rounded-[40px]" />
        <div className="space-y-8">
          <div className="h-12 bg-dark-card rounded-full w-2/3" />
          <div className="h-6 bg-dark-card rounded-full w-1/2" />
          <div className="h-32 bg-dark-card rounded-[20px] w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images Column */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-dark-card border border-white/10 relative p-8 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-dark-bg" />
            <img 
              src={product.images?.[activeImage] || `https://picsum.photos/seed/${product.id}/1000/1000`} 
              alt={product.name}
              className="relative z-10 w-full h-full object-contain opacity-90"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {(product.images || [1,2,3,4]).map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 bg-dark-card border transition-all flex-shrink-0 flex items-center justify-center p-2 ${activeImage === idx ? 'border-gold' : 'border-white/10 opacity-50 hover:opacity-100'}`}
              >
                <img 
                  src={typeof img === 'string' ? img : `https://picsum.photos/seed/${product.id + idx}/200/200`} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Column */}
        <div className="flex flex-col">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
                {product.category}
              </span>
              <span className="text-white/20 text-[10px] uppercase tracking-widest">|</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{product.brand}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-light font-serif italic tracking-tighter text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-gold">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium">Authenticity Guaranteed</span>
            </div>

            <p className="text-4xl font-mono text-gold mb-8 tracking-tighter">
              {formatPrice(product.price)}
            </p>

            <p className="text-white/50 leading-relaxed text-sm mb-10 max-w-xl font-sans">
              {product.description || "The ultimate tool for visual storytelling. Precision-engineered for excellence, this camera delivers unmatched clarity and creative control in any environment."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-dark-card p-5 border border-white/5">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-[0.2em] block mb-1">Condition</span>
                <span className="text-xs font-bold text-gold uppercase">{product.condition}</span>
              </div>
              <div className="bg-dark-card p-5 border border-white/5">
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-[0.2em] block mb-1">Availability</span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">{product.stock > 0 ? `In Stock` : 'Backordered'}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-gold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                Assemble Order
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 border flex items-center justify-center transition-all ${wishlist.includes(product.id) ? 'bg-gold/10 border-gold text-gold' : 'bg-transparent border-white/10 text-white/40 hover:border-white hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="mt-auto grid grid-cols-1 gap-4 border-t border-white/5 pt-10">
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider mb-0.5">Express Delivery</p>
                <p className="text-white/40">Free shipping for premium camera bodies.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-white/50" />
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider mb-0.5">Global Warranty</p>
                <p className="text-white/40">1-year worldwide coverage included.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
