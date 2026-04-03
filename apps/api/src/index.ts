import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log("Using DATABASE_URL:" + connectionString);

// if (!connectionString) {
//   throw new Error("DATABASE_URL environment variable is not set2.");
// }

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("Using DATABASE_URL:" + connectionString);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get("/clothing-items", async (_req, res) => {
  try {
    const items = await prisma.clothingItem.findMany();

    console.log(items.length + " items found in database");
    res.json(items)
  } catch (error) {
    console.error("GET /clothing-items failed:", error)
    res.status(500).json({ error: "Failed to fetch clothing items" })
  }
})

app.post("/clothing-items", async (req, res) => {
  try {
    const { name, category, colors, brand, image, favorite } = req.body

    if (!name || !category) {
      return res.status(400).json({
        error: "name and category are required",
      })
    }

    const item = await prisma.clothingItem.create({
      data: {
        name: name ?? null,
        image: image ?? null,
        category: category ?? null,
        colors: colors ?? [],
        brand: brand ?? null,
        favorite: favorite ?? false,
      },
    })

    res.status(201).json(item)
  } catch (error) {
    console.error("POST /clothing-items failed:", error)
    res.status(500).json({ error: "Failed to create clothing item" })
  }
})

app.get("/home", async (_req, res) => {
  try {
    const recentItems = await prisma.clothingItem.findMany()

    const totalItems = await prisma.clothingItem.count()
    const favorites = await prisma.clothingItem.count({
      where: { favorite: true },
    })

    res.json({
      todayOutfit: null,
      recentItems,
      quickStats: {
        totalItems,
        favorites,
      },
      quickActions: [
        { id: "add-item", label: "Add item" },
        { id: "create-outfit", label: "Create outfit" },
      ],
    })
  } catch (error) {
    console.error("GET /home failed:", error)
    res.status(500).json({ error: "Failed to fetch home data" })
  }
})