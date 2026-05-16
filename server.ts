import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PrismaClient, Role } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
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
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});

const formatProduct = (product: any) => ({
  ...product,
  price: Number(product.price),
  rating: product.rating ? Number(product.rating) : null,
});

const getOrCreateCategory = async (name: string) => {
  const categoryName = name || "DSLR";

  let category = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    });
  }

  return category;
};

app.get("/", (req, res) => {
  res.send("Warung Camera API is running");
});

/* =========================
   REGISTER
========================= */
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
        message: "Email sudah terdaftar",
      });
    }

    const user = await prisma.user.create({
      data: {
        name: String(name),
        email: cleanEmail,
        password: String(password),
        role: Role.USER,
      },
    });

    res.status(201).json({
      success: true,
      message: "Register berhasil",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Register gagal",
    });
  }
});

/* =========================
   GOOGLE AUTH
========================= */
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
          role: Role.USER,
        },
      });
    }

    res.json({
      success: true,
      message: "Login Google berhasil",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Login Google gagal",
    });
  }
});

/* =========================
   LOGIN
========================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = String(email).toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   USERS
========================= */
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil user",
    });
  }
});

/* =========================
   PROFILE DATABASE
========================= */
app.get("/api/profile/:email", async (req, res) => {
  try {
    const email = String(req.params.email).toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
    });
  }
});

app.put("/api/profile/:email", async (req, res) => {
  try {
    const email = String(req.params.email).toLowerCase();

    const { name, phone, address, gender, image } = req.body;

    const user = await prisma.user.update({
      where: { email },
      data: {
        name: name || "User",
        phone: phone || null,
        address: address || null,
        gender: gender || null,
        image: image || null,
      },
    });

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal update profil",
    });
  }
});

/* =========================
   PRODUCTS
========================= */
app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    res.json(products.map(formatProduct));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk",
    });
  }
});

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
      product: formatProduct(product),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail produk",
    });
  }
});

app.post("/api/products", upload.array("images", 10), async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      brand,
      category,
      condition,
      description,
    } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({
        success: false,
        message: "Nama, harga, dan stok wajib diisi",
      });
    }

    const categoryData = await getOrCreateCategory(category || "DSLR");

    const files = req.files as Express.Multer.File[];

    const imagePaths = files
      ? files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await prisma.product.create({
      data: {
        name: String(name),
        price: Number(price),
        stock: Number(stock),
        brand: brand || "",
        category: category || "DSLR",
        condition: condition || "NEW",
        description: description || "",
        image: JSON.stringify(imagePaths),
        categoryId: categoryData.id,
      },
    });

    res.json({
      success: true,
      message: "Produk berhasil ditambahkan",
      product: formatProduct(product),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk",
    });
  }
});

app.put("/api/products/:id", upload.array("images", 10), async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      price,
      stock,
      brand,
      category,
      condition,
      description,
      oldImage,
    } = req.body;

    const categoryData = await getOrCreateCategory(category || "DSLR");

    const files = req.files as Express.Multer.File[];

    let imageData = oldImage || "[]";

    if (files && files.length > 0) {
      const imagePaths = files.map((file) => `/uploads/${file.filename}`);
      imageData = JSON.stringify(imagePaths);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(name),
        price: Number(price),
        stock: Number(stock),
        brand: brand || "",
        category: category || "DSLR",
        condition: condition || "NEW",
        description: description || "",
        image: imageData,
        categoryId: categoryData.id,
      },
    });

    res.json({
      success: true,
      message: "Produk berhasil diupdate",
      product: formatProduct(product),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal update produk",
    });
  }
});

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Gagal hapus produk",
    });
  }
});

/* =========================
   CHECKOUT
========================= */
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
        where: {
          id: Number(item.id),
        },
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

      const newStock = product.stock - Number(item.qty);

      if (newStock <= 0) {
        await prisma.product.delete({
          where: {
            id: Number(item.id),
          },
        });
      } else {
        await prisma.product.update({
          where: {
            id: Number(item.id),
          },
          data: {
            stock: newStock,
          },
        });
      }
    }

    res.json({
      success: true,
      message: "Checkout berhasil",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Checkout gagal",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});