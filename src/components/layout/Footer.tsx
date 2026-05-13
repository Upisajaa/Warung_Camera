import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Camera } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-white/10 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-gold" />
            <div>
              <h1 className="text-lg font-bold tracking-tighter text-white italic">Warung</h1>
              <p className="text-[8px] font-black uppercase tracking-widest text-gold">Camera</p>
            </div>
          </Link>
          <p className="text-white/40 text-[11px] uppercase tracking-widest leading-relaxed font-bold">
            Marketplace kamera profesional dan aksesori pilihan. Kami menyediakan gear berkualitas untuk fotografer dan videografer Indonesia.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-6 border-b border-gold/40 pb-2 inline-block">Hubungan</h4>
          <ul className="space-y-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
            <li><Link to="/products" className="hover:text-gold transition-colors">Produk</Link></li>
            <li><Link to="/products" className="hover:text-gold transition-colors">Kategori</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Blog</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-6 border-b border-gold/40 pb-2 inline-block">Layanan</h4>
          <ul className="space-y-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
            <li><Link to="/" className="hover:text-gold transition-colors">Pengiriman</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Pengembalian</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Garansi</Link></li>
            <li><Link to="/" className="hover:text-gold transition-colors">Cicilan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-[0.3em] text-[10px] mb-6 border-b border-gold/40 pb-2 inline-block">Newsletter</h4>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-4 font-bold">Dapatkan penawaran eksklusif dan tips fotografi.</p>
          <form className="flex gap-2 mb-6">
            <input 
              type="email" 
              placeholder="EMAIL@WARUNGCAMERA.COM" 
              className="bg-white/5 border border-white/10 px-4 py-2 text-[10px] flex-1 focus:outline-none focus:border-gold uppercase tracking-widest"
            />
            <button className="bg-white text-black text-[9px] uppercase font-black px-6 py-2 hover:bg-gold transition-all">
              Subscribe
            </button>
          </form>
          <div className="flex gap-4">
            <Instagram className="w-4 h-4 text-white/40 hover:text-gold transition-colors cursor-pointer" />
            <Twitter className="w-4 h-4 text-white/40 hover:text-gold transition-colors cursor-pointer" />
            <Youtube className="w-4 h-4 text-white/40 hover:text-gold transition-colors cursor-pointer" />
            <Facebook className="w-4 h-4 text-white/40 hover:text-gold transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
        <p>© 2026 Warung Camera. All Rights Reserved.</p>
        <div className="flex gap-8">
          <Link to="/" className="hover:text-white">Kebijakan Privasi</Link>
          <Link to="/" className="hover:text-white">Syarat dan Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}
