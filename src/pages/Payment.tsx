import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Upload,
  ArrowLeft,
  CheckCircle2,
  Wallet,
  Building2,
  Smartphone,
} from "lucide-react";
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
    const savedItems = JSON.parse(
      localStorage.getItem("checkoutItems") || "[]"
    );

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

  const total = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );

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
        price: total,
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

      localStorage.setItem(
        "orders",
        JSON.stringify([newOrder, ...existingOrders])
      );

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
    <div className="min-h-screen bg-[#f3f4f6] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-red-600"
        >
          <ArrowLeft size={18} />
          Kembali ke Keranjang
        </button>

        <div className="mb-8">
          <h1 className="text-5xl font-extrabold text-black">
            Transaksi Pembayaran
          </h1>

          <p className="mt-3 text-gray-500">
            Pilih metode pembayaran, upload bukti pembayaran, lalu kirim ke
            admin untuk dikonfirmasi.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_430px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Produk Dipesan</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl bg-white object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold text-black">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-gray-500">
                        Qty: <span className="font-bold">{item.qty}</span>
                      </p>

                      <p className="mt-2 text-xl font-extrabold text-red-600">
                        {formatRupiah(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Metode Pembayaran</h2>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: "Transfer Bank",
                    icon: <Building2 size={22} />,
                  },
                  {
                    label: "QRIS",
                    icon: <CreditCard size={22} />,
                  },
                  {
                    label: "E-Wallet",
                    icon: <Wallet size={22} />,
                  },
                ].map((method) => (
                  <button
                    key={method.label}
                    onClick={() => setPaymentMethod(method.label)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-bold transition ${
                      paymentMethod === method.label
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-200 bg-gray-50 text-black hover:border-red-400"
                    }`}
                  >
                    {method.icon}
                    {method.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-gray-300 bg-gray-50 p-6">
                {paymentMethod === "Transfer Bank" && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Building2 className="text-red-600" />
                      <h3 className="text-xl font-extrabold">Transfer Bank</h3>
                    </div>

                    <div className="space-y-2 text-gray-700">
                      <p>Bank BCA</p>
                      <p>No Rekening: 1234567890</p>
                      <p>Atas Nama: Warung Camera</p>
                    </div>

                    <p className="mt-5 text-xl font-extrabold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}

                {paymentMethod === "QRIS" && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <CreditCard className="text-red-600" />
                      <h3 className="text-xl font-extrabold">QRIS Payment</h3>
                    </div>

                    <div className="inline-block rounded-3xl border bg-white p-6 shadow-sm">
                      <QRCode value={qrisValue} size={220} />

                      <p className="mt-4 text-center font-bold">
                        WARUNG CAMERA
                      </p>

                      <p className="text-center text-sm text-gray-500">
                        QRIS Dynamic Payment
                      </p>
                    </div>

                    <p className="mt-5 text-xl font-extrabold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}

                {paymentMethod === "E-Wallet" && (
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <Smartphone className="text-red-600" />
                      <h3 className="text-xl font-extrabold">E-Wallet</h3>
                    </div>

                    <div className="space-y-2 text-gray-700">
                      <p>DANA / OVO / GOPAY</p>
                      <p>Nomor: 08123456789</p>
                      <p>Atas Nama: Warung Camera</p>
                    </div>

                    <p className="mt-5 text-xl font-extrabold text-red-600">
                      Total: {formatRupiah(total)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <label className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <Upload size={24} />
                Upload Bukti Pembayaran
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-red-500 hover:bg-red-50">
                <Upload className="mb-3 text-red-600" size={34} />

                <p className="font-bold text-gray-800">
                  Klik untuk upload bukti pembayaran
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Format gambar JPG, PNG, JPEG
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPaymentProof(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
              </label>

              {paymentProof ? (
                <div className="mt-4 rounded-2xl bg-green-50 p-4 font-semibold text-green-700">
                  Bukti dipilih: {paymentProof.name}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-red-50 p-4 font-semibold text-red-600">
                  Bukti pembayaran wajib diupload.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
              <h2 className="mb-6 text-3xl font-extrabold">
                Ringkasan Pembayaran
              </h2>

              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="w-32 shrink-0 text-base font-bold leading-tight text-gray-700">
                    Total Pembayaran
                  </span>

                  <span className="min-w-0 flex-1 text-right text-2xl font-extrabold leading-tight text-red-600">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitPayment}
                disabled={loading || !paymentProof}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white transition ${
                  loading || !paymentProof
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                <CreditCard size={22} />
                {loading ? "Mengirim..." : "Kirim Pembayaran"}
              </button>

              <div className="mt-5 flex items-start gap-2 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

                <span>
                  Bukti pembayaran akan dikirim ke admin untuk dikonfirmasi.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}