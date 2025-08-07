import axios from "axios";

export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, error: "Text is required" });

  try {
    const response = await axios.post("https://chatgpt-clone.fly.dev/api/completion", { message: text });
    return res.json({ status: true, result: response.data?.reply || "No response from FreeGPT" });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
}