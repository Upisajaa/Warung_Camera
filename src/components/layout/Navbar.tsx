import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  Package,
  LayoutDashboard,
  ClipboardList,
  Camera,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);

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

  useEffect(() => {
    setOpenMenu(false);
  }, [location.pathname]);

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

  const navLinkClass = (active: boolean) =>
    `rounded-xl px-4 py-2 font-semibold transition ${
      active
        ? "bg-red-50 text-red-600"
        : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <img
            src="/logos.png"
            alt="Warung Camera"
            className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14"
          />

          <h1 className="leading-none tracking-wide">
            <span className="block text-xl font-black text-black sm:text-3xl">
              WARUNG
            </span>
            <span className="block text-xl font-black text-red-600 sm:text-3xl">
              CAMERA
            </span>
          </h1>
        </Link>

        <nav className="hidden min-w-0 items-center gap-2 text-base font-semibold xl:flex">
          <Link to="/" className={navLinkClass(isActive("/"))}>
            Home
          </Link>

          <Link to="/produk" className={navLinkClass(isProductActive)}>
            Produk
          </Link>

          {user?.role !== "ADMIN" && (
            <button
              type="button"
              onClick={handleSellClick}
              className={navLinkClass(isActive("/sell"))}
            >
              <span className="flex items-center gap-2">
                <Camera size={19} />
                Jual Kamera
              </span>
            </button>
          )}

          <Link
            to="/about"
            className={navLinkClass(isActive("/about") || isActive("/tentang"))}
          >
            Tentang
          </Link>

          {user && user.role !== "ADMIN" && (
            <Link to="/orders" className={navLinkClass(isActive("/orders"))}>
              <span className="flex items-center gap-2">
                <Package size={19} />
                Pesanan Saya
              </span>
            </Link>
          )}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={`relative rounded-full p-2.5 transition ${
              isActive("/cart")
                ? "bg-red-50 text-red-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
            }`}
          >
            <ShoppingCart size={26} />
          </button>

          {user ? (
            <>
              {user.role === "ADMIN" && (
                <>
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:bg-gray-200"
                  >
                    <ClipboardList size={18} />
                    Pesanan User
                  </button>
                </>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-gray-100"
              >
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-gray-300 bg-white object-cover shadow-sm"
                />

                <span className="max-w-[120px] truncate text-base font-semibold text-gray-800">
                  {user.role === "ADMIN" ? "Admin" : user.name || "User"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
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

        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={`rounded-full p-2 transition ${
              isActive("/cart")
                ? "bg-red-50 text-red-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
            }`}
          >
            <ShoppingCart size={24} />
          </button>

          <button
            type="button"
            onClick={() => setOpenMenu((prev) => !prev)}
            className="rounded-full border border-gray-300 bg-white p-2 text-gray-800"
          >
            {openMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-lg xl:hidden">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2">
            <Link to="/" className={navLinkClass(isActive("/"))}>
              Home
            </Link>

            <Link to="/produk" className={navLinkClass(isProductActive)}>
              Produk
            </Link>

            {user?.role !== "ADMIN" && (
              <button
                type="button"
                onClick={handleSellClick}
                className={navLinkClass(isActive("/sell"))}
              >
                <span className="flex items-center gap-2">
                  <Camera size={19} />
                  Jual Kamera
                </span>
              </button>
            )}

            <Link
              to="/about"
              className={navLinkClass(
                isActive("/about") || isActive("/tentang")
              )}
            >
              Tentang
            </Link>

            {user && user.role !== "ADMIN" && (
              <Link to="/orders" className={navLinkClass(isActive("/orders"))}>
                <span className="flex items-center gap-2">
                  <Package size={19} />
                  Pesanan Saya
                </span>
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className={navLinkClass(isActive("/admin"))}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={19} />
                    Dashboard
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/orders")}
                  className={navLinkClass(isActive("/admin/orders"))}
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList size={19} />
                    Pesanan User
                  </span>
                </button>
              </>
            )}

            <div className="mt-3 border-t border-gray-200 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border border-gray-300 bg-white object-cover"
                    />
                    <span className="truncate">
                      {user.role === "ADMIN" ? "Admin" : user.name || "User"}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={19} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}