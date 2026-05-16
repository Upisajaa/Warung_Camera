import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Minus,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

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

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`);
      const data = await res.json();

      if (data.product) {
        setProduct(data.product);
      } else {
        setProduct(data);
      }
    } catch (error) {
      toast.error("Gagal mengambil detail produk");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const handleMinus = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handlePlus = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Stok habis");
      return;
    }

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

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item: any) => item.id === product.id);

    if (existingProduct) {
      existingProduct.qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Produk berhasil ditambahkan ke keranjang");
  };

  const handleCheckout = async () => {
    if (!product) return;

    const total = product.price * qty;

    if (product.stock <= 0) {
      toast.error("Stok produk habis");
      return;
    }

    if (product.stock < qty) {
      toast.error("Stok produk tidak cukup");
      return;
    }

    const confirmCheckout = confirm(
      `Checkout produk ${product.name}?\n\nJumlah: ${qty}\nMetode: ${paymentMethod}\nTotal: ${formatRupiah(total)}`
    );

    if (!confirmCheckout) return;

    try {
      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: product.id,
              name: product.name,
              price: product.price,
              qty,
              paymentMethod,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Checkout gagal");
        return;
      }

      toast.success("Checkout berhasil");

      if (paymentMethod === "Transfer Bank") {
        alert(`
PEMBAYARAN TRANSFER BANK

Bank BCA
No Rekening: 1234567890
Atas Nama: Warung Camera

Total Pembayaran:
${formatRupiah(total)}

Silakan transfer sesuai nominal di atas.
        `);
      }

      if (paymentMethod === "QRIS") {
        alert(`
PEMBAYARAN QRIS

Silakan scan QRIS dinamis pada halaman produk.

Total Pembayaran:
${formatRupiah(total)}

Setelah pembayaran berhasil, pesanan akan diproses.
        `);
      }

      if (paymentMethod === "E-Wallet") {
        alert(`
PEMBAYARAN E-WALLET

DANA / OVO / GOPAY
Nomor: 08123456789
Atas Nama: Warung Camera

Total Pembayaran:
${formatRupiah(total)}
        `);
      }

      if (paymentMethod === "Kartu Kredit") {
        alert(`
PEMBAYARAN KARTU KREDIT

Metode: Visa / Mastercard

Total Pembayaran:
${formatRupiah(total)}

Anda akan diarahkan ke payment gateway.
        `);
      }

      fetchProduct();
      setQty(1);
    } catch (error) {
      toast.error("Gagal terhubung ke server");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Produk tidak ditemukan
      </div>
    );
  }

  const totalPrice = product.price * qty;

  const qrisValue = JSON.stringify({
    merchant: "Warung Camera",
    transaction_id: `INV-${product.id}-${qty}-${totalPrice}`,
    product_id: product.id,
    product: product.name,
    qty: qty,
    total: totalPrice,
    payment: "QRIS",
  });

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-3xl flex items-center justify-center p-8">
          <img
            src={
              product.image
                ? `http://localhost:3000${product.image}`
                : "https://via.placeholder.com/500"
            }
            alt={product.name}
            className="max-h-[500px] object-contain rounded-2xl"
          />
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-2">
            {product.brand || "Warung Camera"}
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          <h2 className="text-4xl font-extrabold text-red-600 mb-6">
            {formatRupiah(product.price)}
          </h2>

          <p className="text-gray-600 text-lg mb-6">
            {product.description ||
              "Produk kamera berkualitas untuk kebutuhan fotografi dan videografi."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-500">Kategori</p>
              <p className="font-bold">{product.category || "Kamera"}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-500">Kondisi</p>
              <p className="font-bold">{product.condition || "Baru"}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-bold text-lg mb-3">Jumlah</p>

            <div className="flex items-center gap-5">
              <button
                onClick={handleMinus}
                disabled={qty <= 1}
                className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
              >
                <Minus size={18} />
              </button>

              <span className="text-2xl font-bold">{qty}</span>

              <button
                onClick={handlePlus}
                disabled={product.stock <= 0 || qty >= product.stock}
                className="w-11 h-11 bg-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
              >
                <Plus size={18} />
              </button>

              <span className="text-gray-500">Stok: {product.stock}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-bold text-lg mb-3">Metode Pembayaran</p>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-4 py-3 text-lg"
            >
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="QRIS">QRIS</option>
              <option value="E-Wallet">E-Wallet</option>
              <option value="Kartu Kredit">Kartu Kredit</option>
            </select>

            <div className="mt-4 bg-gray-100 border rounded-2xl p-5">
              {paymentMethod === "Transfer Bank" && (
                <div>
                  <h3 className="font-bold text-xl mb-2">Transfer Bank</h3>
                  <p>Bank BCA</p>
                  <p>No Rekening: 1234567890</p>
                  <p>Atas Nama: Warung Camera</p>
                  <p className="mt-3 font-bold text-red-600">
                    Total: {formatRupiah(totalPrice)}
                  </p>
                </div>
              )}

              {paymentMethod === "QRIS" && (
                <div>
                  <h3 className="font-bold text-2xl mb-3">QRIS Payment</h3>

                  <p className="text-gray-600 mb-5">
                    Scan QR di bawah menggunakan mobile banking atau e-wallet.
                  </p>

                  <div className="bg-white border-2 rounded-3xl p-6 inline-block shadow-md">
                    <QRCode value={qrisValue} size={220} />

                    <div className="mt-5 text-center">
                      <p className="font-bold text-xl">WARUNG CAMERA</p>
                      <p className="text-gray-500 text-sm">
                        QRIS Dynamic Payment
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 bg-white rounded-2xl p-4 border">
                    <div className="flex justify-between mb-2">
                      <span>Produk</span>
                      <span className="font-semibold">{product.name}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span>Jumlah</span>
                      <span className="font-semibold">{qty}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-bold text-red-600 text-lg">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "E-Wallet" && (
                <div>
                  <h3 className="font-bold text-xl mb-2">E-Wallet</h3>
                  <p>DANA / OVO / GOPAY</p>
                  <p>Nomor: 08123456789</p>
                  <p>Atas Nama: Warung Camera</p>
                  <p className="mt-3 font-bold text-red-600">
                    Total: {formatRupiah(totalPrice)}
                  </p>
                </div>
              )}

              {paymentMethod === "Kartu Kredit" && (
                <div>
                  <h3 className="font-bold text-xl mb-2">Kartu Kredit</h3>
                  <p>Mendukung Visa dan Mastercard.</p>
                  <p>Pembayaran akan diproses melalui payment gateway.</p>
                  <p className="mt-3 font-bold text-red-600">
                    Total: {formatRupiah(totalPrice)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <div className="flex justify-between text-lg">
              <span>Total Pembayaran</span>
              <span className="font-extrabold text-red-600">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 disabled:opacity-50"
            >
              <ShoppingCart size={22} />
              Tambah Keranjang
            </button>

            <button
              onClick={handleCheckout}
              disabled={product.stock <= 0}
              className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-700 disabled:opacity-50"
            >
              <CreditCard size={22} />
              Checkout
            </button>
          </div>

          {product.stock <= 0 && (
            <p className="mt-4 text-red-600 font-semibold">
              Produk sedang habis.
            </p>
          )}

          <div className="flex items-center gap-3 mt-7 text-gray-500">
            <Truck size={22} />
            <p>Pengiriman tersedia seluruh Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  );
}