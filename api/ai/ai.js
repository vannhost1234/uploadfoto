const fetch = require("node-fetch");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = function (app) {
  // ===== CONFIG =====
  const OPENROUTER_KEY = "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";
  const GEMINI_KEY = "AIzaSyAlbK2NP8vM8vLzfJmtGSFE_z4dLADvYso";
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  // ====== Deepseek AI ======
  async function DeepseekAI(text) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) throw new Error("Invalid Deepseek response");
    return data.choices[0].message.content.trim();
  }

  app.get("/ai/deepseek", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await DeepseekAI(text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ====== Google Gemini (Gemini 1.5 Flash) ======
  async function GeminiAI(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text();
  }

  app.get("/ai/gemini", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await GeminiAI(text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ====== Meta LLaMA (via OpenRouter) ======
  async function LlamaAI(text) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick:free",
        messages: [{
          role: "user",
          content: [{ type: "text", text }]
        }]
      })
    });

    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) throw new Error("Invalid LLaMA response");
    return data.choices[0].message.content.trim();
  }

  app.get("/ai/openai", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await LlamaAI(text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ====== LuminAI (luminai.my.id) ======
  async function LuminAI(text) {
    const response = await axios.post("https://luminai.my.id/", { content: text });
    return response.data?.result || "No response from LuminAI";
  }

  app.get("/ai/luminai", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await LuminAI(text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ====== Blackbox AI (pakai Deepseek) ======
  async function BlackboxAI(text) {
    return await DeepseekAI(text); // kamu bisa ganti ke LlamaAI atau GeminiAI juga
  }

  app.get("/ai/blackbox", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await BlackboxAI(text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
};