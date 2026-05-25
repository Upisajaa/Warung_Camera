const products = [
  {
    id: 1,
    name: 'Fujifilm X-T5',
    price: 'Rp 23.500.000',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'
  },
  {
    id: 2,
    name: 'Sony A7 IV',
    price: 'Rp 31.000.000',
    image:
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd'
  },
  {
    id: 3,
    name: 'Canon EOS R5',
    price: 'Rp 48.000.000',
    image:
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9'
  }
];

export default function TrendingProducts() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 pb-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold">
          Produk Trending
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
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
  );
}