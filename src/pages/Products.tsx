import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  brand?: string;
  category?: string;
  condition?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const categories = [
    "All",
    "DSLR",
    "Mirrorless",
    "Action Cam",
    "Drone",
    "Lensa",
    "Aksesoris",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === "All"
          ? true
          : product.category === selectedCategory;

      const matchStock = Number(product.stock) > 0;

      return matchSearch && matchCategory && matchStock;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-6xl font-bold mb-3">
              Produk Kamera
            </h1>

            <p className="text-gray-600 text-xl">
              Produk langsung dari database MySQL
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full lg:w-[420px] border border-gray-300 rounded-full py-4 pl-14 pr-5 outline-none bg-white"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-4 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? "bg-red-600 text-white"
                  : "bg-white text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {

              const imageUrl = product.image
                ? `http://localhost:3000${product.image}`
                : "https://placehold.co/600x400";

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition"
                >
                  {/* IMAGE */}
                  <div className="bg-gray-100 h-[280px] flex items-center justify-center p-6">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="max-h-full object-contain"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                        {product.category}
                      </span>

                      <span className="bg-black text-white px-4 py-1 rounded-full text-sm">
                        {product.condition}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 mb-4">
                      {product.brand}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <p className="text-3xl font-bold text-red-600">
                        Rp{" "}
                        {Number(product.price).toLocaleString("id-ID")}
                      </p>

                      <span className="text-gray-500">
                        Stok {product.stock}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <div className="flex gap-3">

                      <Link
                        to={`/produk/${product.id}`}
                        className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-semibold text-center hover:bg-red-700 transition"
                      >
                        Lihat Detail
                      </Link>

                      <button
                        className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center"
                      >
                        <ShoppingCart size={22} />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl mt-20">
            Produk tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}