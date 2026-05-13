import { useState, useEffect } from 'react';
import { ProductService, CategoryService } from '../services/firestore';
import { formatPrice, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, Grid, List as ListIcon } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function load() {
      const [prodData, catData] = await Promise.all([
        ProductService.getAll(),
        CategoryService.getAll()
      ]);
      setProducts(prodData || []);
      setCategories(catData || []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-light italic font-serif text-white uppercase tracking-tighter">Inventory</h1>
          <p className="text-white/40 text-[10px] uppercase tracking-widest italic mt-2">Curated selection of high-performance optics</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search gear..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-xs focus:outline-none focus:border-gold/50 transition-all font-medium"
            />
          </div>
          <button className="bg-white/5 border border-white/10 p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/60">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-48 space-y-10">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Categories
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-1">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] text-left px-4 py-2 transition-all ${selectedCategory === 'All' ? 'text-gold' : 'text-white/40 hover:text-white'}`}
              >
                All Gear
              </button>
              {['Mirrorless', 'DSLR', 'Lens', 'Drone', 'Audio'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] text-left px-4 py-2 transition-all ${selectedCategory === cat ? 'text-gold' : 'text-white/40 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] bg-dark-card border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} to={`/product/${product.id}`} className="group bg-dark-card border border-white/10 p-4 transition-all hover:border-gold/40 cursor-pointer">
                  <div className="aspect-square bg-dark-bg mb-4 flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/1000/1000`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={cn(
                        "px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                        product.condition === 'New' ? "bg-white text-black" : "bg-gold text-black"
                      )}>
                        {product.condition === 'New' ? 'NEW' : 'PRE-OWNED'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-serif italic text-white mb-1 group-hover:text-gold transition-colors leading-tight">
                        {product.name}
                      </h4>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest">{product.category} • {product.brand}</p>
                    </div>
                    <p className="text-lg font-mono text-gold tracking-tighter">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-dark-surface border border-white/5">
              <p className="text-white/40 uppercase tracking-widest font-bold text-[10px]">No gear found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
