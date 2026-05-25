import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Info,
  CreditCard,
} from "lucide-react";
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const getImages = (image?: string) => {
    if (!image) return [];

    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed : [image];
    } catch {
      return [image];
    }
  };

  const getImageUrl = (image?: string) => {
    if (!image) return "https://via.placeholder.com/500";
    if (image.startsWith("http")) return image;
    return `http://localhost:3000${image}`;
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);
      const data = await res.json();

      setProduct(data.product || data);
    } catch {
      toast.error("Gagal mengambil detail produk");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const handleMinus = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handlePlus = () => {
    if (!product) return;

    if (qty < product.stock) {
      setQty(qty + 1);
    } else {
      toast.error("Jumlah melebihi stok");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Stok produk habis");
      return;
    }

    const images = getImages(product.image);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      const newQty = existingProduct.qty + qty;

      if (newQty > product.stock) {
        toast.error("Jumlah keranjang melebihi stok");
        return;
      }

      existingProduct.qty = newQty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || "",
        qty,
        stock: product.stock,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Produk masuk keranjang");
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Stok produk habis");
      return;
    }

    if (qty > product.stock) {
      toast.error("Stok produk tidak cukup");
      return;
    }

    const images = getImages(product.image);

    const checkoutItems = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || "",
        qty,
        stock: product.stock,
      },
    ];

    const subtotal = product.price * qty;
    const tax = subtotal * 0.11;
    const total = subtotal + tax;

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({
        subtotal,
        tax,
        total,
      })
    );

    toast.success("Lanjut ke pembayaran");
    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Produk tidak ditemukan
      </div>
    );
  }

  const images = getImages(product.image);

  const currentImage =
    images.length > 0
      ? getImageUrl(images[activeImage])
      : "https://via.placeholder.com/500";

  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 rounded-3xl bg-white p-8 shadow-lg md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div>
          <div className="relative flex h-[560px] items-center justify-center rounded-3xl bg-gray-100 p-8">
            <img
              src={currentImage}
              alt={product.name}
              className="max-h-[500px] rounded-2xl object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-5 rounded-full bg-white p-3 shadow hover:bg-gray-200"
                >
                  <ChevronLeft size={28} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-5 rounded-full bg-white p-3 shadow hover:bg-gray-200"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-5 flex gap-3 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`rounded-xl border-2 p-1 ${
                    activeImage === index
                      ? "border-red-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`gambar-${index}`}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT DETAIL */}
        <div>
          <p className="mb-2 font-medium text-gray-500">
            {product.brand || "Warung Camera"}
          </p>

          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {product.name}
          </h1>

          <h2 className="mb-6 text-4xl font-extrabold text-red-600">
            {formatRupiah(product.price)}
          </h2>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-gray-500">Kategori</p>
              <p className="font-bold">{product.category || "Kamera"}</p>
            </div>

            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-gray-500">Kondisi</p>
              <p className="font-bold">{product.condition || "Baru"}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-lg font-bold">Jumlah</p>

            <div className="flex items-center gap-5">
              <button
                onClick={handleMinus}
                disabled={qty <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <Minus size={18} />
              </button>

              <span className="text-2xl font-bold">{qty}</span>

              <button
                onClick={handlePlus}
                disabled={qty >= product.stock}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <Plus size={18} />
              </button>

              <span className="text-gray-500">Stok: {product.stock}</span>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex justify-between text-lg">
              <span>Total Harga</span>
              <span className="font-extrabold text-red-600">
                {formatRupiah(product.price * qty)}
              </span>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-black py-4 text-lg font-bold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <ShoppingCart size={22} />
              Tambah Keranjang
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-red-600 py-4 text-lg font-bold text-white hover:bg-red-700 disabled:opacity-50"
            >
              <CreditCard size={22} />
              Beli Sekarang
            </button>
          </div>

          {/* KETERANGAN PRODUK DIPINDAHKAN KE SINI */}
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow">
                <Info size={16} />
              </div>

              <div>
                <h3 className="mb-1 text-lg font-bold text-red-600">
                  Keterangan Produk
                </h3>

                <p className="text-xs text-gray-500">
                  Detail kondisi dan informasi tambahan produk
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-white px-4 py-3">
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {product.description || "Tidak ada keterangan produk."}
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3 text-gray-500">
            <Truck size={22} />
            <p>Pengiriman tersedia seluruh Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  );
}