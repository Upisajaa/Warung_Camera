import {
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#dddddd] border-t border-[#cfcfcf] mt-20">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">
              Warung Camera
            </h2>

            <p className="text-gray-600 leading-8">
              Marketplace kamera profesional dan aksesoris
              pilihan untuk fotografer dan videografer Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5 text-black">
              Hubungan
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li>Produk</li>
              <li>Kategori</li>
              <li>Blog</li>
              <li>Kontak</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-5 text-black">
              Layanan
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li>Pengiriman</li>
              <li>Pengembalian</li>
              <li>Garansi</li>
              <li>Cicilan</li>
            </ul>
          </div>

          <div>

            <h3 className="font-bold text-xl mb-5 text-black">
              Newsletter
            </h3>

            <div className="flex gap-3 mb-6">

              <input
                type="email"
                placeholder="Email"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />

              <button className="bg-black text-white px-5 rounded-xl">
                Subscribe
              </button>

            </div>

            <div className="flex gap-4 text-gray-600">

              <Instagram />
              <Twitter />
              <Youtube />
              <Facebook />

            </div>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-14 pt-8 text-gray-500 flex justify-between">

          <p>
            © 2026 Warung Camera. All rights reserved.
          </p>

          <div className="flex gap-6">
            <p>Kebijakan Privasi</p>
            <p>Syarat & Ketentuan</p>
          </div>

        </div>

      </div>

    </footer>
  );
}