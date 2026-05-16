import { ShoppingCart, LogOut } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm px-10 py-5 flex items-center justify-between">
      
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <img
          src="/logos.png"
          alt="Logo"
          className="w-20 h-15 object-cover rounded-full"
        />

        <h1 className="text-4xl font-bold">
          WARUNG <span className="text-red-600">CAMERA</span>
        </h1>
      </div>

      {/* MENU */}
      <div className="flex items-center gap-14 text-2xl font-medium">
        <a href="/">Home</a>

        <a href="/produk">Produk</a>

        <a href="/tentang">Tentang</a>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">

        {/* CART */}
        <a href="/cart">
          <ShoppingCart
            size={32}
            className="cursor-pointer"
          />
        </a>

        {user ? (
          <div className="flex items-center gap-4">

            {/* DASHBOARD ADMIN */}
            {user.role?.toUpperCase() === "ADMIN" && (
              <a
                href="/admin"
                className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-700 transition"
              >
                Dashboard
              </a>
            )}

            {/* USER NAME */}
            <span className="text-lg font-semibold">
              {user.name}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="border px-8 py-3 rounded-full text-lg hover:bg-black hover:text-white transition"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}