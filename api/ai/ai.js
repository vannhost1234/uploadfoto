const fetch = require("node-fetch");
const axios = require("axios");

module.exports = function (app) {
  // ===== KONFIGURASI =====
  const OPENROUTER_KEY = "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"; // Pastikan key aktif

  // ===== FUNGSI UMUM OPENROUTER =====
  async function callOpenRouter(model, text) {
    if (!OPENROUTER_KEY) throw new Error("Missing OpenRouter API Key");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": "https://yourdomain.com", // opsional tapi kadang diperlukan
        "X-Title": "Vann Hosting AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: text }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Unknown API Error");
    }

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("AI response error: No valid content");
    }

    return data.choices[0].message.content.trim();
  }

  // ======= HELPER ENDPOINT FUNCTION =======
  function aiEndpoint(route, model) {
    app.get(route, async (req, res) => {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, error: "Text is required" });

      try {
        const result = await callOpenRouter(model, text);
        res.json({ status: true, creator: "VANN HOSTING", result });
      } catch (err) {
        res.status(500).json({ status: false, creator: "VANN HOSTING", error: err.message });
      }
    });
  }

  // ======= OPENROUTER MODEL ENDPOINTS =======
  aiEndpoint("/ai/deepseek", "deepseek-ai/deepseek-chat");
  aiEndpoint("/ai/openai", "meta-llama/llama-3-8b-instruct");
  aiEndpoint("/ai/blackbox", "deepseek-ai/deepseek-chat");
  aiEndpoint("/ai/claude", "anthropic/claude-sonnet-4");

  // ======= LUMINAI =======
  async function LuminAI(text) {
    try {
      const response = await axios.post("https://luminai.my.id/", { content: text });
      return response.data?.result || "No response from LuminAI";
    } catch (err) {
      throw new Error("LuminAI error: " + err.message);
    }
  }

  app.get("/ai/luminai", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await LuminAI(text);
      res.json({ status: true, creator: "VANN HOSTING", result });
    } catch (err) {
      res.status(500).json({ status: false, creator: "VANN HOSTING", error: err.message });
    }
  });
};