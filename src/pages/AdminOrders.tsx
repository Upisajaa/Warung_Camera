import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  PackageCheck,
  Clock,
  MapPin,
  Trash2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

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
  paymentStatus?: string;
  status: string;
  courier?: string;
  receipt?: string;
  address?: string;
  date: string;
  timeline?: {
    title: string;
    description: string;
    time: string;
  }[];
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
        paymentStatus: order.paymentStatus || "Menunggu Pembayaran",
      };
    });

    setFormData(initialForm);
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const getStatusIcon = (status: string) => {
    if (status === "Menunggu Diproses") return <Clock size={18} />;
    if (status === "Dikemas") return <Package size={18} />;
    if (status === "Dikirim") return <Truck size={18} />;
    if (status === "Dalam Perjalanan") return <Truck size={18} />;
    if (status === "Tiba") return <PackageCheck size={18} />;
    return <Clock size={18} />;
  };

  const getStatusColor = (status: string) => {
    if (status === "Menunggu Diproses") return "bg-gray-100 text-gray-700";
    if (status === "Dikemas") return "bg-yellow-100 text-yellow-700";
    if (status === "Dikirim") return "bg-blue-100 text-blue-700";
    if (status === "Dalam Perjalanan") return "bg-purple-100 text-purple-700";
    if (status === "Tiba") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
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

      const timeline = order.timeline || [];

      return {
        ...order,
        courier: data.courier || "",
        receipt: data.receipt || "",
        status: data.status || order.status,
        paymentStatus: data.paymentStatus || order.paymentStatus,
        timeline: [
          ...timeline,
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
    toast.success("Data pengiriman berhasil disimpan");
  };

  const deleteOrder = (id: number) => {
    if (!confirm("Hapus pesanan ini?")) return;

    const updatedOrders = orders.filter((order) => order.id !== id);

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("Pesanan dihapus");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Pesanan User
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Admin mengatur status pesanan, kurir, dan nomor resi paket user.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-md">
            <h2 className="text-3xl font-bold mb-3">
              Belum Ada Pesanan User
            </h2>
            <p className="text-gray-500">
              Pesanan akan muncul setelah user checkout produk.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-md border overflow-hidden"
              >
                <div className="grid md:grid-cols-4 gap-6 p-6">
                  <div className="flex gap-5">
                    <img
                      src={order.image}
                      alt={order.product}
                      className="w-32 h-32 object-cover rounded-2xl border"
                    />

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {order.product}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        Harga: {formatRupiah(order.price)}
                      </p>

                      <p className="mt-2">
                        Qty: <span className="font-bold">{order.qty}</span>
                      </p>

                      <p className="mt-2 text-red-600 font-bold text-lg">
                        {formatRupiah(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-gray-500 text-sm">Pembeli</p>
                    <p className="font-bold text-lg">
                      {order.buyerName || "User"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {order.buyerEmail || "-"}
                    </p>

                    <p className="text-gray-500 text-sm mt-5">
                      Metode Pembayaran
                    </p>
                    <p className="font-bold text-lg">{order.payment}</p>

                    <p className="text-gray-500 text-sm mt-5">
                      Tanggal Pesanan
                    </p>
                    <p className="font-semibold">{order.date}</p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold w-fit mb-5 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>

                    <label className="font-semibold mb-2">Status Paket</label>
                    <select
                      value={formData[order.id]?.status || order.status}
                      onChange={(e) =>
                        handleChange(order.id, "status", e.target.value)
                      }
                      className="border rounded-xl px-4 py-3 mb-4"
                    >
                      <option value="Menunggu Diproses">
                        Menunggu Diproses
                      </option>
                      <option value="Dikemas">Dikemas</option>
                      <option value="Dikirim">Dikirim</option>
                      <option value="Dalam Perjalanan">
                        Dalam Perjalanan
                      </option>
                      <option value="Tiba">Tiba</option>
                    </select>

                    <label className="font-semibold mb-2">
                      Status Pembayaran
                    </label>
                    <select
                      value={
                        formData[order.id]?.paymentStatus ||
                        order.paymentStatus ||
                        "Menunggu Pembayaran"
                      }
                      onChange={(e) =>
                        handleChange(
                          order.id,
                          "paymentStatus",
                          e.target.value
                        )
                      }
                      className="border rounded-xl px-4 py-3"
                    >
                      <option value="Menunggu Pembayaran">
                        Menunggu Pembayaran
                      </option>
                      <option value="Sudah Dibayar">Sudah Dibayar</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="font-semibold mb-2">Kurir</label>
                    <select
                      value={formData[order.id]?.courier || ""}
                      onChange={(e) =>
                        handleChange(order.id, "courier", e.target.value)
                      }
                      className="border rounded-xl px-4 py-3 mb-4"
                    >
                      <option value="">Pilih Kurir</option>
                      <option value="JNE">JNE</option>
                      <option value="J&T Express">J&T Express</option>
                      <option value="SiCepat">SiCepat</option>
                      <option value="Shopee Express">Shopee Express</option>
                      <option value="POS Indonesia">POS Indonesia</option>
                    </select>

                    <label className="font-semibold mb-2">Nomor Resi</label>
                    <input
                      type="text"
                      placeholder="Contoh: JNT123456789ID"
                      value={formData[order.id]?.receipt || ""}
                      onChange={(e) =>
                        handleChange(order.id, "receipt", e.target.value)
                      }
                      className="border rounded-xl px-4 py-3 mb-4"
                    />

                    <button
                      onClick={() => saveShipping(order.id)}
                      className="bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Simpan Pengiriman
                    </button>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="mt-3 bg-black text-white py-3 rounded-2xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Hapus Pesanan
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border-t px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{order.address || "Bandung, Indonesia"}</span>
                  </div>

                  <p className="text-gray-500">
                    Kurir:{" "}
                    <span className="font-bold">
                      {order.courier || "Belum dipilih"}
                    </span>{" "}
                    | Resi:{" "}
                    <span className="font-bold">
                      {order.receipt || "Belum tersedia"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}