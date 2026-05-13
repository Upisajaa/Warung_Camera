import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@warungcamera.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    if (!isLogin && !name) {
      toast.error("Nama wajib diisi");
      return;
    }

    setLoading(true);

    const endpoint = isLogin
      ? "http://localhost:3000/api/login"
      : "http://localhost:3000/api/register";

    const body = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login gagal");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Berhasil masuk");

      setTimeout(() => {
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }, 500);
    } catch (error) {
      toast.error("Server belum aktif atau API error");
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setIsLogin(true);
    setEmail("admin@warungcamera.com");
    setPassword("admin123");
  };

  const fillUser = () => {
    setIsLogin(true);
    setEmail("user@warungcamera.com");
    setPassword("user123");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl bg-white rounded-[36px] shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex bg-black text-white p-10 flex-col justify-between">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-5">
              Warung <span className="text-red-600">Camera</span>
            </h1>

            <p className="text-gray-300 leading-8">
              Masuk sebagai user untuk belanja kamera. Masuk sebagai admin untuk
              mengelola dashboard, user, dan produk.
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-6">
            <p className="font-bold mb-2">Akun tersedia:</p>
            <p>Admin: admin@warungcamera.com</p>
            <p>Password: admin123</p>
            <br />
            <p>User: user@warungcamera.com</p>
            <p>Password: user123</p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-black mb-3">
              {isLogin ? "Login" : "Daftar Akun"}
            </h2>

            <p className="text-gray-500">
              {isLogin
                ? "Masuk ke akun Warung Camera"
                : "Buat akun baru sebagai user"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={fillAdmin}
              className="bg-red-600 text-white rounded-full py-3 font-semibold hover:bg-red-700 transition"
            >
              Isi Admin
            </button>

            <button
              type="button"
              onClick={fillUser}
              className="bg-gray-100 text-black rounded-full py-3 font-semibold hover:bg-gray-200 transition"
            >
              Isi User
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="font-semibold text-black mb-2 block">
                  Nama Lengkap
                </label>

                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-2xl px-12 py-4 outline-none focus:border-red-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-black mb-2 block">
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-12 py-4 outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-black mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-12 py-4 pr-14 outline-none focus:border-red-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-full font-bold hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading ? "Memproses..." : isLogin ? "Login" : "Daftar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 font-semibold hover:underline"
            >
              {isLogin
                ? "Belum punya akun? Daftar"
                : "Sudah punya akun? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}