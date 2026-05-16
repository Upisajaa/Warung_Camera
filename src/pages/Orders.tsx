import { useEffect, useState } from "react";
import {
  PackageCheck,
  Truck,
  Package,
  MapPin,
  Clock,
  CreditCard,
} from "lucide-react";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");

    const userOrders = savedOrders.filter(
      (order: Order) => order.buyerEmail === currentUser.email
    );

    setOrders(userOrders);
  };

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const getStatusColor = (status: string) => {
    if (status === "Menunggu Diproses") return "bg-gray-100 text-gray-700";
    if (status === "Dikemas") return "bg-yellow-100 text-yellow-700";
    if (status === "Dikirim") return "bg-blue-100 text-blue-700";
    if (status === "Dalam Perjalanan") return "bg-purple-100 text-purple-700";
    if (status === "Tiba") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Menunggu Diproses") return <Clock size={18} />;
    if (status === "Dikemas") return <Package size={18} />;
    if (status === "Dikirim") return <Truck size={18} />;
    if (status === "Dalam Perjalanan") return <Truck size={18} />;
    if (status === "Tiba") return <PackageCheck size={18} />;
    return <Clock size={18} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Pesanan Saya
          </h1>

          <p className="text-gray-500 mt-2">
            Pantau status pesanan, pembayaran, kurir, dan nomor resi.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-md">
            <h2 className="text-3xl font-bold mb-3">Belum Ada Pesanan</h2>
            <p className="text-gray-500">
              Silakan checkout produk terlebih dahulu.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-md border overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-6 p-6">
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
                        {formatRupiah(order.price)}
                      </p>

                      <p className="mt-3">
                        Qty:{" "}
                        <span className="font-bold">{order.qty}</span>
                      </p>

                      <p className="mt-2 text-red-600 font-bold text-lg">
                        {formatRupiah(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold w-fit ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>

                    <div className="mt-5">
                      <p className="text-gray-500 text-sm">
                        Metode Pembayaran
                      </p>
                      <p className="font-bold text-lg">{order.payment}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">
                        Status Pembayaran
                      </p>
                      <p className="font-bold text-lg">
                        {order.paymentStatus || "Menunggu Pembayaran"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">Tanggal Pesanan</p>
                      <p className="font-semibold">{order.date}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="bg-gray-100 rounded-2xl p-5 border">
                      <div className="flex items-center gap-3 mb-3">
                        <Truck className="text-red-600" />
                        <h3 className="font-bold text-xl">
                          Informasi Pengiriman
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-500 text-sm">Kurir</p>
                          <p className="font-bold text-lg">
                            {order.courier || "Belum dipilih admin"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Nomor Resi</p>
                          <p className="font-bold text-lg tracking-wide">
                            {order.receipt || "Belum tersedia"}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-500 text-sm">Alamat</p>
                          <div className="flex items-center gap-2 font-medium">
                            <MapPin size={16} />
                            {order.address || "Bandung, Indonesia"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        alert(
                          `Kurir: ${order.courier || "Belum tersedia"}\nResi: ${
                            order.receipt || "Belum tersedia"
                          }\nStatus: ${order.status}`
                        )
                      }
                      className="mt-5 bg-black text-white py-3 rounded-2xl font-semibold hover:bg-gray-800 transition"
                    >
                      Lacak Paket
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border-t px-6 py-5">
                  <h3 className="font-bold text-lg mb-4">Timeline Pesanan</h3>

                  <div className="space-y-4">
                    {(order.timeline || []).map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-4 h-4 bg-red-600 rounded-full mt-1" />

                        <div>
                          <p className="font-bold">{item.title}</p>
                          <p className="text-gray-600">{item.description}</p>
                          <p className="text-gray-400 text-sm">{item.time}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-4">
                      <CreditCard className="text-red-600" size={18} />
                      <div>
                        <p className="font-bold">Status Pembayaran</p>
                        <p className="text-gray-600">
                          {order.paymentStatus || "Menunggu Pembayaran"}
                        </p>
                      </div>
                    </div>
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