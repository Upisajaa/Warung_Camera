import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Upload, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

export default function Payment() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("checkoutItems") || "[]");

    if (!Array.isArray(savedItems) || savedItems.length === 0) {
      toast.error("Data checkout kosong");
      navigate("/cart");
      return;
    }

    setItems(savedItems);
  }, [navigate]);

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const getImageUrl = (image?: string) => {
    if (!image) return "https://placehold.co/120x120";
    if (image.startsWith("http")) return image;
    return `http://localhost:3000${image}`;
  };

  const handleSubmitPayment = async () => {
    if (!paymentProof) {
      toast.error("Upload bukti pembayaran dulu");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("items", JSON.stringify(items));
      formData.append("userEmail", currentUser.email || "-");
      formData.append("userName", currentUser.name || "User");
      formData.append("total", String(total));
      formData.append("paymentMethod", paymentMethod);
      formData.append("paymentProof", paymentProof);

      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Pembayaran gagal");
        return;
      }

      const proofUrl = data.order?.paymentProof
        ? `http://localhost:3000${data.order.paymentProof}`
        : URL.createObjectURL(paymentProof);

      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");

      const newOrder = {
        id: Date.now(),
        buyerName: currentUser.name || "User",
        buyerEmail: currentUser.email || "-",
        product: items.map((item) => item.name).join(", "),
        image: getImageUrl(items[0]?.image),
        price: subtotal,
        qty: items.reduce((acc, item) => acc + item.qty, 0),
        total,
        payment: paymentMethod,
        paymentProof: proofUrl,
        paymentStatus: "Menunggu Konfirmasi Admin",
        status: "Menunggu Diproses",
        courier: "",
        receipt: "",
        address: currentUser.address || "Bandung, Indonesia",
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        timeline: [
          {
            title: "Pesanan Dibuat",
            description: "User checkout dan mengirim bukti pembayaran.",
            time: new Date().toLocaleString("id-ID"),
          },
        ],
      };

      localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("checkoutSummary");

      toast.success("Pembayaran berhasil dikirim ke admin");

      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const qrisValue = JSON.stringify({
    merchant: "Warung Camera",
    invoice: `INV-${Date.now()}`,
    total,
    payment: "QRIS",
  });

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/cart")}
          className="mb-8 flex items-center gap-2 font-bold text-gray-600 hover:text-red-600"
        >
          <ArrowLeft size={20} />
          Kembali ke Keranjang
        </button>

        <h1 className="mb-10 text-5xl font-extrabold text-black">
          Transaksi Pembayaran
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-3xl bg-white p-6 shadow-sm"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-28 w-28 rounded-2xl bg-gray-100 object-contain"
                />

                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{item.name}</h2>

                  <p className="mt-2 text-gray-500">
                    Qty: <span className="font-bold">{item.qty}</span>
                  </p>

                  <p className="mt-2 text-2xl font-bold text-red-600">
                    {formatRupiah(item.price * item.qty)}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Metode Pembayaran</h2>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-4 text-lg outline-none focus:border-red-600"
              >
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="QRIS">QRIS</option>
                <option value="E-Wallet">E-Wallet</option>
              </select>

              <div className="mt-6 rounded-2xl border bg-gray-50 p-6">
                {paymentMethod === "Transfer Bank" && (
                  <div>
                    <h3 className="mb-3 text-xl font-bold">Transfer Bank</h3>
                    <p>Bank BCA</p>
                    <p>No Rekening: 1234567890</p>
                    <p>Atas Nama: Warung Camera</p>
                    <p className="mt-4 font-bold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}

                {paymentMethod === "QRIS" && (
                  <div>
                    <h3 className="mb-4 text-xl font-bold">QRIS Payment</h3>

                    <div className="inline-block rounded-3xl border bg-white p-6">
                      <QRCode value={qrisValue} size={220} />
                      <p className="mt-4 text-center font-bold">
                        WARUNG CAMERA
                      </p>
                    </div>

                    <p className="mt-4 font-bold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}

                {paymentMethod === "E-Wallet" && (
                  <div>
                    <h3 className="mb-3 text-xl font-bold">E-Wallet</h3>
                    <p>DANA / OVO / GOPAY</p>
                    <p>Nomor: 08123456789</p>
                    <p>Atas Nama: Warung Camera</p>
                    <p className="mt-4 font-bold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <label className="mb-4 flex items-center gap-2 text-xl font-bold">
                <Upload size={24} />
                Upload Bukti Pembayaran
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-gray-300 p-4"
              />

              {paymentProof ? (
                <p className="mt-3 font-semibold text-green-600">
                  Bukti dipilih: {paymentProof.name}
                </p>
              ) : (
                <p className="mt-3 font-semibold text-red-600">
                  Bukti pembayaran wajib diupload.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-32 rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="mb-8 text-3xl font-bold">Ringkasan Pembayaran</h2>

              <div className="space-y-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>PPN 11%</span>
                  <span>{formatRupiah(tax)}</span>
                </div>

                <div className="flex justify-between border-t pt-5 text-xl font-bold">
                  <span>Total</span>
                  <span className="text-3xl text-red-600">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitPayment}
                disabled={loading || !paymentProof}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white transition ${
                  loading || !paymentProof
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <CreditCard size={22} />
                {loading ? "Mengirim..." : "Kirim Pembayaran"}
              </button>

              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
                <CheckCircle2 size={18} />
                Bukti pembayaran akan dikirim ke admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}