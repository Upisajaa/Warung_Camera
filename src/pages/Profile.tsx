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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setUser({
        ...user,
        image: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
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
    <div className="min-h-screen bg-gray-100 py-14 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-black px-10 py-12 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-white shadow-2xl">
                <img
                  src={getAvatar()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="absolute bottom-3 right-3 bg-red-600 hover:bg-red-700 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
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
              <h1 className="text-5xl font-extrabold mb-3">
                {user.name || "User"}
              </h1>

              <p className="text-2xl text-gray-300 mb-5">
                {user.email || "email@gmail.com"}
              </p>

              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <div className="bg-red-600 px-6 py-3 rounded-full flex items-center gap-2 font-bold">
                  <ShieldCheck size={18} />
                  {user.role || "USER"}
                </div>

                <div className="bg-gray-800 px-6 py-3 rounded-full font-bold">
                  {user.gender || "Belum dipilih"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <h2 className="text-4xl font-bold mb-10">Edit Profil</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="font-bold text-lg mb-3 block">
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
                  className="w-full border-2 border-gray-300 rounded-2xl py-4 pl-14 pr-5 text-lg focus:outline-none focus:border-red-500"
                  placeholder="Nama lengkap"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-lg mb-3 block">Email</label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full border-2 border-gray-300 rounded-2xl py-4 pl-14 pr-5 text-lg bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-lg mb-3 block">
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
                  className="w-full border-2 border-gray-300 rounded-2xl py-4 pl-14 pr-5 text-lg focus:outline-none focus:border-red-500"
                  placeholder="Nomor telepon"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-lg mb-3 block">Gender</label>

              <select
                value={user.gender || ""}
                onChange={handleGenderChange}
                className="w-full border-2 border-gray-300 rounded-2xl py-4 px-5 text-lg focus:outline-none focus:border-red-500"
              >
                <option value="">Pilih Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="font-bold text-lg mb-3 block">Alamat</label>

            <div className="relative">
              <MapPin className="absolute left-4 top-5 text-gray-400" size={22} />

              <textarea
                rows={5}
                value={user.address || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: e.target.value,
                  })
                }
                className="w-full border-2 border-gray-300 rounded-2xl py-4 pl-14 pr-5 text-lg focus:outline-none focus:border-red-500"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={handleSave}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl text-xl font-bold transition"
            >
              Simpan Profil ke Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}