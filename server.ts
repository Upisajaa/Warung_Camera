import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.send("Warung Camera API is running");
});

// REGISTER EMAIL
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    const cleanEmail = String(email).toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar, silakan login",
      });
    }

    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: cleanEmail,
        password: String(password),
        role: "USER",
      },
    });

    res.status(201).json({
      success: true,
      message: "Register berhasil",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Register gagal",
    });
  }
});

// LOGIN / REGISTER GOOGLE
app.post("/api/google-auth", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email Google tidak ditemukan",
      });
    }

    const cleanEmail = String(email).toLowerCase();

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || cleanEmail.split("@")[0],
          email: cleanEmail,
          password: "GOOGLE_ACCOUNT",
          role: "USER",
        },
      });
    }

    res.json({
      success: true,
      message: "Login Google berhasil",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login Google gagal",
    });
  }
});

// LOGIN EMAIL
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email tidak ditemukan",
      });
    }

    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        message: "Password salah",
      });
    }

    res.json({
      success: true,
      message: "Login berhasil",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil user",
    });
  }
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
});

// GET PRODUCT DETAIL
app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail produk",
    });
  }
});

// ADD PRODUCT
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, brand, category, condition } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        brand: brand || "",
        category: category || "DSLR",
        condition: condition || "NEW",
        image: imagePath,
        categoryId: 1,
      },
    });

    res.json({
      success: true,
      message: "Produk berhasil ditambahkan",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
});

// UPDATE PRODUCT
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price, stock, brand, category, condition, oldImage } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : oldImage || "";

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        brand: brand || "",
        category: category || "DSLR",
        condition: condition || "NEW",
        image: imagePath,
        categoryId: 1,
      },
    });

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal update produk",
    });
  }
});

// DELETE PRODUCT
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal hapus produk",
    });
  }
});

// CHECKOUT
app.post("/api/checkout", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Keranjang kosong",
      });
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.id) },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk ${item.name} tidak ditemukan`,
        });
      }

      if (product.stock < Number(item.qty)) {
        return res.status(400).json({
          success: false,
          message: `Stok ${item.name} tidak cukup`,
        });
      }

      await prisma.product.update({
        where: { id: Number(item.id) },
        data: {
          stock: product.stock - Number(item.qty),
        },
      });
    }

    res.json({
      success: true,
      message: "Checkout berhasil",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Checkout gagal",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});