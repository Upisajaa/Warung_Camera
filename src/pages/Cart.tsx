import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
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
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(Array.isArray(savedCart) ? savedCart : []);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
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
      item.id === id ? { ...item, qty } : item
    );

    saveCart(newCart);
  };

  const clearCart = () => {
    if (!confirm("Kosongkan semua keranjang?")) return;

    saveCart([]);
    toast.success("Keranjang dikosongkan");
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );

  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleConfirmOrder = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    localStorage.setItem("checkoutItems", JSON.stringify(cart));
    localStorage.setItem(
      "checkoutSummary",
      JSON.stringify({
        subtotal,
        tax,
        total,
      })
    );

    toast.success("Pesanan dikonfirmasi");
    navigate("/payment");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-black">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 text-5xl font-black uppercase italic">
            Keranjang Kosong
          </h1>

          <p className="mb-10 text-gray-500">
            Belum ada produk di keranjang.
          </p>

          <Link
            to="/produk"
            className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 font-bold uppercase text-white transition hover:bg-red-600"
          >
            Lihat Produk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-5xl font-extrabold text-black">
          Keranjang Belanja
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {cart.map((item) => {
              const imageUrl = item.image?.startsWith("http")
                ? item.image
                : item.image
                ? `http://localhost:3000${item.image}`
                : "https://placehold.co/120x120";

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm md:flex-row"
                >
                  <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-gray-100 p-4">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h2 className="text-2xl font-bold text-black">
                          {item.name}
                        </h2>

                        <p className="mt-2 text-xl font-bold text-red-600">
                          {formatRupiah(item.price)}
                        </p>

                        <p className="mt-1 text-gray-500">
                          Pembayaran: {item.payment || "-"}
                        </p>

                        <p className="text-gray-500">Qty: {item.qty}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 transition hover:scale-110"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 rounded-xl bg-gray-100 px-4 py-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="hover:text-red-600"
                        >
                          <Minus />
                        </button>

                        <span className="text-lg font-bold">{item.qty}</span>

                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="hover:text-red-600"
                        >
                          <Plus />
                        </button>
                      </div>

                      <h2 className="text-2xl font-bold text-black">
                        {formatRupiah(Number(item.price) * item.qty)}
                      </h2>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="font-bold uppercase text-red-600 transition hover:text-red-700"
            >
              Kosongkan Keranjang
            </button>
          </div>

          <div>
            <div className="sticky top-32 rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-8 text-3xl font-bold text-black">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>PPN 11%</span>
                  <span>{formatRupiah(tax)}</span>
                </div>

                <div className="flex items-center justify-between border-t pt-5">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-red-600">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="mt-8 w-full rounded-2xl bg-red-600 py-4 font-bold text-white transition hover:bg-red-700"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}