import {
  Camera,
  ShieldCheck,
  Truck,
  Users,
  BadgeCheck,
  Store,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <p className="text-red-600 font-bold text-lg mb-3">
              Tentang Warung Camera
            </p>

            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Marketplace Kamera Modern Indonesia
            </h1>

            <p className="text-gray-600 text-xl leading-relaxed">
              Warung Camera hadir sebagai platform jual beli kamera yang dibuat
              untuk membantu fotografer, videografer, content creator, hingga
              pemula menemukan produk kamera terbaik dengan pengalaman belanja
              yang mudah, aman, dan modern.
            </p>
          </div>

          <div className="bg-black rounded-3xl p-10 text-white shadow-xl">
            <Camera size={70} className="text-red-500 mb-6" />

            <h2 className="text-4xl font-bold mb-4">
              Capture Perfection
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Kami percaya setiap momen berharga pantas diabadikan dengan alat
              terbaik dan pelayanan profesional.
            </p>
          </div>
        </div>
      </section>

      {/* SEJARAH */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        
        <h2 className="text-5xl font-extrabold mb-10">
          Sejarah Warung Camera
        </h2>

        <div className="bg-white rounded-3xl p-10 shadow border">
          
          <p className="text-gray-700 text-xl leading-relaxed mb-8">
            Warung Camera bermula dari sebuah toko kecil yang fokus pada jual
            beli kamera dan perlengkapan fotografi. Seiring berkembangnya dunia
            digital dan kebutuhan content creator yang semakin meningkat,
            Warung Camera berkembang menjadi marketplace kamera modern yang
            menyediakan berbagai produk fotografi dan videografi dalam satu
            platform.
          </p>

          <p className="text-gray-700 text-xl leading-relaxed mb-8">
            Dengan sistem yang lebih modern, user dapat melakukan registrasi,
            login menggunakan email maupun akun Google, melihat produk secara
            realtime, menambahkan barang ke keranjang, melakukan checkout,
            memilih metode pembayaran, hingga melacak status pengiriman dan
            nomor resi paket secara langsung.
          </p>

          <p className="text-gray-700 text-xl leading-relaxed">
            Warung Camera terus berkembang untuk memberikan pengalaman belanja
            kamera yang lebih cepat, aman, dan profesional bagi seluruh user di
            Indonesia.
          </p>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-10 shadow border">
            <BadgeCheck
              className="text-red-600 mb-5"
              size={55}
            />

            <h2 className="text-3xl font-bold mb-5">
              Visi
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Menjadi marketplace kamera terpercaya di Indonesia yang membantu
              seluruh kreator mendapatkan perlengkapan terbaik dengan teknologi
              modern dan pelayanan berkualitas.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow border">
            <Store
              className="text-red-600 mb-5"
              size={55}
            />

            <h2 className="text-3xl font-bold mb-5">
              Misi
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Menyediakan platform jual beli kamera yang aman, nyaman, cepat,
              dan mudah digunakan untuk seluruh user mulai dari pemula hingga
              profesional.
            </p>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        
        <h2 className="text-5xl font-extrabold mb-10">
          Kenapa Memilih Warung Camera?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-7 shadow border">
            <Camera
              className="text-red-600 mb-4"
              size={45}
            />

            <h3 className="text-2xl font-bold mb-3">
              Produk Lengkap
            </h3>

            <p className="text-gray-600 text-lg">
              Kamera, lensa, drone, action cam, dan aksesoris tersedia dalam
              satu platform.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow border">
            <ShieldCheck
              className="text-red-600 mb-4"
              size={45}
            />

            <h3 className="text-2xl font-bold mb-3">
              Transaksi Aman
            </h3>

            <p className="text-gray-600 text-lg">
              Sistem pembayaran dibuat lebih aman dengan berbagai metode
              pembayaran modern.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow border">
            <Truck
              className="text-red-600 mb-4"
              size={45}
            />

            <h3 className="text-2xl font-bold mb-3">
              Tracking Paket
            </h3>

            <p className="text-gray-600 text-lg">
              User dapat melihat status pengiriman dan nomor resi paket secara
              realtime.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow border">
            <Users
              className="text-red-600 mb-4"
              size={45}
            />

            <h3 className="text-2xl font-bold mb-3">
              Untuk Semua Kreator
            </h3>

            <p className="text-gray-600 text-lg">
              Cocok digunakan untuk fotografer, videografer, streamer, dan
              content creator.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}