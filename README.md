# 📸 Warung Camera

Warung Camera adalah aplikasi marketplace kamera berbasis web yang memungkinkan pengguna untuk membeli, menjual, dan mengelola produk kamera secara online. Sistem ini memiliki fitur autentikasi pengguna, login Google, manajemen produk, checkout, upload bukti pembayaran, dashboard admin, dan verifikasi OTP melalui Gmail.

---

## 🚀 Fitur Utama

### 👤 User

* Registrasi akun
* Login menggunakan Email & Password
* Login menggunakan Google
* Verifikasi OTP melalui Gmail
* Melihat daftar produk
* Melihat detail produk
* Menambahkan produk ke keranjang
* Checkout produk
* Upload bukti pembayaran
* Mengelola profil pengguna
* Melihat riwayat pesanan

### 🛠️ Admin

* Login sebagai Admin
* Dashboard Admin
* Kelola Produk (Tambah, Edit, Hapus)
* Kelola User
* Melihat daftar pesanan
* Konfirmasi pembayaran
* Mengubah status pesanan
* Mengelola stok produk

---

## 🏗️ Teknologi yang Digunakan

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* React Hot Toast
* Firebase Authentication
* EmailJS
* Lucide React

### Backend

* Node.js
* Express.js
* Prisma ORM
* Multer
* MySQL

### Database

* MySQL

---

## 📂 Struktur Project

```bash
Warung_Camera
│
├── public/
│   └── uploads/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   ├── App.tsx
│   └── main.tsx
│
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Instalasi

### Clone Repository

```bash
git clone https://github.com/username/Warung_Camera.git
cd Warung_Camera
```

### Install Dependency

```bash
npm install
```

---

## 🗄️ Konfigurasi Database

Buat database MySQL:

```sql
CREATE DATABASE warung_camera;
```

Buat file:

```env
.env
```

Isi:

```env
DATABASE_URL="mysql://root@localhost:3306/warung_camera"
```

---

## Prisma

Generate Prisma Client

```bash
npx prisma generate
```

Migrasi Database

```bash
npx prisma db push
```

---

## 🔥 Konfigurasi Firebase

Buat project Firebase kemudian aktifkan:

* Authentication
* Google Sign-In

Isi file:

```ts
src/lib/firebase.ts
```

dengan konfigurasi Firebase milik Anda.

---

## 📧 Konfigurasi EmailJS

1. Buat akun EmailJS
2. Tambahkan Gmail Service
3. Buat Email Template OTP
4. Ambil:

* SERVICE_ID
* TEMPLATE_ID
* PUBLIC_KEY

Masukkan pada:

```tsx
  const SERVICE_ID = "service_itoh16t";
  const TEMPLATE_ID = "template_0q6kv2j";
  const PUBLIC_KEY = "LdeGXuEjz3Obkm-mv";
```

---

## ▶️ Menjalankan Backend

```bash
npm run server
```

Output:

```bash
Server running on http://localhost:3000
```

---

## ▶️ Menjalankan Frontend

```bash
npm run dev
```

Output:

```bash
Local: http://localhost:5173
```

---

## 👨‍💼 Akun Admin Default

```txt
Email    : admin@warungcamera.com
Password : admin123
```

---

## 📌 API Endpoint

### Authentication

```http
POST /api/login
POST /api/register
POST /api/google-auth
```

### User

```http
GET /api/users
GET /api/profile/:email
PUT /api/profile/:email
```

### Product

```http
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Checkout

```http
POST /api/checkout
```

---

## 👨‍💻 Tim Pengembang

* Thalibul Huda Assuja
* Candra Kurniawan
* Supriatna


---

## 📄 Lisensi

Project ini dibuat untuk keperluan akademik dan pembelajaran.
