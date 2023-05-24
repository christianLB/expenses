import PDFParser from "pdf2json";

export default async function handler(req, res) {
  try {
    const { pdfData, password } = req.body;
    const buffer = Buffer.from(pdfData, "base64");

    const pdfParser = new PDFParser();

    const pdfParsingPromise = new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => {
        console.error("Error parsing PDF:", err);
        reject(new Error("Error parsing PDF"));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = extractTextFromPdfData(pdfData);
        resolve(text);
      });
    });

    pdfParser.parseBuffer(buffer);

    const text = await pdfParsingPromise;
    res.status(200).send({ text });
  } catch (err) {
    console.error("Error in /api/pdf2json:", err);
    res.status(500).send({ error: "Error in /api/pdf2json" });
  }
}

function extractTextFromPdfData(pdfJson) {
  let text = "";

  for (let page of pdfJson.Pages) {
    for (let textElement of page.Texts) {
      for (let run of textElement.R) {
        text += decodeURIComponent(run.T);
      }
      text += " ";
    }
    text += "\n";
  }

  return parseText(text);
}

function parseText(text) {
  const descriptionMatch = text.match(/Descripción (.*?) Importe/);
  const amountMatch = text.match(/Importe (.*?) Divisa/);
  const currencyMatch = text.match(/Divisa (.*?) Fecha del movimiento/);
  const dateMatch = text.match(/Fecha del movimiento (.*?) Fecha valor/);
  const valueDateMatch = text.match(/Fecha valor (.*?) Cuenta cargo\/abono/);
  const accountMatch = text.match(
    /Cuenta cargo\/abono (.*?) Titular de la cuenta/
  );
  const observationsMatch = text.match(
    /Observaciones (.*?) BANCO BILBAO VIZCAYA ARGENTARIA/
  );

  const name = (
    descriptionMatch
      ? descriptionMatch[1] + (observationsMatch ? observationsMatch[1] : "")
      : ""
  ).replace(/\s+/g, " ");
  const amount = amountMatch
    ? Math.abs(parseFloat(amountMatch[1].replace(".", "").replace(",", ".")))
    : null;
  const date = dateMatch ? formatDate(dateMatch[1]) : "";
  const account = accountMatch ? accountMatch[1] : "";
  const valueDate = valueDateMatch ? formatDate(valueDateMatch[1]) : "";
  const currency = currencyMatch ? currencyMatch[1] : "";

  return {
    name,
    amount,
    date,
    account,
    valueDate,
    currency,
  };
}

export const formatDate = (date) => {
  const dateString = `${date}/${new Date().getFullYear()}`;
  const [day, month, year] = dateString.split("/");
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
};
