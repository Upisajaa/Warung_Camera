import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  Package,
  LayoutDashboard,
  ClipboardList,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
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
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  const handleSellClick = () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    navigate("/sell");
  };

  const isActive = (path: string) => location.pathname === path;

  const isProductActive =
    location.pathname === "/produk" ||
    location.pathname === "/products" ||
    location.pathname.startsWith("/produk/") ||
    location.pathname.startsWith("/product/");

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-8 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <img
            src="/logos.png"
            alt="Warung Camera"
            className="h-14 w-14 object-contain"
          />

          <h1 className="leading-none tracking-wide">
            <span className="block text-3xl font-black text-black">
              WARUNG
            </span>
            <span className="block text-3xl font-black text-red-600">
              CAMERA
            </span>
          </h1>
        </Link>

        <nav className="hidden items-center gap-7 text-[18px] font-semibold lg:flex">
          <Link
            to="/"
            className={`transition ${
              isActive("/")
                ? "text-red-600"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Home
          </Link>

          <Link
            to="/produk"
            className={`transition ${
              isProductActive
                ? "text-red-600"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Produk
          </Link>

          {user?.role !== "ADMIN" && (
            <button
              type="button"
              onClick={handleSellClick}
              className={`flex items-center gap-2 transition ${
                isActive("/sell")
                  ? "text-red-600"
                  : "text-gray-700 hover:text-red-600"
              }`}
            >
              <Camera size={20} />
              Jual Kamera
            </button>
          )}

          <Link
            to="/about"
            className={`transition ${
              isActive("/about") || isActive("/tentang")
                ? "text-red-600"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Tentang
          </Link>

          {user && user.role !== "ADMIN" && (
            <Link
              to="/orders"
              className={`flex items-center gap-2 transition ${
                isActive("/orders")
                  ? "text-red-600"
                  : "text-gray-700 hover:text-red-600"
              }`}
            >
              <Package size={20} />
              Pesanan Saya
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={`relative rounded-full p-2 transition ${
              isActive("/cart")
                ? "bg-red-50 text-red-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
            }`}
          >
            <ShoppingCart size={28} />
          </button>

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-800 transition hover:bg-gray-200"
                  >
                    <ClipboardList size={18} />
                    Pesanan User
                  </button>
                </>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-gray-100"
              >
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="h-11 w-11 rounded-full border border-gray-300 bg-white object-cover shadow-sm"
                />

                <span className="max-w-[150px] truncate text-lg font-semibold text-gray-800">
                  {user.role === "ADMIN" ? "Admin" : user.name || "User"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-800 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border border-red-600 px-6 py-2.5 text-base font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}