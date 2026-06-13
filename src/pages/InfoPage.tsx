import { useLocation } from "react-router-dom";

export default function InfoPage() {
  const location = useLocation();

  const pages: Record<
    string,
    {
      title: string;
      description: string;
    }
  > = {
    "/pengiriman": {
      title: "Pengiriman",
      description:
        "Warung Camera melayani pengiriman ke seluruh Indonesia menggunakan jasa ekspedisi terpercaya seperti JNE, J&T, SiCepat, AnterAja, dan POS Indonesia.",
    },

    "/refund": {
      title: "Refund",
      description:
        "Refund dapat dilakukan apabila produk mengalami kerusakan, salah pengiriman, atau pesanan tidak diterima sesuai ketentuan yang berlaku.",
    },

    "/garansi": {
      title: "Garansi",
      description:
        "Produk kamera dan aksesoris tertentu memiliki garansi resmi distributor maupun toko sesuai informasi produk.",
    },

    "/faq": {
      title: "FAQ",
      description:
        "Temukan jawaban pertanyaan umum seputar pembayaran, pengiriman, checkout, akun, dan produk di Warung Camera.",
    },
  };

  const currentPage = pages[location.pathname];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-20">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-12">
        <p className="text-red-600 font-bold text-lg mb-3">
          Warung Camera
        </p>

        <h1 className="text-5xl font-extrabold mb-8">
          {currentPage?.title}
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed">
          {currentPage?.description}
        </p>
      </div>
    </div>
  );
}
