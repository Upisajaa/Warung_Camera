import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  Package,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getProfileImage = () => {
    if (user?.image && user.image.startsWith("data:image")) {
      return user.image;
    }

    if (user?.gender === "Perempuan") {
      return "https://api.dicebear.com/7.x/notionists/svg?seed=princess-girl";
    }

    if (user?.gender === "Laki-laki") {
      return "https://api.dicebear.com/7.x/notionists/svg?seed=business-man";
    }

    return "https://api.dicebear.com/7.x/notionists/svg?seed=formal-user";
  };

  return (
    <header className="w-full bg-white border-b border-black sticky top-0 z-50">
      <div className="max-w-[1700px] mx-auto px-10 py-5 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-5 shrink-0">
          <img
            src="/logos.png"
            alt="Warung Camera"
            className="w-24 h-24 object-contain"
          />

          <h1 className="text-4xl font-extrabold tracking-wide leading-none">
            WARUNG <br />
            <span className="text-red-600">CAMERA</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-2xl font-medium">
          <Link
            to="/"
            className={`transition ${
              isActive("/") ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/produk"
            className={`transition ${
              isActive("/produk") || isActive("/products")
                ? "text-red-600"
                : "hover:text-red-600"
            }`}
          >
            Produk
          </Link>

          <Link
            to="/about"
            className={`transition ${
              isActive("/about") || isActive("/tentang")
                ? "text-red-600"
                : "hover:text-red-600"
            }`}
          >
            Tentang
          </Link>

          {user && user.role !== "ADMIN" && (
            <Link
              to="/orders"
              className={`transition flex items-center gap-2 ${
                isActive("/orders") ? "text-red-600" : "hover:text-red-600"
              }`}
            >
              <Package size={24} />
              Pesanan Saya
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => navigate("/cart")}
            className={`transition ${
              isActive("/cart") ? "text-red-600" : "hover:text-red-600"
            }`}
          >
            <ShoppingCart size={38} />
          </button>

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <>
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/admin/orders")}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-800 transition flex items-center gap-2"
                  >
                    <ClipboardList size={20} />
                    Pesanan User
                  </button>
                </>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-3 hover:text-red-600 transition"
              >
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 bg-white shadow-sm"
                />

                <span className="text-2xl font-semibold">
                  {user.name || "User"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-black text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-800 transition"
              >
                <LogOut size={22} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="border border-black px-8 py-3 rounded-full text-xl hover:bg-black hover:text-white transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}