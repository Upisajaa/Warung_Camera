import {
  Camera,
  ShieldCheck,
  Truck,
  Users,
  BadgeCheck,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeLeft = {
    hidden: {
      opacity: 0,
      x: -90,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeRight = {
    hidden: {
      opacity: 0,
      x: 90,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section className="bg-white border-b overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 items-center">
          
          {/* LEFT */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.35 }}
          >
            <p className="text-red-600 font-bold text-lg mb-3">
              Tentang Warung Camera
            </p>

            <h1 className="text-6xl font-extrabold leading-tight mb-8">
              Marketplace Kamera Modern Indonesia
            </h1>

            <p className="text-gray-600 text-xl leading-relaxed">
              Warung Camera hadir sebagai platform jual beli kamera yang dibuat
              untuk membantu fotografer, videografer, content creator, hingga
              pemula menemukan produk kamera terbaik dengan pengalaman belanja
              yang mudah, aman, dan modern.
            </p>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            className="relative"
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.35 }}
          >
            {/* IMAGE CONTAINER */}
            <motion.div
              className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-800 bg-black relative"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 0.4, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

              {/* RED GLOW */}
              <div className="absolute inset-0 bg-red-600/10 blur-3xl z-0" />

              {/* IMAGE */}
              <motion.img
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1400&auto=format&fit=crop"
                alt="Dark Camera"
                className="w-full h-[650px] object-cover brightness-75 contrast-125"
                animate={{
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* CINEMATIC LIGHT */}
              <motion.div
                className="absolute top-0 left-[-30%] w-[40%] h-full bg-white/10 blur-3xl rotate-12 z-20"
                animate={{
                  x: ["0%", "250%"],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* FLOATING INFO CARD */}
            <motion.div
              className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-xl border border-gray-800 text-white rounded-3xl px-8 py-6 shadow-2xl"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p className="text-sm font-semibold text-red-500 uppercase tracking-widest">
                Premium Marketplace
              </p>

              <h3 className="text-4xl font-extrabold mt-2">
                Warung Camera
              </h3>

              <p className="text-gray-400 mt-3 text-lg">
                Capture every moment with cinematic quality.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEJARAH */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1400&auto=format&fit=crop"
              alt="Photography Studio"
              className="rounded-[35px] shadow-xl h-[520px] object-cover w-full"
            />
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3 }}
          >
            <p className="text-red-600 font-bold text-lg mb-3">
              Perjalanan Kami
            </p>

            <h2 className="text-5xl font-extrabold mb-8">
              Sejarah Warung Camera
            </h2>

            <motion.div
              className="space-y-6"
              variants={cardContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.25 }}
            >
              <motion.div
                variants={fadeUp}
                className="bg-white rounded-3xl p-7 shadow border"
              >
                <p className="text-gray-700 text-lg leading-relaxed">
                  Warung Camera bermula dari sebuah toko kecil yang fokus pada
                  jual beli kamera dan perlengkapan fotografi.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="bg-white rounded-3xl p-7 shadow border"
              >
                <p className="text-gray-700 text-lg leading-relaxed">
                  Kini berkembang menjadi marketplace modern yang menyediakan
                  berbagai produk fotografi dan videografi dalam satu platform.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="bg-black rounded-3xl p-7 shadow text-white"
              >
                <p className="text-gray-300 text-lg leading-relaxed">
                  User dapat checkout, upload bukti pembayaran, tracking paket,
                  hingga melihat status pesanan secara realtime.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="max-w-7xl mx-auto px-8 pb-16">
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
        >
          <motion.div
            variants={fadeLeft}
            className="bg-white rounded-3xl p-10 shadow border hover:-translate-y-2 transition"
          >
            <BadgeCheck className="text-red-600 mb-5" size={55} />

            <h2 className="text-3xl font-bold mb-5">
              Visi
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Menjadi marketplace kamera terpercaya di Indonesia yang membantu
              seluruh kreator mendapatkan perlengkapan terbaik dengan teknologi
              modern dan pelayanan berkualitas.
            </p>
          </motion.div>

          <motion.div
            variants={fadeRight}
            className="bg-black rounded-3xl p-10 shadow hover:-translate-y-2 transition"
          >
            <Store className="text-red-500 mb-5" size={55} />

            <h2 className="text-3xl font-bold mb-5 text-white">
              Misi
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Menyediakan platform jual beli kamera yang aman, nyaman, cepat,
              dan mudah digunakan untuk seluruh user mulai dari pemula hingga
              profesional.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* KEUNGGULAN */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <motion.div
          className="flex items-end justify-between mb-12 flex-wrap gap-5"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
        >
          <div>
            <p className="text-red-600 font-bold text-lg mb-2">
              Keunggulan Kami
            </p>

            <h2 className="text-5xl font-extrabold">
              Kenapa Memilih Warung Camera?
            </h2>
          </div>

          <p className="text-gray-500 text-lg max-w-xl">
            Platform modern untuk kebutuhan fotografi dan videografi terbaik di
            Indonesia.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-7"
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.25 }}
        >
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-3xl p-8 shadow border hover:shadow-xl transition"
          >
            <Camera className="text-red-600 mb-5" size={50} />

            <h3 className="text-2xl font-bold mb-4">
              Produk Lengkap
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Kamera, lensa, drone, action cam, dan aksesoris tersedia dalam
              satu platform.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white rounded-3xl p-8 shadow border hover:shadow-xl transition"
          >
            <ShieldCheck className="text-red-600 mb-5" size={50} />

            <h3 className="text-2xl font-bold mb-4">
              Transaksi Aman
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              Sistem pembayaran dibuat aman dengan metode pembayaran modern.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white rounded-3xl p-8 shadow border hover:shadow-xl transition"
          >
            <Truck className="text-red-600 mb-5" size={50} />

            <h3 className="text-2xl font-bold mb-4">
              Tracking Paket
            </h3>

            <p className="text-gray-600 text-lg leading-relaxed">
              User dapat melihat status pengiriman dan nomor resi realtime.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-black rounded-3xl p-8 shadow hover:shadow-2xl transition"
          >
            <Users className="text-red-500 mb-5" size={50} />

            <h3 className="text-2xl font-bold mb-4 text-white">
              Untuk Kreator
            </h3>

            <p className="text-gray-300 text-lg leading-relaxed">
              Cocok untuk fotografer, videografer, streamer, dan content
              creator.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}