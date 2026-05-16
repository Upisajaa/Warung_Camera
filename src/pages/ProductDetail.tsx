import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  brand?: string;
  category?: string;
  condition?: string;
  description?: string;
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("Transfer Bank");

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product || null);
      })
      .catch(() => {
        setProduct(null);
      });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Produk tidak ditemukan</h1>
      </div>
    );
  }

  const imageUrl = product.image
    ? `http://localhost:3000${product.image}`
    : "https://placehold.co/500x400";

  const total = Number(product.price) * qty;

  const addToCart = () => {
    const oldCart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
      payment,
    };

    localStorage.setItem("cart", JSON.stringify([...oldCart, newItem]));

    toast.success("Produk berhasil ditambahkan ke keranjang");
  };

  const checkout = () => {
    addToCart();
    toast.success(`Checkout dengan metode ${payment}`);
    window.location.href = "/cart";
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-8 py-14">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow p-10 grid md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-3xl p-8 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-[420px] object-contain"
          />
        </div>

        <div>
          <p className="text-red-600 font-semibold mb-3">
            {product.category} • {product.condition}
          </p>

          <h1 className="text-5xl font-bold mb-4">{product.name}</h1>

          <p className="text-gray-500 text-xl mb-4">
            Brand: {product.brand || "-"}
          </p>

          <p className="text-4xl font-bold text-red-600 mb-6">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>

          <p className="text-gray-600 mb-6">
            {product.description || "Produk kamera berkualitas untuk kebutuhan fotografi dan videografi."}
          </p>

          <div className="mb-6">
            <p className="font-semibold mb-2">Jumlah</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg text-xl"
              >
                -
              </button>

              <span className="text-xl font-bold">{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 bg-gray-200 rounded-lg text-xl"
              >
                +
              </button>

              <span className="text-gray-500 ml-4">
                Stok: {product.stock}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-semibold mb-2">Metode Pembayaran</p>

            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option>Transfer Bank</option>
              <option>QRIS</option>
              <option>E-Wallet</option>
              <option>Kartu Kredit</option>
            </select>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 mb-6">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-bold text-red-600">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Tambah Keranjang
            </button>

            <button
              onClick={checkout}
              className="flex-1 bg-red-600 text-white py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              Checkout
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-gray-500">
            <Truck size={20} />
            Pengiriman tersedia seluruh Indonesia
          </div>
        </div>
      </div>
    </div>
  );
}