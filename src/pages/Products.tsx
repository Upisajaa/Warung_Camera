import { useEffect, useState } from "react";
import { Search, Heart, Star } from "lucide-react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  image?: string;
  rating?: number | string;
  category?: {
    id: number;
    name: string;
  };
};

const categories = ["All", "DSLR", "Mirrorless", "Action Cam", "Drone", "Lensa", "Aksesoris"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      activeCategory === "All" || product.category?.name === activeCategory;

    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-[#f5f5f5] min-h-screen text-black">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-bold mb-3">Produk Kamera</h1>
            <p className="text-gray-600">Produk langsung dari database MySQL</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-5 outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                activeCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-black hover:bg-red-600 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition"
            >
              <div className="relative">
                <img
                  src={
                    product.image ||
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
                  }
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow">
                  <Heart size={20} />
                </button>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500 mb-2">
                  {product.category?.name || "Kamera"}
                </p>

                <h3 className="font-bold text-xl mb-3">{product.name}</h3>

                <div className="flex items-center gap-1 mb-4 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="text-black font-medium">
                    {Number(product.rating || 5)}
                  </span>
                </div>

                <p className="text-red-600 font-bold text-xl mb-5">
                  Rp {Number(product.price).toLocaleString("id-ID")}
                </p>

                <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition">
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}