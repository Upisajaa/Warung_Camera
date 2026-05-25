import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

  const fadeUp = {
    hidden: { opacity: 0, y: 70 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -90 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 90 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#efefef] text-black">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 overflow-hidden rounded-[40px] border border-gray-300 bg-white shadow-sm">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.35 }}
            className="flex flex-col justify-center bg-[#f5f5f5] p-12 md:p-16"
          >
            <h1 className="mb-8 font-serif text-6xl italic leading-tight md:text-7xl">
              Capture
              <br />
              Perfection.
            </h1>

            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              Warung Camera adalah marketplace kamera dan perlengkapan fotografi
              untuk kebutuhan profesional maupun hobi.
            </p>

            <Link
              to="/produk"
              className="inline-block w-fit rounded-full bg-red-600 px-10 py-5 text-lg font-bold text-white transition hover:bg-red-700"
            >
              Jelajahi Produk
            </Link>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.35 }}
            className="relative bg-black overflow-hidden"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200"
              alt="Camera Hero"
              className="h-full w-full object-cover opacity-90 brightness-75 contrast-125"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <motion.div
              className="absolute top-0 left-[-40%] h-full w-[40%] rotate-12 bg-white/20 blur-3xl"
              animate={{ x: ["0%", "300%"] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
          className="mb-10 flex items-center justify-between"
        >
          <h2 className="text-5xl font-extrabold text-black">
            Kategori Produk
          </h2>

          <Link
            to="/produk"
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold transition hover:bg-black hover:text-white"
          >
            Lihat Semua
          </Link>
        </motion.div>

        <motion.div
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.25 }}
          className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={fadeUp}>
              <Link
                to={`/produk?category=${category.name}`}
                className="block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden">
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="p-5 text-center">
                  <h3 className="text-2xl font-bold text-black">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid overflow-hidden rounded-[40px] bg-[#2f2f2f] md:grid-cols-2">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3 }}
            className="flex flex-col justify-center p-12"
          >
            <p className="mb-4 text-lg font-bold text-red-500">
              WARUNG CAMERA STORE
            </p>

            <h2 className="mb-6 text-5xl font-extrabold leading-tight text-white">
              Peralatan fotografi
              <br />
              untuk setiap momen.
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-gray-300">
              Temukan berbagai pilihan kamera dan perlengkapan fotografi dari
              brand populer dengan kualitas terbaik.
            </p>

            <Link
              to="/produk"
              className="inline-block w-fit rounded-full bg-red-600 px-10 py-5 text-lg font-bold text-white transition hover:bg-red-700"
            >
              Lihat Produk
            </Link>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.3 }}
            className="relative overflow-hidden bg-black"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1200"
              alt="Premium Camera"
              className="h-full w-full object-cover opacity-95 brightness-75 contrast-125"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
          </motion.div>
        </div>
      </section>

      {/* FITUR */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.3 }}
          className="mb-12 text-center text-5xl font-extrabold text-black"
        >
          Kenapa Belanja di Warung Camera?
        </motion.h2>

        <motion.div
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.25 }}
          className="grid gap-8 md:grid-cols-3"
        >
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm"
          >
            <div className="mb-6 text-5xl">🚚</div>

            <h3 className="mb-4 text-3xl font-bold text-black">
              Pengiriman Seluruh Indonesia
            </h3>

            <p className="text-lg leading-relaxed text-gray-600">
              Produk dikirim menggunakan jasa ekspedisi terpercaya dan aman.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm"
          >
            <div className="mb-6 text-5xl">💳</div>

            <h3 className="mb-4 text-3xl font-bold text-black">
              Pembayaran Fleksibel
            </h3>

            <p className="text-lg leading-relaxed text-gray-600">
              Mendukung transfer bank, QRIS, e-wallet, dan kartu kredit.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm"
          >
            <div className="mb-6 text-5xl">📸</div>

            <h3 className="mb-4 text-3xl font-bold text-black">
              Produk Berkualitas
            </h3>

            <p className="text-lg leading-relaxed text-gray-600">
              Kamera dan perlengkapan fotografi pilihan untuk pemula hingga
              profesional.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}