import { useState } from "react";
import toast from "react-hot-toast";
import {
  Camera,
  DollarSign,
  FileText,
  Send,
  BadgeCheck,
} from "lucide-react";

export default function SellCamera() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Bekas");
  const [description, setDescription] = useState("");

  const formatInputRupiah = (value: string) => {
    const rawValue = value.replace(/\D/g, "");
    if (!rawValue) return "";
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const cleanPrice = (value: string) => {
    return Number(value.replace(/\./g, ""));
  };

  const formatRupiah = (value: string | number) => {
    const number =
      typeof value === "string" ? cleanPrice(value) : Number(value);

    return `Rp ${number.toLocaleString("id-ID")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    if (!name || !brand || !price || !description) {
      toast.error("Lengkapi semua data terlebih dahulu");
      return;
    }

    const priceNumber = cleanPrice(price);

    if (!priceNumber || priceNumber <= 0) {
      toast.error("Harga tidak valid");
      return;
    }

    const sellRequests = JSON.parse(
      localStorage.getItem("sellRequests") || "[]"
    );

    const newRequest = {
      id: Date.now(),
      seller: user.name || "User",
      email: user.email || "-",
      name,
      brand,
      price: priceNumber,
      condition,
      description,
      status: "Menunggu Verifikasi",
      createdAt: new Date().toLocaleString("id-ID"),
    };

    sellRequests.unshift(newRequest);
    localStorage.setItem("sellRequests", JSON.stringify(sellRequests));

    const message = `
Halo Admin Warung Camera,

Saya ingin menjual kamera dengan detail berikut:

Nama Kamera: ${name}
Brand: ${brand}
Harga: ${formatRupiah(priceNumber)}
Kondisi: ${condition}

Deskripsi:
${description}

Nama Penjual: ${user.name || "User"}
Email: ${user.email || "-"}

Catatan:
Saya akan mengirim foto kamera secara manual melalui WhatsApp setelah chat ini terbuka.

Mohon dibantu untuk proses verifikasi.
`;

    const adminPhone = "6285294849915";
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
      message
    )}`;

    toast.success("Pengajuan dikirim, membuka WhatsApp admin");
    window.open(whatsappUrl, "_blank");

    setName("");
    setBrand("");
    setPrice("");
    setCondition("Bekas");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 font-bold text-red-600">
            Warung Camera Marketplace
          </p>

          <h1 className="text-5xl font-extrabold text-black">
            Jual Kamera
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-gray-500">
            Isi data kamera yang ingin dijual. Setelah dikirim, WhatsApp admin
            akan terbuka dan kamu bisa mengirim foto kamera secara manual.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 font-bold">
                  <Camera size={18} />
                  Nama Kamera
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Canon EOS R50"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 font-bold">Brand</label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Contoh: Canon"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 font-bold">
                  <DollarSign size={18} />
                  Harga
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(formatInputRupiah(e.target.value))}
                  placeholder="Contoh: 10.000.000"
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-red-600"
                />

                {price && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    {formatRupiah(price)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 font-bold">Kondisi</label>

                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-red-600"
                >
                  <option>Bekas</option>
                  <option>Like New</option>
                  <option>Baru</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 flex items-center gap-2 font-bold">
                <FileText size={18} />
                Deskripsi
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan kondisi kamera, kelengkapan, minus, shutter count, garansi, dan alasan dijual..."
                className="w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-red-600"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
              Foto kamera dikirim manual di WhatsApp setelah chat admin terbuka.
            </div>

            <button
              type="submit"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-8 py-4 font-bold text-white transition hover:bg-red-700"
            >
              <Send size={20} />
              Kirim Pengajuan ke WhatsApp Admin
            </button>
          </form>

          <div className="h-fit rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <BadgeCheck size={30} />
            </div>

            <h2 className="mb-4 text-2xl font-extrabold">Cara Kerja</h2>

            <div className="space-y-4 text-gray-600">
              <p>1. Isi data kamera yang ingin dijual.</p>
              <p>2. Klik tombol kirim pengajuan.</p>
              <p>3. WhatsApp admin akan terbuka otomatis.</p>
              <p>4. Kirim foto kamera manual di WhatsApp.</p>
              <p>5. Admin memverifikasi kamera sebelum ditampilkan.</p>
            </div>

            <div className="mt-6 rounded-2xl bg-yellow-50 p-4 text-sm font-semibold text-yellow-700">
              Foto tidak bisa dikirim otomatis lewat link WhatsApp, jadi harus
              dikirim manual di chat admin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}