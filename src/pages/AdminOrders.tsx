import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  Trash2,
  Save,
  Eye,
  CheckCircle2,
  User,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

type Timeline = {
  title: string;
  description: string;
  time: string;
};

type Order = {
  id: number;
  buyerName?: string;
  buyerEmail?: string;
  product: string;
  image: string;
  price: number;
  qty: number;
  total: number;
  payment: string;
  paymentProof?: string;
  paymentStatus?: string;
  status: string;
  courier?: string;
  receipt?: string;
  address?: string;
  date: string;
  timeline?: Timeline[];
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Record<number, Partial<Order>>>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);

    const initialForm: Record<number, Partial<Order>> = {};

    savedOrders.forEach((order: Order) => {
      initialForm[order.id] = {
        courier: order.courier || "",
        receipt: order.receipt || "",
        status: order.status || "Menunggu Diproses",
        paymentStatus: order.paymentStatus || "Menunggu Konfirmasi Admin",
      };
    });

    setFormData(initialForm);
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const getStatusIcon = (status: string) => {
    if (status === "Dikemas") return <Package size={15} />;
    if (status === "Dikirim") return <Truck size={15} />;
    if (status === "Dalam Perjalanan") return <Truck size={15} />;
    if (status === "Tiba") return <PackageCheck size={15} />;
    return <Clock size={15} />;
  };

  const getStatusColor = (status: string) => {
    if (status === "Dikemas") return "bg-yellow-100 text-yellow-700";
    if (status === "Dikirim") return "bg-blue-100 text-blue-700";
    if (status === "Dalam Perjalanan") return "bg-purple-100 text-purple-700";
    if (status === "Tiba") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPaymentColor = (status?: string) => {
    if (status === "Sudah Dibayar") return "bg-green-100 text-green-700";
    if (status === "Pembayaran Ditolak") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const handleChange = (id: number, field: keyof Order, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const saveShipping = (id: number) => {
    const data = formData[id];

    const updatedOrders = orders.map((order) => {
      if (order.id !== id) return order;

      return {
        ...order,
        courier: data.courier || "",
        receipt: data.receipt || "",
        status: data.status || order.status,
        paymentStatus: data.paymentStatus || order.paymentStatus,
        timeline: [
          ...(order.timeline || []),
          {
            title: "Update Admin",
            description: `Status: ${data.status || order.status}, Kurir: ${
              data.courier || "-"
            }, Resi: ${data.receipt || "-"}`,
            time: new Date().toLocaleString("id-ID"),
          },
        ],
      };
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Data pesanan berhasil disimpan");
  };

  const confirmPayment = (id: number) => {
    const updatedOrders = orders.map((order) => {
      if (order.id !== id) return order;

      return {
        ...order,
        paymentStatus: "Sudah Dibayar",
        timeline: [
          ...(order.timeline || []),
          {
            title: "Pembayaran Dikonfirmasi",
            description: "Admin mengonfirmasi pembayaran user.",
            time: new Date().toLocaleString("id-ID"),
          },
        ],
      };
    });

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        paymentStatus: "Sudah Dibayar",
      },
    }));

    toast.success("Pembayaran berhasil dikonfirmasi");
  };

  const deleteOrder = (id: number) => {
    if (!confirm("Hapus pesanan ini?")) return;

    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Pesanan berhasil dihapus");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <div className="mx-auto w-full max-w-[1450px]">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Pesanan User
          </h1>

          <p className="text-gray-500">
            Kelola bukti pembayaran, status paket, kurir, dan nomor resi.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-sm">
            <h2 className="mb-3 text-3xl font-bold">Belum Ada Pesanan</h2>
            <p className="text-gray-500">Pesanan user akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                {/* TOP CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_1.3fr] border-b border-gray-200">
                  {/* PRODUCT */}
                  <div className="flex gap-5 border-b border-gray-200 p-6 xl:border-b-0 xl:border-r">
                    <img
                      src={order.image || "https://via.placeholder.com/150"}
                      alt={order.product}
                      className="h-28 w-28 shrink-0 rounded-2xl border object-cover"
                    />

                    <div className="min-w-0">
                      <h2 className="truncate text-3xl font-extrabold text-gray-900">
                        {order.product}
                      </h2>

                      <p className="mt-2 text-xl font-extrabold text-red-600">
                        {formatRupiah(order.total)}
                      </p>

                      <p className="mt-2 text-gray-700">
                        Qty: <span className="font-bold">{order.qty}</span>
                      </p>

                      <div
                        className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {/* BUYER */}
                  <div className="border-b border-gray-200 p-6 xl:border-b-0 xl:border-r">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-gray-500">
                      <User size={17} />
                      Pembeli
                    </div>

                    <p className="truncate text-xl font-extrabold text-gray-900">
                      {order.buyerName || "User"}
                    </p>

                    <p className="truncate text-sm text-gray-500">
                      {order.buyerEmail || "-"}
                    </p>
                  </div>

                  {/* PAYMENT */}
                  <div className="border-b border-gray-200 p-6 xl:border-b-0 xl:border-r">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-gray-500">
                      <CreditCard size={17} />
                      Metode Pembayaran
                    </div>

                    <p className="text-xl font-extrabold text-gray-900">
                      {order.payment || "Transfer Bank"}
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="border-b border-gray-200 p-6 xl:border-b-0 xl:border-r">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-gray-500">
                      <CalendarDays size={17} />
                      Tanggal Pesanan
                    </div>

                    <p className="text-xl font-bold text-gray-900">
                      {order.date}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="border-b border-gray-200 p-6 xl:border-b-0 xl:border-r">
                    <div className="mb-3 flex items-center gap-2 font-semibold text-gray-500">
                      <Clock size={17} />
                      Status
                    </div>

                    <div
                      className={`mb-3 inline-flex rounded-full px-4 py-2 text-sm font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>

                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${getPaymentColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "Menunggu Konfirmasi Admin"}
                    </div>
                  </div>

                  {/* PAYMENT PROOF */}
                  <div className="p-6">
                    <h3 className="mb-3 font-bold">Bukti Pembayaran</h3>

                    {order.paymentProof ? (
                      <div className="grid grid-cols-[88px_1fr] gap-3">
                        <img
                          src={order.paymentProof}
                          alt="Bukti Pembayaran"
                          className="h-24 w-24 rounded-xl border object-cover"
                        />

                        <div className="flex min-w-0 flex-col gap-2">
                          <a
                            href={order.paymentProof}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-black transition hover:bg-gray-100"
                          >
                            <Eye size={15} />
                            Lihat
                          </a>

                          <button
                            onClick={() => confirmPayment(order.id)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                          >
                            <CheckCircle2 size={15} />
                            Konfirmasi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
                        Belum ada bukti
                      </div>
                    )}
                  </div>
                </div>

                {/* FORM CONTROL */}
                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_0.9fr_0.9fr]">
                  <div>
                    <label className="mb-2 block font-bold">Status Paket</label>

                    <select
                      value={formData[order.id]?.status || order.status}
                      onChange={(e) =>
                        handleChange(order.id, "status", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
                    >
                      <option value="Menunggu Diproses">Menunggu Diproses</option>
                      <option value="Dikemas">Dikemas</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Dalam Perjalanan">Dalam Perjalanan</option>
                      <option value="Tiba">Tiba</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold">
                      Status Pembayaran
                    </label>

                    <select
                      value={
                        formData[order.id]?.paymentStatus ||
                        order.paymentStatus ||
                        "Menunggu Konfirmasi Admin"
                      }
                      onChange={(e) =>
                        handleChange(order.id, "paymentStatus", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
                    >
                      <option value="Menunggu Konfirmasi Admin">
                        Menunggu Konfirmasi Admin
                      </option>
                      <option value="Sudah Dibayar">Sudah Dibayar</option>
                      <option value="Pembayaran Ditolak">
                        Pembayaran Ditolak
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold">Kurir</label>

                    <select
                      value={formData[order.id]?.courier || ""}
                      onChange={(e) =>
                        handleChange(order.id, "courier", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
                    >
                      <option value="">Pilih Kurir</option>
                      <option value="JNE">JNE</option>
                      <option value="J&T Express">J&T Express</option>
                      <option value="SiCepat">SiCepat</option>
                      <option value="Shopee Express">Shopee Express</option>
                      <option value="POS Indonesia">POS Indonesia</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold">Nomor Resi</label>

                    <input
                      type="text"
                      placeholder="Contoh: JNT123456789ID"
                      value={formData[order.id]?.receipt || ""}
                      onChange={(e) =>
                        handleChange(order.id, "receipt", e.target.value)
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    onClick={() => saveShipping(order.id)}
                    className="flex h-[50px] items-center justify-center gap-2 self-end rounded-xl bg-red-600 px-4 font-bold text-white transition hover:bg-red-700"
                  >
                    <Save size={17} />
                    Simpan
                  </button>

                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="flex h-[50px] items-center justify-center gap-2 self-end rounded-xl bg-black px-4 font-bold text-white transition hover:bg-gray-800"
                  >
                    <Trash2 size={17} />
                    Hapus
                  </button>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-3 border-t bg-gray-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-red-600" />
                    <span>
                      <b>Alamat Pengiriman:</b>{" "}
                      {order.address || "Bandung, Indonesia"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-gray-500">
                    <span>
                      Kurir: <b>{order.courier || "Belum dipilih"}</b>
                    </span>

                    <span>
                      Resi: <b>{order.receipt || "Belum tersedia"}</b>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}