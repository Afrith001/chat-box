import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3002;

// needed for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// serve page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// chat API
app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: userMsg
    });

    res.json({ reply: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error" });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT} - server.js:49`);
});
