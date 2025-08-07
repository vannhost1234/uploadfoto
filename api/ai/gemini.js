import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyAlbK2NP8qM8vLzfJmtGSFE_z4dLADvYso");

export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({ status: false, error: "Text is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    const response = await result.response;
    return res.json({ status: true, result: response.text() });
  } catch (err) {
    return res.status(500).json({ status: false, error: err.message });
  }
}