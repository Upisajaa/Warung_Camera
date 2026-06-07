import { useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  User,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

type UserType = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  role?: string;
  image?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserType>({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    role: "USER",
    image: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!currentUser.email) {
      toast.error("User belum login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/profile/${currentUser.email}`
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Gagal mengambil profil");
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userChanged"));
    } catch {
      toast.error("Gagal terhubung ke server");
    }
  };

  const getAvatar = () => {
    if (user.image && user.image.startsWith("data:image")) {
      return user.image;
    }

    if (user.gender === "Perempuan") {
      return "https://api.dicebear.com/7.x/notionists/svg?seed=princess-girl";
    }

    if (user.gender === "Laki-laki") {
      return "https://api.dicebear.com/7.x/notionists/svg?seed=business-man";
    }

    return "https://api.dicebear.com/7.x/notionists/svg?seed=formal-user";
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 500;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject("Canvas error");
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
          resolve(compressedBase64);
        };

        img.onerror = () => reject("Gagal membaca gambar");
        img.src = reader.result as string;
      };

      reader.onerror = () => reject("Gagal membaca file");
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 5MB");
      return;
    }

    try {
      const compressedImage = await compressImage(file);

      setUser((prev) => ({
        ...prev,
        image: compressedImage,
      }));

      toast.success("Foto profil berhasil dipilih");
    } catch {
      toast.error("Gagal memproses foto");
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user,
      gender: e.target.value,
      image: "",
    });
  };

  const handleSave = async () => {
    if (!user.email) {
      toast.error("Email user tidak ditemukan");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/profile/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error(data.message || "Gagal menyimpan profil");
        return;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userChanged"));

      toast.success("Profil berhasil disimpan ke database");
    } catch {
      toast.error("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-14">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="bg-black px-10 py-12 text-white">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
              <div className="h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl">
                <img
                  src={getAvatar()}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <label className="absolute bottom-3 right-3 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-600 shadow-lg hover:bg-red-700">
                <Camera className="text-white" size={24} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="text-center md:text-left">
              <h1 className="mb-3 text-5xl font-extrabold">
                {user.name || "User"}
              </h1>

              <p className="mb-5 text-2xl text-gray-300">
                {user.email || "email@gmail.com"}
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <div className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-bold">
                  <ShieldCheck size={18} />
                  {user.role || "USER"}
                </div>

                <div className="rounded-full bg-gray-800 px-6 py-3 font-bold">
                  {user.gender || "Belum dipilih"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h2 className="mb-10 text-4xl font-bold">Edit Profil</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-lg font-bold">
                Nama Lengkap
              </label>

              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="text"
                  value={user.name || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border-2 border-gray-300 py-4 pl-14 pr-5 text-lg focus:border-red-500 focus:outline-none"
                  placeholder="Nama lengkap"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-lg font-bold">
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-2xl border-2 border-gray-300 bg-gray-100 py-4 pl-14 pr-5 text-lg"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-lg font-bold">
                Nomor Telepon
              </label>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="text"
                  value={user.phone || ""}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border-2 border-gray-300 py-4 pl-14 pr-5 text-lg focus:border-red-500 focus:outline-none"
                  placeholder="Nomor telepon"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-lg font-bold">
                Gender
              </label>

              <select
                value={user.gender || ""}
                onChange={handleGenderChange}
                className="w-full rounded-2xl border-2 border-gray-300 px-5 py-4 text-lg focus:border-red-500 focus:outline-none"
              >
                <option value="">Pilih Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-3 block text-lg font-bold">
              Alamat
            </label>

            <div className="relative">
              <MapPin
                className="absolute left-4 top-5 text-gray-400"
                size={22}
              />

              <textarea
                rows={5}
                value={user.address || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: e.target.value,
                  })
                }
                className="w-full rounded-2xl border-2 border-gray-300 py-4 pl-14 pr-5 text-lg focus:border-red-500 focus:outline-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={handleSave}
              className="rounded-2xl bg-red-600 px-10 py-4 text-xl font-bold text-white transition hover:bg-red-700"
            >
              Simpan Profil ke Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}