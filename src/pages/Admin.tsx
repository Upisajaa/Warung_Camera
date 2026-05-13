import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, LogOut } from "lucide-react";

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
};

export default function AdminDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));

    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow text-center">
          <h1 className="text-3xl font-bold mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">
            Halaman ini hanya untuk admin.
          </p>
          <a
            href="/auth"
            className="bg-red-600 text-white px-6 py-3 rounded-full"
          >
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
            onClick={logout}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow">
            <Users className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Total User</p>
            <h2 className="text-4xl font-bold">{users.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <Package className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Total Produk</p>
            <h2 className="text-4xl font-bold">{products.length}</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <ShoppingCart className="text-red-600 mb-4" size={36} />
            <p className="text-gray-500">Status</p>
            <h2 className="text-4xl font-bold">Aktif</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Data User</h2>

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-gray-500">{user.email}</p>
                  </div>

                  <span className="bg-gray-100 px-4 py-2 rounded-full">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">Data Produk</h2>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-red-600 font-semibold">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <span className="bg-gray-100 px-4 py-2 rounded-full">
                    Stok {product.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}