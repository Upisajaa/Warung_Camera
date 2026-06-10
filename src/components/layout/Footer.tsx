import { Instagram, Music2, PhoneCall, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-14 w-full overflow-hidden bg-gradient-to-br from-black via-[#170909] to-red-900 text-white sm:mt-20">
      <div className="absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-red-600 opacity-20 blur-3xl sm:h-[420px] sm:w-[420px]" />
      <div className="absolute bottom-[-120px] left-[-120px] h-[280px] w-[280px] rounded-full bg-blue-800 opacity-20 blur-3xl sm:h-[360px] sm:w-[360px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <h2 className="mb-5 text-3xl font-black tracking-wide sm:mb-6 sm:text-4xl">
              WARUNG <br />
              CAMERA
            </h2>

            <p className="text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Marketplace kamera profesional dan aksesoris pilihan untuk
              fotografer dan videografer Indonesia.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
              Navigasi
            </h3>

            <ul className="space-y-3 text-gray-300 sm:space-y-4">
              <li>
                <Link to="/" className="transition hover:text-red-400">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/produk" className="transition hover:text-red-400">
                  Produk
                </Link>
              </li>

              <li>
                <Link to="/tentang" className="transition hover:text-red-400">
                  Tentang
                </Link>
              </li>

              <li>
                <Link to="/kontak" className="transition hover:text-red-400">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
              Bantuan
            </h3>

            <ul className="space-y-3 text-gray-300 sm:space-y-4">
              <li>
                <Link
                  to="/pengiriman"
                  className="transition hover:text-red-400"
                >
                  Pengiriman
                </Link>
              </li>

              <li>
                <Link to="/refund" className="transition hover:text-red-400">
                  Refund
                </Link>
              </li>

              <li>
                <Link to="/garansi" className="transition hover:text-red-400">
                  Garansi
                </Link>
              </li>

              <li>
                <Link to="/faq" className="transition hover:text-red-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xl font-bold sm:mb-6 sm:text-2xl">
              Lokasi Toko
            </h3>

            <div className="mb-8 flex flex-col gap-3 text-gray-300 sm:flex-row">
              <MapPin className="shrink-0 text-red-400 sm:mt-1" size={24} />

              <div>
                <p className="break-words text-sm leading-7 sm:text-base">
                  Permata Kencana Resindence, Blok. H No.4, Rancamulya, Kec.
                  Pameungpeuk
                  <br />
                  Kabupaten Bandung, Jawa Barat 40357
                  <br />
                  Indonesia
                </p>

                <a
                  href="https://maps.app.goo.gl/zuLpB6AveLMCQwmC8"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-red-400 transition hover:text-red-300"
                >
                  Lihat Lokasi →
                </a>
              </div>
            </div>

            <h3 className="mb-4 text-lg font-bold sm:text-xl">
              Social Media
            </h3>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-pink-600 sm:h-12 sm:w-12"
              >
                <Instagram size={22} />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-black sm:h-12 sm:w-12"
              >
                <Music2 size={22} />
              </a>

              <a
                href="https://wa.me/6285294849915"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition hover:bg-green-600 sm:h-12 sm:w-12"
              >
                <PhoneCall size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-center text-sm text-gray-400 sm:mt-14 sm:pt-8 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© 2026 Warung Camera. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-4 md:justify-start md:gap-6">
            <Link to="/privacy" className="transition hover:text-red-400">
              Kebijakan Privasi
            </Link>

            <Link to="/terms" className="transition hover:text-red-400">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}