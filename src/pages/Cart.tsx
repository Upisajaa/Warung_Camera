import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  qty: number;
  stock?: number;
  payment?: string;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeFromCart = (id: number) => {
    const newCart = cart.filter((item) => item.id !== id);

    saveCart(newCart);

    toast.success("Produk dihapus dari keranjang");
  };

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return;

    const product = cart.find((item) => item.id === id);

    if (product?.stock && qty > product.stock) {
      toast.error("Melebihi stok produk");
      return;
    }

    const newCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            qty,
          }
        : item
    );

    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    toast.success("Keranjang dikosongkan");
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );

  const tax = subtotal * 0.11;

  const total = subtotal + tax;

  const checkout = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Checkout gagal");
        return;
      }

      toast.success("Checkout berhasil");

      saveCart([]);

      setTimeout(() => {
        window.location.href = "/produk";
      }, 1500);
    } catch (error) {
      console.log(error);

      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-10 h-10 text-white/40" />
        </div>

        <h1 className="text-5xl font-black uppercase italic mb-4">
          Keranjang Kosong
        </h1>

        <p className="text-gray-500 mb-10">
          Belum ada produk di keranjang
        </p>

        <Link
          to="/produk"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-bold uppercase"
        >
          Lihat Produk
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold mb-12">
        Keranjang Belanja
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CART */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => {
            const imageUrl = item.image
              ? `http://localhost:3000${item.image}`
              : "https://placehold.co/100x100";

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow p-6 flex gap-6"
              >
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center p-4">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {item.name}
                      </h2>

                      <p className="text-red-600 font-bold text-xl mt-2">
                        Rp{" "}
                        {Number(item.price).toLocaleString("id-ID")}
                      </p>

                      <p className="text-gray-500 mt-1">
                        Pembayaran: {item.payment}
                      </p>

                      <p className="text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl">
                      <button
                        onClick={() =>
                          updateQty(item.id, item.qty - 1)
                        }
                      >
                        <Minus />
                      </button>

                      <span className="font-bold text-lg">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.id, item.qty + 1)
                        }
                      >
                        <Plus />
                      </button>
                    </div>

                    <h2 className="text-2xl font-bold">
                      Rp{" "}
                      {(
                        Number(item.price) * item.qty
                      ).toLocaleString("id-ID")}
                    </h2>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-red-600 font-bold uppercase"
          >
            Kosongkan Keranjang
          </button>
        </div>

        {/* SUMMARY */}
        <div>
          <div className="bg-white rounded-3xl shadow p-8 sticky top-32">
            <h2 className="text-3xl font-bold mb-8">
              Ringkasan Pesanan
            </h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex justify-between">
                <span>PPN 11%</span>

                <span>
                  Rp {tax.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="border-t pt-5 flex justify-between items-center">
                <span className="font-bold text-xl">
                  Total
                </span>

                <span className="text-3xl text-red-600 font-bold">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={checkout}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-8 hover:bg-red-600 transition"
            >
              {loading
                ? "Memproses..."
                : "Konfirmasi Pesanan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}