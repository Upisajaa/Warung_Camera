import { Instagram, Music2, PhoneCall, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-black via-[#170909] to-red-900 text-white">
      <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-red-600 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-blue-800 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h2 className="mb-6 text-4xl font-black tracking-wide">
              WARUNG CAMERA
            </h2>

            <p className="text-lg leading-8 text-gray-300">
              Marketplace kamera profesional dan aksesoris pilihan untuk
              fotografer dan videografer Indonesia.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">Navigasi</h3>

            <ul className="space-y-4 text-gray-300">
              <li><Link to="/" className="hover:text-red-400">Home</Link></li>
              <li><Link to="/produk" className="hover:text-red-400">Produk</Link></li>
              <li><Link to="/tentang" className="hover:text-red-400">Tentang</Link></li>
              <li><Link to="/kontak" className="hover:text-red-400">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">Bantuan</h3>

            <ul className="space-y-4 text-gray-300">
              <li><Link to="/pengiriman" className="hover:text-red-400">Pengiriman</Link></li>
              <li><Link to="/pengembalian" className="hover:text-red-400">Refund</Link></li>
              <li><Link to="/garansi" className="hover:text-red-400">Garansi</Link></li>
              <li><Link to="/faq" className="hover:text-red-400">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">Lokasi Toko</h3>

            <div className="mb-8 flex gap-3 text-gray-300">
              <MapPin className="mt-1 shrink-0 text-red-400" size={24} />

              <div>
                <p className="leading-7">
                  Jl. Soekarno Hatta No. 12
                  <br />
                  Bandung, Jawa Barat
                  <br />
                  Indonesia
                </p>

                <a
                  href="https://maps.google.com/?q=Bandung"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-red-400 hover:text-red-300"
                >
                  Lihat Lokasi →
                </a>
              </div>
            </div>

            <h3 className="mb-4 text-xl font-bold">Social Media</h3>

            <div className="flex gap-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-pink-600"
              >
                <Instagram size={22} />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-black"
              >
                <Music2 size={22} />
              </a>

              <a
                href="https://wa.me/628123456789"
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-green-600"
              >
                <PhoneCall size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-gray-400 md:flex-row">
          <p>© 2026 Warung Camera. All rights reserved.</p>

          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-red-400">
              Kebijakan Privasi
            </Link>

            <Link to="/terms" className="hover:text-red-400">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}