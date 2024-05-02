import PDFParser from "pdf2json";

export default async function handler(req, res) {
  try {
    const { label } = req.query;
    const { pdfData, password } = req.body;
    const buffer = Buffer.from(pdfData, "base64");

    const pdfParser = new PDFParser();

    const pdfParsingPromise = new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => {
        console.error("Error parsing PDF:", err);
        reject(new Error("Error parsing PDF"));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = extractTextFromPdfData(pdfData, label);

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

function extractTextFromPdfData(pdfJson, label) {
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

  switch (label) {
    case 'BBVA':
      return parseBBVA(text);
    case 'Mercadonga':
      return extractDateAndTotalAmount(text);
  }
}

function parseBBVA(text) {
  // Parsing for the first debit movements.
  let descriptionMatch = text.match(/Descripción (.*?) Importe/);
  let amountMatch = text.match(/Importe (.*?) Divisa/);
  let currencyMatch = text.match(/Divisa (.*?) Fecha del movimiento/);
  let dateMatch = text.match(/Fecha del movimiento (.*?) Fecha valor/);
  let valueDateMatch = text.match(/Fecha valor (.*?) Cuenta cargo\/abono/);
  let accountMatch = text.match(
    /Cuenta cargo\/abono (.*?) Titular de la cuenta/
  );
  let observationsMatch = text.match(
    /Observaciones (.*?) BANCO BILBAO VIZCAYA ARGENTARIA/
  );

  // If the first type of parsing didn't match, try the second type: transfers.
  if (
    !descriptionMatch ||
    !amountMatch ||
    !currencyMatch ||
    !dateMatch ||
    !valueDateMatch ||
    !accountMatch
  ) {
    descriptionMatch = text.match(
      /Justificante de la operación (.*?) Fecha de la operación/
    );
    dateMatch = text.match(/Fecha de la operación (.*?) Tipo de transferencia/);
    amountMatch = text.match(/Importe (.*?) € Comisión/);
    currencyMatch = text.match(/Importe .*? (.*?) € Comisión/);
    valueDateMatch = text.match(
      /Fecha de abono al beneficiario (.*?) Ordenante/
    );
    accountMatch = text.match(
      /Cuenta destino \(beneficiario\) (.*?) Fecha de abono al beneficiario/
    );
    observationsMatch = text.match(/Concepto (.*?) Referencia BBVA/);
  }

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

function extractDateAndTotalAmount(text) {
  // Buscar la fecha en el formato dd/mm/yyyy.
  const dateRegex = /\d{2}\/\d{2}\/\d{4}/;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? dateMatch[0] : null;

  // Buscar el importe total, buscando la palabra "TOTAL" seguida de una cantidad numérica.
  const totalAmountRegex = /TOTAL \(€\)\s+(\d+,\d{2})/;
  const totalAmountMatch = text.match(totalAmountRegex);
  const totalAmount = totalAmountMatch ? parseFloat(totalAmountMatch[1].replace(',', '.')) : null;

  return { date, totalAmount };
}

export const formatDate = (date) => {
  const dateString = `${date}/${new Date().getFullYear()}`;
  const [day, month, year] = dateString.split("/");
  const dateObject = new Date(`${year}-${month}-${day}`);
  return dateObject;
};
