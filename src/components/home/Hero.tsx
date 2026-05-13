export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-10">
      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden p-10 grid md:grid-cols-2 items-center gap-10">

        <div>
          <h1 className="text-7xl font-serif italic leading-none mb-6 text-black">
            Capture <br />
            Perfection.
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Marketplace Kamera No.1 untuk Profesional & Kreator.
          </p>

          <button className="bg-red-600 hover:bg-red-700 text-white px-7 py-4 rounded-full font-semibold transition-all">
            Jelajahi Produk
          </button>
        </div>

        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
            className="w-[500px] object-contain rounded-3xl"
          />
        </div>

      </div>
    </section>
  );
}