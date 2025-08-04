const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = function (app) {
  const CREATOR = "VANN HOSTING";

  // ====== BANTUAN ROUTE MAKER ======
  const createAiEndpoint = (route, handlerFn) => {
    app.get(`/ai/${route}`, async (req, res) => {
      const { text } = req.query;
      if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

      try {
        const result = await handlerFn(text);
        res.json({ status: true, creator: CREATOR, result });
      } catch (err) {
        res.status(500).json({ status: false, creator: CREATOR, error: err.message });
      }
    });
  };

  // ====== 1. LuminAI (gratis) ======
  async function LuminAI(text) {
    const res = await axios.post("https://luminai.my.id/", { content: text });
    return res.data?.result || "No response from LuminAI";
  }
  createAiEndpoint("luminai", LuminAI);

  // ====== 2. BardAI (gratis) ======
  async function BardAI(text) {
    const res = await axios.get(`https://bardai.js.org/api?text=${encodeURIComponent(text)}`);
    return res.data?.result || "No response from BardAI";
  }
  createAiEndpoint("bard", BardAI);

  // ====== 3. FreeGPT (chatgpt-clone.fly.dev) ======
  async function FreeGPT(text) {
    const res = await axios.post("https://chatgpt-clone.fly.dev/api/completion", { message: text });
    return res.data?.reply || "No response from FreeGPT";
  }
  createAiEndpoint("freegpt", FreeGPT);

  // ====== 4. Gemini (GoogleGenerativeAI) ======
  const genAI = new GoogleGenerativeAI("AIzaSyAlbK2NP8qM8vLzfJmtGSFE_z4dLADvYso"); // Pastikan key masih aktif

  async function GeminiAI(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    const response = await result.response;
    return response.text();
  }
  createAiEndpoint("gemini", GeminiAI);
};