const categories = [
  "DSLR",
  "Mirrorless",
  "Action Cam",
  "Drone",
  "Lensa",
  "Aksesoris",
];

const products = [
  {
    name: "Sony A7 IV",
    price: "Rp 31.000.000",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  },
  {
    name: "Canon EOS R5",
    price: "Rp 48.000.000",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
  },
  {
    name: "Fujifilm X-T5",
    price: "Rp 23.500.000",
    image:
      "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
  },
];

export default function Home() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen text-black">
      
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden p-10 grid md:grid-cols-2 items-center gap-10">

          <div>
            <h1 className="text-7xl font-serif italic leading-none mb-6">
              Capture <br />
              Perfection.
            </h1>

            <p className="text-gray-600 text-lg mb-8">
              Marketplace Kamera No.1 untuk Profesional & Kreator.
              Teknologi Mutakhir, Transaksi Aman.
            </p>

            <button className="bg-red-600 hover:bg-red-700 text-white px-7 py-4 rounded-full font-semibold transition-all">
              Jelajahi Produk
            </button>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
              className="w-[500px] rounded-3xl object-cover"
            />
          </div>

        </div>
      </section>

      {/* KATEGORI */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <h2 className="text-4xl font-bold mb-10">
          Kategori Populer
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow hover:shadow-xl transition-all text-center cursor-pointer"
            >
              <div className="text-5xl mb-4">📷</div>

              <h3 className="font-semibold text-lg">
                {item}
              </h3>
            </div>
          ))}

        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-6 mt-20 pb-20">

        <h2 className="text-4xl font-bold mb-10">
          Produk Trending
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={product.image}
                className="h-72 w-full object-cover"
              />

              <div className="p-6">

                <h3 className="font-bold text-2xl mb-3">
                  {product.name}
                </h3>

                <p className="text-red-600 font-bold text-xl mb-5">
                  {product.price}
                </p>

                <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-all">
                  Add to Cart
                </button>

              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}