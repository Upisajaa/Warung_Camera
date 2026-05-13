import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#f5f5f5] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* LOGO */}
       <Link to="/" className="flex items-center gap-0">

          <img
            src="/logos.png"
            alt="Logo"
            className="w-40 h-14 object-cover translate-y-2"
          />

          <div className="text-3xl font-bold leading-none flex items-center -ml-2">

            <span className="text-black">
              WARUNG
            </span>

            <span className="text-red-600 ml-3">
              CAMERA
            </span>

          </div>

        </Link>
        {/* MENU */}
        <nav className="hidden md:flex items-center gap-12 text-lg font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-red-600"
                : "text-black hover:text-red-600 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-red-600"
                : "text-black hover:text-red-600 transition"
            }
          >
            Produk
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-red-600"
                : "text-black hover:text-red-600 transition"
            }
          >
            Tentang
          </NavLink>

        </nav>

        {/* RIGHT MENU */}
        <div className="flex items-center gap-5">

          <Link
            to="/cart"
            className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <ShoppingCart size={26} />
          </Link>

          <Link
            to="/auth"
            className="px-8 py-3 border border-gray-300 rounded-full text-lg hover:bg-black hover:text-white transition"
          >
            Login
          </Link>

        </div>

      </div>
    </header>
  );
}