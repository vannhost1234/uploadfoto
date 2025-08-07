import axios from "axios";

export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, error: "Text is required" });

  try {
    const response = await axios.get(`https://bardai.js.org/api?text=${encodeURIComponent(text)}`);
    return res.json({ status: true, result: response.data?.result || "No response from BardAI" });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
}