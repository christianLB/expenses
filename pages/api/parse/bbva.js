import { parseBBVA } from "../../../lib/parsers";

export default function handler(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text" });

    const data = parseBBVA(text);
    res.status(200).json(data);
  } catch (err) {
    console.error("parseBBVA error:", err);
    res.status(500).json({ error: err.message });
  }
}
