import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const port = process.env.PORT || 3000;  // Hanya deklarasi sekali

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(_dirname, "public")));
app.use(express.static('public'));

// Gemini setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).send("tidak ada atau format pesan salah");
  }

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
    });

    console.log(JSON.stringify(result, null, 2));

    // ✅ Perbaikan di sini
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(200).send("Tidak ada respon dari AI");
    }

    res.status(200).send(text);

  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan saat memproses permintaan.");
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
