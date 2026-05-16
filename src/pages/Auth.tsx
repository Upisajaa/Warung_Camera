import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import { auth } from "../lib/firebase";

type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  user?: ApiUser;
};

const API_URL = "http://localhost:3000";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@warungcamera.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const saveUserAndRedirect = (user?: ApiUser, message?: string) => {
    if (!user) {
      toast.error("Data user tidak ditemukan");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
    toast.success(message || "Berhasil masuk");

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin
      ? `${API_URL}/api/login`
      : `${API_URL}/api/register`;

    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || (isLogin ? "Login gagal" : "Register gagal"));
        return;
      }

      saveUserAndRedirect(data.user, data.message);
    } catch (error) {
      console.error(error);
      toast.error("Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      const res = await fetch(`${API_URL}/api/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email,
          photoURL: googleUser.photoURL,
          uid: googleUser.uid,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Login Google gagal");
        return;
      }

      saveUserAndRedirect(data.user, data.message || "Login Google berhasil");
    } catch (error) {
      console.error(error);
      toast.error("Login Google gagal. Aktifkan Google Sign-In di Firebase.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="hidden md:flex flex-col justify-between bg-black text-white p-10">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center mb-6">
              <Camera size={30} />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight">
              Warung Camera
            </h1>

            <p className="mt-4 text-gray-300 leading-relaxed">
              Marketplace kamera untuk belanja kamera, lensa, dan aksesoris
              dengan akun email atau Google.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
            <p className="text-sm text-gray-300">Akun admin contoh</p>
            <p className="mt-2 font-semibold">admin@warungcamera.com</p>
            <p className="text-gray-300">admin123</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="md:hidden flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center">
              <Camera size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Warung Camera</h1>
              <p className="text-sm text-gray-500">Login / Register</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Masuk ke akun" : "Buat akun baru"}
          </h2>

          <p className="mt-2 text-gray-500">
            {isLogin
              ? "Login memakai email biasa atau akun Google."
              : "Register memakai email biasa atau langsung dengan Google."}
          </p>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="mt-7 w-full h-12 border border-gray-300 rounded-xl flex items-center justify-center gap-3 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-sm font-bold text-red-500">
                G
              </span>
            )}

            {googleLoading ? "Menghubungkan Google..." : "Lanjutkan dengan Google"}
          </button>

          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-sm text-gray-400">atau</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Thalibul Huda"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-12 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? "Memproses..." : isLogin ? "Login Email" : "Register Email"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-5 text-sm text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Belum punya akun? Register" : "Sudah punya akun? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}