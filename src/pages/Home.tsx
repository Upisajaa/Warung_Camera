import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const categories = [
    { name: 'DSLR', icon: '📷', slug: 'dslr' },
    { name: 'Mirrorless', icon: '📸', slug: 'mirrorless' },
    { name: 'Action Cam', icon: '🎬', slug: 'action-cam' },
    { name: 'Drone', icon: '🛸', slug: 'drone' },
    { name: 'Lensa', icon: '🔭', slug: 'lens' },
    { name: 'Lensa', icon: '🔭', slug: 'lens' },
    { name: 'Aksesori', icon: '⚙️', slug: 'aksesori' },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Camera" 
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 bg-gold text-black text-[9px] font-bold uppercase tracking-[0.3em] mb-6">
              Flash Sale Minggu Ini: Diskon hingga 30% untuk Lensa Sony & Fujifilm!
            </span>
            <h1 className="text-6xl md:text-8xl font-light font-serif tracking-tighter leading-[0.9] mb-8 italic">
              Capture <br /> 
              <span className="text-gold">Perfection.</span>
            </h1>
            <p className="text-lg text-white/40 mb-10 leading-relaxed max-w-lg font-sans">
              Marketplace Kamera No. 1 untuk Profesional & Kreator. Teknologi Mutakhir, Transaksi Aman.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products"
                className="group bg-white text-black px-8 py-4 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-gold transition-all"
              >
                Jelajahi Produk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 border border-white/10 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Kategori
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4">Jelajahi</h2>
            <h3 className="text-4xl font-light italic font-serif tracking-tighter text-white">Kategori Populer</h3>
          </div>
          <Link to="/products" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-gold transition-colors">
            Lihat Semua
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-64 bg-dark-card border border-white/5 transition-all hover:border-gold/40 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500 scale-125 group-hover:scale-150">
                {cat.icon}
              </div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h4 className="text-xl font-serif italic tracking-tighter text-white group-hover:text-gold transition-colors">{cat.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Peek */}
      <section className="bg-dark-surface py-24 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold mb-4 border border-gold/20 px-4 py-1.5 inline-block">Trending</h2>
          <h3 className="text-5xl font-light italic font-serif tracking-tighter text-white mt-4">Produk Populer</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Placeholder for products - will be dynamic */}
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-dark-card border border-white/10 p-4 transition-all hover:border-gold/40 relative mb-6">
                   <div className="w-full h-full bg-dark-bg flex items-center justify-center overflow-hidden">
                     <img 
                      src={`https://picsum.photos/seed/${i + 50}/800/1000`} 
                      alt="Gear" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                     />
                   </div>
                   <div className="absolute top-6 right-6">
                      <div className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all">
                        <Heart className="w-5 h-5 text-white/60" />
                      </div>
                   </div>
                   <div className="absolute top-6 left-6 flex gap-2">
                      <span className="bg-gold text-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">New</span>
                      <span className="bg-white/10 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">4.50⭐</span>
                   </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-serif italic text-white mb-1 group-hover:text-gold transition-colors line-clamp-2">Fujifilm X-T5</h4>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest">Mirrorless • Fujifilm</p>
                  </div>
                  <p className="text-sm font-mono text-gold tracking-tighter whitespace-nowrap">Rp 21,5jt</p>
                </div>
                <button className="w-full mt-3 bg-gold text-black py-2 font-bold uppercase text-[9px] tracking-widest hover:bg-white transition-all">
                  Tambah Keranjang
                </button>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
