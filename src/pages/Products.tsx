import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  brand?: string;
  category?: string;
  condition?: string;
  image?: string;
  description?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBrand, setActiveBrand] = useState("All Brand");
  const [searchParams] = useSearchParams();

  const categories = [
    "All",
    "DSLR",
    "Mirrorless",
    "Action Cam",
    "Drone",
    "Lensa",
    "Lighting",
    "Audio",
    "Tripod",
    "Gimbal",
    "Aksesoris",
  ];

  const brands = [
    "All Brand",
    "Canon",
    "Nikon",
    "Sony",
    "Fujifilm",
    "Panasonic",
    "Olympus",
    "GoPro",
    "DJI",
  ];

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }

    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();

      const activeProducts = data.filter((product: Product) => {
        return Number(product.stock) > 0;
      });

      setProducts(activeProducts);
    } catch {
      toast.error("Gagal mengambil produk");
    }
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const getImages = (image?: string) => {
    if (!image) return [];

    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed : [image];
    } catch {
      return [image];
    }
  };

  const getProductImage = (image?: string) => {
    const images = getImages(image);

    if (images.length === 0) {
      return "https://via.placeholder.com/500";
    }

    return `http://localhost:3000${images[0]}`;
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      activeCategory === "All" || product.category === activeCategory;

    const matchBrand =
      activeBrand === "All Brand" ||
      (product.brand || "").toLowerCase() === activeBrand.toLowerCase();

    const matchSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchBrand && matchSearch;
  });

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const images = getImages(product.image);
    const firstImage = images[0] || "";

    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: firstImage,
        qty: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Produk masuk keranjang");
  };

  const resetFilter = () => {
    setActiveCategory("All");
    setActiveBrand("All Brand");
    setSearch("");
  };

  const showActiveFilter =
    activeCategory !== "All" || activeBrand !== "All Brand" || search !== "";

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-900">
              Produk Kamera
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
            </p>
          </div>

          <div className="relative w-full md:w-[420px]">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={24}
            />

            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full pl-14 pr-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        <div className="mb-5">
          <h2 className="font-bold text-xl mb-4">Kategori Produk</h2>

          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-4 rounded-full font-bold text-lg transition ${
                  activeCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-bold text-xl mb-4">Merk Kamera</h2>

          <div className="flex gap-4 flex-wrap">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveBrand(brand)}
                className={`px-7 py-3 rounded-full font-bold text-lg transition ${
                  activeBrand === brand
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {showActiveFilter && (
          <div className="mb-12 flex items-center justify-between bg-white rounded-2xl px-6 py-4 border">
            <p className="font-semibold">
              Filter aktif:{" "}
              {activeCategory !== "All" && (
                <span className="text-red-600">{activeCategory}</span>
              )}
              {activeCategory !== "All" && activeBrand !== "All Brand" && " + "}
              {activeBrand !== "All Brand" && (
                <span className="text-red-600">{activeBrand}</span>
              )}
              {search !== "" && (
                <>
                  {(activeCategory !== "All" || activeBrand !== "All Brand") &&
                    " + "}
                  <span className="text-red-600">"{search}"</span>
                </>
              )}
            </p>

            <button
              onClick={resetFilter}
              className="bg-gray-200 px-5 py-2 rounded-xl font-bold hover:bg-gray-300"
            >
              Reset Filter
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow">
            <h2 className="text-3xl font-bold mb-3">Produk Tidak Ditemukan</h2>

            <p className="text-gray-500">
              Belum ada produk untuk kombinasi kategori dan merk ini.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const images = getImages(product.image);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-md overflow-hidden border hover:shadow-xl transition"
                >
                  <Link to={`/produk/${product.id}`}>
                    <div className="h-80 bg-gray-100 flex items-center justify-center p-6">
                      <img
                        src={getProductImage(product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm">
                        {product.category || "Kamera"}
                      </span>

                      <span className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
                        {product.condition || "NEW"}
                      </span>
                    </div>

                    <Link to={`/produk/${product.id}`}>
                      <h2 className="text-2xl font-extrabold mb-2 hover:text-red-600">
                        {product.name}
                      </h2>
                    </Link>

                    <p className="text-gray-500 mb-4">
                      {product.brand || "Warung Camera"}
                    </p>

                    {product.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="mb-5">
                      <p className="text-red-600 text-3xl font-extrabold">
                        {formatRupiah(product.price)}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Stok {product.stock}
                      </p>

                      <p className="text-gray-400 text-sm">
                        {images.length} gambar
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/produk/${product.id}`}
                        className="flex-1 bg-red-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-red-700 transition"
                      >
                        Lihat Detail
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white px-5 rounded-2xl hover:bg-gray-800 transition"
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}