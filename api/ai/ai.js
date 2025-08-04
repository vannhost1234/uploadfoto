const fetch = require("node-fetch");

module.exports = function (app) {
  // ===== KONFIGURASI =====
  const OPENROUTER_KEY = "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";

  // ======= FUNGSI UMUM UNTUK CALL OPENROUTER =======
  async function callOpenRouter(model, text) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: text }]
      })
    });

    const data = await response.json();
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("AI response error: " + (data?.error?.message || "Invalid response"));
    }

    return data.choices[0].message.content.trim();
  }

  // ======= ENDPOINT DEEPSEEK =======
  app.get("/ai/deepseek", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await callOpenRouter("deepseek-ai/deepseek-chat", text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ======= ENDPOINT OPENAI (alias LLaMA) =======
  app.get("/ai/openai", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await callOpenRouter("meta-llama/llama-3-8b-instruct", text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ======= ENDPOINT BLACKBOX (alias Deepseek) =======
  app.get("/ai/blackbox", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await callOpenRouter("deepseek-ai/deepseek-chat", text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });

  // ======= ENDPOINT CLAUDE 4 (Anthropic Claude Sonnet 4) =======
  app.get("/ai/claude", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, error: "Text is required" });

    try {
      const result = await callOpenRouter("anthropic/claude-sonnet-4", text);
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
  
    // ====== LuminAI (luminai.my.id) ======
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
      res.json({ status: true, result });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
};