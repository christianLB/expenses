import PDFParser from "pdf2json";

export default async function handler(req, res) {
  try {
    const { pdfData, password } = req.body;
    if (!pdfData) return res.status(400).json({ error: "pdfData missing" });

    const buffer = Buffer.from(pdfData, "base64");
    const pdfParser = new PDFParser();

    // Parse con o sin contraseña
    if (password?.trim()) {
      pdfParser.parseBuffer(buffer, password.trim());
    } else {
      pdfParser.parseBuffer(buffer);
    }

    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => {
        const errorDetail = err.parserError || err.message || err.toString();
        reject(new Error(errorDetail));
      });
      pdfParser.on("pdfParser_dataReady", (pdfJson) => {
        let extracted = "";
        for (const page of pdfJson.Pages) {
          for (const textElement of page.Texts) {
            for (const run of textElement.R) {
              extracted += decodeURIComponent(run.T);
            }
            extracted += " ";
          }
          extracted += "\n";
        }
        resolve(extracted);
      });
    });

    res.status(200).json({ text });
  } catch (err) {
    console.error("pdf2json error:", err);
    res.status(500).json({ error: err.message });
  }
}
