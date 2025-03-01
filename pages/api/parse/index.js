// pages/api/parse/index.js
import { removePasswordFromPdf, extractTextWithStirling } from "../../../services/pdfServiceStirling";
import { parseBBVA, extractDateAndTotalAmount, parseBBVAMonthlyReport } from "../../../lib/parsers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  try {
    const { pdfData, password } = req.body || {};
    // Get document type from query parameter; default is "RAW"
    const documentType = (req.query.type || "RAW").toUpperCase();

    if (!pdfData) {
      return res.status(400).json({ error: "pdfData is missing" });
    }

    // Convert base64 string to Buffer
    const buffer = Buffer.from(pdfData, "base64");
    console.log("[Index] Original buffer size:", buffer.length);

    // If a password is provided, remove protection from the PDF
    let pdfBuffer = buffer;
    if (password && password.trim()) {
      console.log("[Index] Protected PDF detected. Removing password...");
      pdfBuffer = await removePasswordFromPdf(buffer, password.trim());
      console.log("[Index] Password removed. New buffer size:", pdfBuffer.length);
    }

    // Extract raw text using the StirlingPDF service
    const { text: extractedText } = await extractTextWithStirling(pdfBuffer);
    console.log("[Index] Extracted text (first 100 chars):", extractedText.substring(0, 100) + "...");

    // If document type is RAW, return the extracted text as-is.
    // Otherwise, post-process the text with the corresponding parser.
    let result;
    if (documentType === "RAW") {
      result = { text: extractedText };
    } else if (documentType === "BBVA") {
      result = parseBBVA(extractedText);
    } else if (documentType === "MERCADONGA") {
      result = extractDateAndTotalAmount(extractedText);
    } else if (documentType === "BBVA_MONTHLY") {
      result = parseBBVAMonthlyReport(extractedText);
    }
    else {
      result = { text: extractedText };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("[Index Parser Error]:", error);
    return res.status(500).json({ error: error.message });
  }
}
