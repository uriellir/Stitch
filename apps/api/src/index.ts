import axios from "axios";
import "dotenv/config";
import express from 'express';
import cors from 'cors';
// import { PrismaClient } from "../generated/prisma/client";
import { PrismaClient } from "../generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
// import { filterCandidates } from "./filterCandidates";
import { filterCandidates } from "./filterCandidates.js";

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

app.delete("/clothing-items/:id", async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    if (!itemId) {
      return res.status(400).json({ error: "Invalid item id" });
    }
    await prisma.clothingItem.delete({ where: { id: itemId } });
    res.status(204).send();
  } catch (error) {
    console.error("DELETE /clothing-items/:id failed:", error);
    res.status(500).json({ error: "Failed to delete clothing item" });
  }
});

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

// Get all collections
app.get("/collections", async (_req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { items: true },
    });
    res.json(collections);
  } catch (error) {
    console.error("GET /collections failed:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

// Create a new collection
app.post("/collections", async (req, res) => {
  try {
    const { name, description, color, itemIds } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        color,
        items: itemIds && itemIds.length > 0 ? {
          connect: itemIds.map((id: number) => ({ id }))
        } : undefined,
      },
      include: { items: true },
    });
    res.status(201).json(collection);
  } catch (error) {
    console.error("POST /collections failed:", error);
    res.status(500).json({ error: "Failed to create collection" });
  }
})

// Update a collection's items
app.put("/collections/:id", async (req, res) => {
  try {
    const collectionId = Number(req.params.id);
    const { name, description, color, itemIds } = req.body;
    if (!collectionId || !Array.isArray(itemIds)) {
      return res.status(400).json({ error: "Collection id and itemIds are required" });
    }
    const updated = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        name,
        description,
        color,
        items: {
          set: itemIds.map((id) => ({ id })),
        },
      },
      include: { items: true },
    });
    res.json(updated);
  } catch (error) {
    console.error("PUT /collections/:id failed:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// Weather endpoint
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Weather API key not set" });
  }
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(String(city))}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch weather");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("GET /weather failed:", error);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

// Suggest outfit endpoint (MVP)
app.post("/suggest-outfit", async (req, res) => {
  try {
    // 1. Get all wardrobe items from DB
    const items = await prisma.clothingItem.findMany();

    // 2. Build context from request body (weather, occasion, avoidColors)
    const context = req.body.context || {};

    // 3. Filter valid candidates using service
    const candidates = filterCandidates(items, context);

    // 4. If no candidates, return early to avoid unnecessary OpenAI API calls
    if (!candidates || candidates.length === 0) {
      return res.status(200).json({ items: [], explanation: "No suitable clothing items found for the given context." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OpenAI API key not set" });

    const systemPrompt = `
      You are a fashion assistant. 
      Given a list of clothing items, select the best outfit for today. 
      Rules:
      - Select only from the given item IDs.
      - Respect weather, occasion, and color preferences in the context.
      - Prefer visually coherent color combinations.
      - Do not select duplicate items.
      - Outerwear is optional.
      - Return the most wearable real-life outfit, not a creative costume.
      Return a JSON object with an array of item IDs and a short explanation. Schema: { "itemIds": number[], "explanation": string }
      
      User Context:
      ${JSON.stringify(context,null, 2)}`;

    const userPrompt = `Candidate clothing items: ${JSON.stringify(candidates, null, 2)}`;
    console.log("System Prompt:", systemPrompt);
    console.log("User Prompt:", userPrompt);
    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    // 5. Validate and type result
    type OpenAIOutfitResult = {
      itemIds: number[];
      explanation: string;
    };
    let result: OpenAIOutfitResult;
    try {
      const parsed = JSON.parse(openaiRes.data.choices[0].message.content);
      if (!Array.isArray(parsed.itemIds) || typeof parsed.explanation !== "string") {
        throw new Error("Invalid schema");
      }
      result = parsed as OpenAIOutfitResult;
    } catch (e) {
      return res.status(500).json({ error: "Invalid OpenAI response" });
    }

    // 6. Return outfit + explanation
    const outfitItems = items.filter(i => result.itemIds.includes(i.id));
    res.json({ items: outfitItems, explanation: result.explanation });
  } catch (error) {
    console.error("POST /suggest-outfit failed:", error);
    res.status(500).json({ error: "Failed to suggest outfit" });
  }
});