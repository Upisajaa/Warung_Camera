import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Warung Camera API is running");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
      rating: Number(product.rating),
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data produk",
      error,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email tidak ditemukan",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Password salah",
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error saat login",
      error,
    });
  }
});

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar",
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: "user",
      },
    });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal membuat akun",
      error,
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data user",
      error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});