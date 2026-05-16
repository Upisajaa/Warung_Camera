import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const brands = [
    "Canon",
    "Nikon",
    "Sony",
    "Fujifilm",
    "Panasonic",
    "Olympus",
    "GoPro",
    "DJI",
    "Leica",
    "Kodak",
    "Insta360",
  ];

  const categories = [
    "DSLR",
    "Mirrorless",
    "Action Cam",
    "Drone",
    "Lensa",
    "Lighting",
    "Audio",
    "Tripod",
    "Gimbal",
    "Aksesoris",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();

      const activeProducts = data.filter(
        (product: any) => Number(product.stock) > 0
      );

      setProducts(activeProducts);
    } catch {
      toast.error("Gagal mengambil produk");
    }
  };

  const formatPrice = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(formatPrice(e.target.value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length > 10) {
      toast.error("Maksimal 10 gambar");
      return;
    }

    setImages(files);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setBrand("");
    setCategory("");
    setCondition("NEW");
    setDescription("");
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) return toast.error("Nama produk wajib diisi");
    if (!price) return toast.error("Harga wajib diisi");
    if (!stock) return toast.error("Stok wajib diisi");
    if (!brand) return toast.error("Brand wajib dipilih");
    if (!category) return toast.error("Kategori wajib dipilih");
    if (images.length === 0) return toast.error("Minimal upload 1 gambar");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price.replace(/\./g, ""));
      formData.append("stock", stock);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("description", description);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Gagal tambah produk");
        return;
      }

      toast.success("Produk berhasil ditambahkan");
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk?")) return;

    try {
      await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });

      toast.success("Produk dihapus");
      fetchProducts();
    } catch {
      toast.error("Gagal hapus produk");
    }
  };

  const getImages = (image: string) => {
    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed : [image];
    } catch {
      return [image];
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[35px] p-8 border">
          <h1 className="text-5xl font-extrabold mb-3">
            Dashboard Admin
          </h1>

          <p className="text-gray-500 mb-10 text-lg">
            Kelola produk marketplace kamera
          </p>

          <h2 className="text-3xl font-bold mb-6">
            Tambah Produk
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-5 mb-10"
          >
            <input
              type="text"
              placeholder="Nama produk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg"
            />

            <input
              type="text"
              placeholder="Harga"
              value={price}
              onChange={handlePriceChange}
              className="border rounded-2xl px-5 py-4 text-lg"
            />

            <input
              type="number"
              placeholder="Stok"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg"
            />

            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg"
            >
              <option value="">Pilih Brand</option>
              {brands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-2xl px-5 py-4 text-lg"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg"
            >
              <option value="NEW">NEW</option>
              <option value="USED">USED</option>
            </select>

            <textarea
              placeholder="Keterangan produk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-2xl px-5 py-4 text-lg md:col-span-2 min-h-[150px]"
            />

            <div className="md:col-span-2">
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:opacity-90 transition"
                >
                  Simpan Produk
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 px-10 py-4 rounded-2xl font-bold hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>

          <h2 className="text-3xl font-bold mb-6">
            Produk Aktif
          </h2>

          <div className="space-y-6">
            {products.map((product) => {
              const productImages = getImages(product.image);

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-6"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={`http://localhost:3000${productImages[0]}`}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-2xl border"
                    />

                    <div>
                      <h2 className="text-3xl font-bold">
                        {product.name}
                      </h2>

                      <p className="text-red-600 font-bold text-2xl mt-2">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </p>

                      <p className="text-gray-500 text-lg">
                        Stok {product.stock}
                      </p>

                      <p className="text-gray-400 text-lg">
                        {product.brand} • {product.category} •{" "}
                        {product.condition} • {productImages.length} gambar
                      </p>

                      {product.description && (
                        <p className="text-gray-600 mt-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold"
                  >
                    Hapus
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}