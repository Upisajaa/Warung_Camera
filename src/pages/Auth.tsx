import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Camera,
  Mail,
  Lock,
  User,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

type PendingUser = {
  name: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isOtpStep, setIsOtpStep] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@warungcamera.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);

  const [otpInput, setOtpInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [loading, setLoading] = useState(false);

  const SERVICE_ID = "service_itoh16t";
  const TEMPLATE_ID = "template_0q6kv2j";
  const PUBLIC_KEY = "LdeGXuEjz3Obkm-mv";

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

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtpToEmail = async (
    userEmail: string,
    userName: string,
    otpCodeValue: string
  ) => {
    try {
      const templateParams = {
        to_email: userEmail,
        name: userName,
        email: userEmail,
        otp: otpCodeValue,
      };

      console.log("Mengirim OTP EmailJS:", templateParams);

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      return true;
    } catch (error) {
      console.error("EmailJS Error:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.success === false) {
          toast.error(data.message || "Login gagal");
          return;
        }

        toast.success("Login berhasil");
        saveUserAndRedirect(data.user, false);
      } catch {
        toast.error("Gagal terhubung ke server");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!name || !email || !password) {
      toast.error("Lengkapi semua data register");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const code = generateOtp();

      const sent = await sendOtpToEmail(email, name, code);

      if (!sent) {
        toast.error("Gagal mengirim OTP ke Gmail. Cek Console F12.");
        return;
      }

      setOtpCode(code);
      setPendingUser({
        name,
        email,
        password,
      });

      setOtpInput("");
      setIsOtpStep(true);

      toast.success("Kode OTP berhasil dikirim ke Gmail");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pendingUser) {
      toast.error("Data register tidak ditemukan");
      return;
    }

    if (!otpInput || otpInput.length !== 6) {
      toast.error("Masukkan kode OTP 6 digit");
      return;
    }

    if (otpInput !== otpCode) {
      toast.error("Kode OTP salah");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pendingUser,
          otp: otpInput,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Register gagal");
        return;
      }

      toast.success("Verifikasi berhasil, akun dibuat");
      saveUserAndRedirect(data.user, true);
    } catch {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingUser) {
      toast.error("Data register tidak ditemukan");
      return;
    }

    try {
      setLoading(true);

      const code = generateOtp();

      const sent = await sendOtpToEmail(
        pendingUser.email,
        pendingUser.name,
        code
      );

      if (!sent) {
        toast.error("Gagal kirim ulang OTP. Cek Console F12.");
        return;
      }

      setOtpCode(code);
      setOtpInput("");

      toast.success("Kode OTP baru dikirim ke Gmail");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="flex min-h-[620px] flex-col justify-between bg-black p-12 text-white">
          <div>
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black">
              <Camera size={34} />
            </div>

            <h1 className="mb-6 text-5xl font-extrabold">Warung Camera</h1>

            <p className="text-xl leading-relaxed text-gray-300">
              Marketplace kamera untuk belanja kamera, lensa, dan aksesoris
              dengan akun email atau Google.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <p className="mb-3 text-gray-300">Akun admin contoh</p>
            <p className="text-lg font-bold">admin@warungcamera.com</p>
            <p className="text-lg">admin123</p>
          </div>
        </div>

        <div className="p-12">
          <h2 className="mb-3 text-4xl font-extrabold text-gray-900">
            {isOtpStep
              ? "Verifikasi OTP"
              : isLogin
              ? "Masuk ke akun"
              : "Buat akun baru"}
          </h2>

          <p className="mb-8 text-gray-500">
            {isOtpStep
              ? `Kode OTP sudah dikirim ke ${pendingUser?.email}. Cek Inbox atau Spam Gmail.`
              : isLogin
              ? "Login memakai email biasa atau akun Google."
              : "Register akun baru, lalu verifikasi kode OTP dari Gmail."}
          </p>

          {!isOtpStep && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mb-8 w-full rounded-2xl border py-4 text-lg font-bold transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mr-3 text-red-600">G</span>
                Lanjutkan dengan Google
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400">atau</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
            </>
          )}

          {isOtpStep ? (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="rounded-2xl bg-green-50 p-5 text-sm font-semibold text-green-700">
                Masukkan kode OTP 6 digit yang sudah dikirim ke Gmail. Jika
                tidak ada di Inbox, cek folder Spam.
              </div>

              <div>
                <label className="mb-2 block font-bold">Kode OTP</label>

                <div className="relative">
                  <ShieldCheck
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) =>
                      setOtpInput(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Masukkan 6 digit OTP"
                    className="w-full rounded-2xl border py-4 pl-12 pr-4 text-center text-2xl font-bold tracking-[8px] focus:border-red-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-red-600 py-4 text-lg font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memverifikasi..." : "Verifikasi & Buat Akun"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="w-full rounded-2xl border py-4 font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Kirim Ulang OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setOtpInput("");
                }}
                className="w-full font-medium text-blue-600"
              >
                Kembali ke Register
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="mb-2 block font-bold">
                      Nama Lengkap
                    </label>

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
                        className="w-full rounded-2xl border py-4 pl-12 pr-4 text-lg focus:border-red-600 focus:outline-none"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block font-bold">Email</label>

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
                      className="w-full rounded-2xl border py-4 pl-12 pr-4 text-lg focus:border-red-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block font-bold">Password</label>

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
                      className="w-full rounded-2xl border py-4 pl-12 pr-14 text-lg focus:border-red-600 focus:outline-none"
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
                  disabled={loading}
                  className="w-full rounded-2xl bg-black py-4 text-lg font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Memproses..."
                    : isLogin
                    ? "Login Email"
                    : "Kirim Kode OTP ke Gmail"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName("");
                  setOtpInput("");
                  setIsOtpStep(false);

                  if (isLogin) {
                    setEmail("");
                    setPassword("");
                  } else {
                    setEmail("admin@warungcamera.com");
                    setPassword("admin123");
                  }
                }}
                className="mt-7 w-full font-medium text-blue-600"
              >
                {isLogin
                  ? "Belum punya akun? Register"
                  : "Sudah punya akun? Login"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}