import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { ProductService } from '../services/firestore';
import { formatPrice } from '../lib/utils';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Package, 
  Users, 
  Settings, 
  Database,
  Search,
  ExternalLink,
  Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'Mirrorless',
    brand: 'Sony',
    condition: 'New',
    stock: 10,
    description: '',
    images: ['']
  });

  useEffect(() => {
    async function checkAdmin() {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
          const prods = await ProductService.getAll();
          setProducts(prods || []);
        } else {
          toast.error('Admin access denied');
        }
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.create(formData);
      toast.success('Product created');
      setIsAdding(false);
      const prods = await ProductService.getAll();
      setProducts(prods || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this gear?')) {
      await ProductService.delete(id);
      toast.success('Deleted');
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const seedDummyData = async () => {
    const dummy = [
      { name: 'Sony A7 III', price: 23000000, category: 'Mirrorless', brand: 'Sony', condition: 'New', stock: 5, description: 'Legendary full-frame mirrorless camera.', images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800'] },
      { name: 'Canon EOS R6', price: 32000000, category: 'Mirrorless', brand: 'Canon', condition: 'New', stock: 3, description: 'Speed and resolution combined.', images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800'] },
      { name: 'Fujifilm X-T4', price: 21000000, category: 'Mirrorless', brand: 'Fujifilm', condition: 'New', stock: 8, description: 'Pure analog feel with digital mastery.', images: ['https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800'] },
      { name: 'DJI Mavic 3', price: 28000000, category: 'Drone', brand: 'DJI', condition: 'New', stock: 4, description: 'See everything from above.', images: ['https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=800'] },
      { name: 'Nikon Z6 II', price: 27000000, category: 'Mirrorless', brand: 'Nikon', condition: 'New', stock: 2, description: 'The next step in imaging.', images: ['https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=800'] },
    ];

    toast.loading('Seeding data...');
    for (const item of dummy) {
      await ProductService.create(item);
    }
    const prods = await ProductService.getAll();
    setProducts(prods || []);
    toast.dismiss();
    toast.success('Marketplace populated!');
  };

  if (loading) return <div className="p-24 text-center uppercase tracking-widest text-xs font-black animate-pulse">Checking credentials...</div>;
  
  if (!isAdmin) return (
    <div className="max-w-7xl mx-auto px-6 py-24 text-center">
      <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
        <Settings className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-4xl font-light font-serif italic uppercase tracking-tighter text-white mb-4">Restricted Zone</h1>
      <p className="text-white/40 mb-10 text-[10px] uppercase tracking-widest">You must be logged in as an administrator to access the command center.</p>
      
      {auth.currentUser && (
        <button 
          onClick={async () => {
            const userRef = doc(db, 'users', auth.currentUser!.uid);
            await setDoc(userRef, { role: 'admin' }, { merge: true });
            window.location.reload();
          }}
          className="bg-white text-black px-10 py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-gold transition-all"
        >
          Promote to Admin
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light font-serif italic uppercase tracking-tighter leading-none mb-4 text-white">Command Center</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">LensCraft Control Panel v1.0.4</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={seedDummyData}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white/60"
          >
            <Database className="w-4 h-4" /> Seed Assets
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all"
          >
            <Plus className="w-4 h-4" /> New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="col-span-1 p-6 bg-dark-card border border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Total Inventory</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-serif italic text-white">{products.length}</h3>
            <Package className="w-5 h-5 text-gold opacity-50" />
          </div>
        </div>
        <div className="col-span-1 p-6 bg-dark-card border border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Active Users</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-serif italic text-white">148</h3>
            <Users className="w-5 h-5 text-gold opacity-50" />
          </div>
        </div>
        <div className="col-span-1 p-6 bg-dark-card border border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">Revenue (30d)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-serif italic tracking-tighter text-gold">$148k</h3>
            <div className="w-5 h-5 flex items-center justify-center opacity-50 text-gold">$</div>
          </div>
        </div>
        <div className="col-span-1 p-6 bg-dark-card border border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">System Status</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-serif italic text-green-500">Live</h3>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mb-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-dark-surface border border-white/10 overflow-hidden">
        <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between gap-6">
          <h2 className="text-xl font-serif italic tracking-tighter uppercase text-white">Inventory Management</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Filter inventory..." className="bg-white/5 border border-white/10 px-4 py-2 pl-12 pr-6 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-gold transition-all" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                <th className="px-8 py-6">ID / Asset</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Price Point</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 border border-white/5 overflow-hidden flex-shrink-0 bg-dark-bg">
                        <img src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/100/100`} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-serif italic tracking-tighter text-white text-base leading-tight">{p.name}</p>
                        <p className="text-[9px] text-white/20 uppercase tracking-widest font-mono mt-1">{p.id.substring(0, 12)}... • {p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gold/10 text-gold px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-gold/20">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right font-mono text-gold text-sm">{formatPrice(p.price)}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-white/20 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(p.id)} className="p-2 text-white/20 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                       <a href={`/product/${p.id}`} target="_blank" rel="noreferrer" className="p-2 text-white/20 hover:text-gold transition-colors"><ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dark-bg/95 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-dark-card border border-white/10 p-10 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light font-serif italic uppercase tracking-tighter text-white">Register Asset</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/5 transition-colors"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Price Point</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold appearance-none">
                  <option value="Mirrorless">Mirrorless</option>
                  <option value="DSLR">DSLR</option>
                  <option value="Lens">Lens</option>
                  <option value="Drone">Drone</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Manufacturer</label>
                <select value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold appearance-none">
                  <option value="Sony">Sony</option>
                  <option value="Canon">Canon</option>
                  <option value="Nikon">Nikon</option>
                  <option value="Fujifilm">Fujifilm</option>
                  <option value="DJI">DJI</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Stock Reserve</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Asset Visual (URL)</label>
                <input type="text" value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} placeholder="https://..." className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Curator Notes</label>
                <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 py-4 px-6 text-xs focus:outline-none focus:border-gold resize-none"></textarea>
              </div>
              <button type="submit" className="md:col-span-2 bg-white text-black py-5 font-bold uppercase text-[10px] tracking-widest hover:bg-gold transition-all">Authorize Final Registration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

