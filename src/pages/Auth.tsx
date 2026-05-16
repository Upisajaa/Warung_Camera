import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@warungcamera.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);

  const saveUserAndRedirect = (user: any, isRegister = false) => {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("userChanged"));

    if (isRegister && user.role !== "ADMIN") {
      navigate("/profile");
      return;
    }

    if (user.role === "ADMIN") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Gagal proses akun");
        return;
      }

      toast.success(isLogin ? "Login berhasil" : "Register berhasil");

      saveUserAndRedirect(data.user, !isLogin);
    } catch {
      toast.error("Gagal terhubung ke server");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const googleUser = result.user;

      const res = await fetch("http://localhost:3000/api/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email,
          image: googleUser.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Login Google gagal");
        return;
      }

      toast.success("Login Google berhasil");
      saveUserAndRedirect(data.user, false);
    } catch {
      toast.error("Login Google gagal. Aktifkan Google Sign-In di Firebase.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-14">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="bg-black text-white p-12 flex flex-col justify-between min-h-[620px]">
          <div>
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mb-8">
              <Camera size={34} />
            </div>

            <h1 className="text-5xl font-extrabold mb-6">
              Warung Camera
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Marketplace kamera untuk belanja kamera, lensa, dan aksesoris
              dengan akun email atau Google.
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300 mb-3">Akun admin contoh</p>

            <p className="font-bold text-lg">admin@warungcamera.com</p>
            <p className="text-lg">admin123</p>
          </div>
        </div>

        <div className="p-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            {isLogin ? "Masuk ke akun" : "Buat akun baru"}
          </h2>

          <p className="text-gray-500 mb-8">
            {isLogin
              ? "Login memakai email biasa atau akun Google."
              : "Register akun baru, lalu lengkapi profil kamu."}
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border rounded-2xl py-4 font-bold text-lg hover:bg-gray-100 transition mb-8"
          >
            <span className="text-red-600 mr-3">G</span>
            Lanjutkan dengan Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-gray-400">atau</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="font-bold mb-2 block">Nama Lengkap</label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Thalibul Huda"
                    className="w-full border rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-red-600"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold mb-2 block">Email</label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                  className="w-full border rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold mb-2 block">Password</label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border rounded-2xl pl-12 pr-14 py-4 text-lg focus:outline-none focus:border-red-600"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition"
            >
              {isLogin ? "Login Email" : "Register Email"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setName("");
            }}
            className="w-full mt-7 text-blue-600 font-medium"
          >
            {isLogin
              ? "Belum punya akun? Register"
              : "Sudah punya akun? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}