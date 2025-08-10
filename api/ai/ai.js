const express = require("express");
const axios = require("axios");
const app = express();

const CREATOR = "VANN HOSTING";

// helper axios
const http = axios.create({
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

// ===== /ai/luminai =====
app.get("/ai/luminai", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await http.post("https://luminai.my.id/", { content: text });
    res.json({ status: true, creator: CREATOR, result: response.data?.result || "No response from LuminAI" });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/bard =====
app.get("/ai/bard", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await http.get(`https://bardai.js.org/api?text=${encodeURIComponent(text)}`);
    res.json({ status: true, creator: CREATOR, result: response.data?.result || "No response from BardAI" });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/freegpt =====
app.get("/ai/freegpt", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await http.post("https://chatgpt-clone.fly.dev/api/completion", { message: text });
    res.json({ status: true, creator: CREATOR, result: response.data?.reply || "No response from FreeGPT" });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/deepseek =====
app.get("/ai/deepseek", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await http.post("https://deepseek.enzzdev.repl.co/api", { text });
    res.json({ status: true, creator: CREATOR, result: response.data?.result || "No response from DeepSeek" });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

// ===== /ai/hard =====
app.get("/ai/hard", async (req, res) => {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, creator: CREATOR, error: "Text is required" });

  try {
    const response = await http.post("https://hardai.enzzdev.repl.co/api", { text });
    res.json({ status: true, creator: CREATOR, result: response.data?.result || "No response from HardAI" });
  } catch (err) {
    res.status(500).json({ status: false, creator: CREATOR, error: err.message });
  }
});

module.exports = app;