import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  LogOut,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  brand?: string;
  category?: string;
  condition?: string;
};

const API = "http://localhost:3000/api";

export default function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showProducts, setShowProducts] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    brand: "",
    image: null as File | null,
    oldImage: "",
    category: "DSLR",
    condition: "NEW",
  });

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`);
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      console.log(error);
      setUsers([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      const data = await res.json();

      const allProducts = Array.isArray(data) ? data : data.products || [];

      const activeProducts = allProducts.filter(
        (product: Product) => Number(product.stock) > 0
      );

      setProducts(activeProducts);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  if (!currentUser || currentUser.role?.toUpperCase() !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow text-center">
          <h1 className="text-3xl font-bold mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">Halaman ini hanya untuk admin.</p>
          <a href="/login" className="bg-red-600 text-white px-6 py-3 rounded-full">
            Login Admin
          </a>
        </div>
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      brand: "",
      image: null,
      oldImage: "",
      category: "DSLR",
      condition: "NEW",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setShowProducts(true);
    setShowUsers(false);
  };

  const saveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("oldImage", form.oldImage);

      if (form.image) {
        formData.append("image", form.image);
      }

      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API}/products/${editingId}`
        : `${API}/products`;

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Gagal menyimpan produk");
        return;
      }

      toast.success(data.message || "Produk berhasil disimpan");

      resetForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Gagal terhubung ke server");
    }
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      brand: product.brand || "",
      image: null,
      oldImage: product.image || "",
      category: product.category || "DSLR",
      condition: product.condition || "NEW",
    });

    setShowForm(true);
    setShowProducts(true);
    setShowUsers(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Gagal menghapus produk");
        return;
      }

      toast.success(data.message || "Produk berhasil dihapus");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold">Dashboard Admin</h1>
            <p className="text-gray-600 mt-2">
              Selamat datang, {currentUser.name}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <button
            type="button"
            onClick={() => {
              setShowUsers(true);
              setShowProducts(false);
              setShowForm(false);
            }}
            className="bg-white p-6 rounded-3xl shadow text-left hover:ring-2 hover:ring-red-600 transition"
          >
            <Users className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Total User Aktif</p>
            <h2 className="text-4xl font-bold">{users.length}</h2>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowProducts(true);
              setShowUsers(false);
            }}
            className="bg-white p-6 rounded-3xl shadow text-left hover:ring-2 hover:ring-red-600 transition"
          >
            <Package className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Total Produk Aktif</p>
            <h2 className="text-4xl font-bold">{products.length}</h2>
          </button>

          <div className="bg-white p-6 rounded-3xl shadow">
            <ShoppingCart className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Status</p>
            <h2 className="text-4xl font-bold">Aktif</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowProducts(true);
                  setShowUsers(false);
                }}
                className={`px-5 py-3 rounded-xl font-semibold ${
                  showProducts
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Lihat Produk Aktif
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUsers(true);
                  setShowProducts(false);
                  setShowForm(false);
                }}
                className={`px-5 py-3 rounded-xl font-semibold ${
                  showUsers
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Lihat User Aktif
              </button>
            </div>

            {showProducts && (
              <button
                type="button"
                onClick={openAddForm}
                className="bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah Produk
              </button>
            )}
          </div>

          {showProducts && (
            <>
              <h2 className="text-2xl font-bold mb-5">CRUD Produk Aktif</h2>

              {showForm && (
                <form
                  onSubmit={saveProduct}
                  className="grid md:grid-cols-2 gap-4 mb-8"
                >
                  <input
                    type="text"
                    placeholder="Nama produk"
                    className="border rounded-xl px-4 py-3"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Harga"
                    className="border rounded-xl px-4 py-3"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Stok"
                    className="border rounded-xl px-4 py-3"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Brand"
                    className="border rounded-xl px-4 py-3"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                  />

                  <input
                    type="file"
                    accept="image/*"
                    className="border rounded-xl px-4 py-3"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        image: e.target.files?.[0] || null,
                      })
                    }
                  />

                  <select
                    className="border rounded-xl px-4 py-3"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="DSLR">DSLR</option>
                    <option value="Mirrorless">Mirrorless</option>
                    <option value="Action Cam">Action Cam</option>
                    <option value="Drone">Drone</option>
                    <option value="Lensa">Lensa</option>
                    <option value="Aksesoris">Aksesoris</option>
                  </select>

                  <select
                    className="border rounded-xl px-4 py-3"
                    value={form.condition}
                    onChange={(e) =>
                      setForm({ ...form, condition: e.target.value })
                    }
                  >
                    <option value="NEW">NEW</option>
                    <option value="USED">USED</option>
                  </select>

                  <div className="flex gap-3 md:col-span-2">
                    <button
                      type="submit"
                      className="bg-black text-white px-5 py-3 rounded-xl"
                    >
                      {editingId ? "Update Produk" : "Simpan Produk"}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-200 px-5 py-3 rounded-xl"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          product.image
                            ? `http://localhost:3000${product.image}`
                            : "https://placehold.co/100x100"
                        }
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                      />

                      <div>
                        <p className="font-bold text-xl">{product.name}</p>

                        <p className="text-red-600 font-bold">
                          Rp {Number(product.price).toLocaleString("id-ID")}
                        </p>

                        <p className="text-gray-500">Stok {product.stock}</p>

                        <p className="text-gray-400 text-sm">
                          {product.category} • {product.condition}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editProduct(product)}
                        className="bg-yellow-400 px-3 py-2 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {products.length === 0 && (
                  <p className="text-gray-500">Belum ada produk aktif.</p>
                )}
              </div>
            </>
          )}

          {showUsers && (
            <>
              <h2 className="text-2xl font-bold mb-5">Data User Aktif</h2>

              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center border-b pb-4"
                  >
                    <div>
                      <p className="font-bold text-xl">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>

                    <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold">
                      {user.role}
                    </span>
                  </div>
                ))}

                {users.length === 0 && (
                  <p className="text-gray-500">Belum ada user aktif.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}