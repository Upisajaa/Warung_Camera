import { Link } from "react-router-dom";

export default function Home() {
  const categories = [
    {
      name: "DSLR",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600",
    },
    {
      name: "Mirrorless",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=600",
    },
    {
      name: "Action Cam",
      image:
        "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=600",
    },
    {
      name: "Drone",
      image:
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=600",
    },
    {
      name: "Lensa",
      image:
        "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=600",
    },
    {
      name: "Aksesoris",
      image:
        "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[40px] shadow-lg overflow-hidden grid md:grid-cols-2 items-center">
          
          {/* LEFT */}
          <div className="p-12">
            <h1 className="text-6xl md:text-7xl font-serif italic leading-tight mb-8">
              Capture
              <br />
              Perfection.
            </h1>

            <p className="text-gray-600 text-xl leading-relaxed mb-10">
              Warung Camera adalah marketplace kamera dan perlengkapan fotografi
              untuk kebutuhan profesional maupun hobi. Temukan DSLR,
              mirrorless, drone, action cam, lensa, dan aksesoris dengan
              transaksi aman serta pengiriman ke seluruh Indonesia.
            </p>

            <Link
              to="/produk"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-5 rounded-full text-lg transition"
            >
              Jelajahi Produk
            </Link>
          </div>

          {/* RIGHT */}
          <div className="h-full">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200"
              alt="Camera Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mb-10">
          <h2 className="text-5xl font-extrabold mb-3">
            Kategori Produk
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/produk?category=${category.name}`}
              className="bg-white rounded-3xl shadow-md border hover:shadow-xl hover:-translate-y-2 transition duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-2xl font-bold">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-black rounded-[40px] overflow-hidden grid md:grid-cols-2 items-center">
          
          <div className="p-12">
            <p className="text-red-500 font-bold text-lg mb-4">
              WARUNG CAMERA STORE
            </p>

            <h2 className="text-white text-5xl font-extrabold leading-tight mb-6">
              Peralatan fotografi
              <br />
              untuk setiap momen.
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Temukan berbagai pilihan kamera dan perlengkapan fotografi
              dari brand populer untuk kebutuhan konten, traveling,
              hingga produksi profesional.
            </p>

            <Link
              to="/produk"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-5 rounded-full text-lg transition"
            >
              Lihat Produk
            </Link>
          </div>

          <div className="h-full">
            <img
              src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200"
              alt="Premium Camera"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-5xl font-extrabold mb-12 text-center">
          Kenapa Belanja di Warung Camera?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl p-10 shadow-md border">
            <div className="text-5xl mb-6">🚚</div>

            <h3 className="text-3xl font-bold mb-4">
              Pengiriman Seluruh Indonesia
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Produk dikirim menggunakan jasa ekspedisi terpercaya dengan
              nomor resi dan status pengiriman realtime.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-md border">
            <div className="text-5xl mb-6">💳</div>

            <h3 className="text-3xl font-bold mb-4">
              Pembayaran Fleksibel
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Mendukung pembayaran melalui transfer bank, QRIS,
              e-wallet, dan kartu kredit.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-md border">
            <div className="text-5xl mb-6">📸</div>

            <h3 className="text-3xl font-bold mb-4">
              Produk Berkualitas
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Menyediakan kamera dan perlengkapan fotografi pilihan
              untuk pemula hingga profesional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}