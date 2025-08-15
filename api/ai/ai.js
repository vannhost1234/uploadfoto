const express = require("express");
const axios = require("axios");
const app = express();

const CREATOR = "VANN HOSTING";

app.use(express.json());

// ===== Helper untuk POST JSON =====
const postJSON = (url, data) => {
  return axios.post(url, data, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000
  });
};

// ===== /ai/luminai =====
app.get("/ai/luminai", async (req, res) => {
  const { text } = req.query;
  if (!text)
    return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await postJSON("https://luminai.my.id/api/chat", { content: text });
    res.json({
      status: true,
      creator: CREATOR,
      result: response.data?.result || "No response from LuminAI"
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/bard =====
app.get("/ai/bard", async (req, res) => {
  const { text } = req.query;
  if (!text)
    return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await axios.get(
      `https://bardai.js.org/api?text=${encodeURIComponent(text)}`,
      { timeout: 15000 }
    );
    res.json({
      status: true,
      creator: CREATOR,
      result: response.data?.result || "No response from BardAI"
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/freegpt =====
app.get("/ai/freegpt", async (req, res) => {
  const { text } = req.query;
  if (!text)
    return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await postJSON("https://chatgpt-clone.fly.dev/api/completion", { message: text });
    res.json({
      status: true,
      creator: CREATOR,
      result: response.data?.reply || "No response from FreeGPT"
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/deepseek =====
app.get("/ai/deepseek", async (req, res) => {
  const { text } = req.query;
  if (!text)
    return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await postJSON("https://deepseek.enzzdev.repl.co/api", { text });
    res.json({
      status: true,
      creator: CREATOR,
      result: response.data?.result || "No response from DeepSeek"
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/hard =====
app.get("/ai/hard", async (req, res) => {
  const { text } = req.query;
  if (!text)
    return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await postJSON("https://hardai.enzzdev.repl.co/api", { text });
    res.json({
      status: true,
      creator: CREATOR,
      result: response.data?.result || "No response from HardAI"
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

}!;