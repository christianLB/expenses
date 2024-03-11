// // New endpoint at /api/parsePdf
// import pdfParse from "pdf-parse";
// import { exec } from "child_process";
// import { promisify } from "util";
// import qpdf from "qpdf";
// import fs from "fs";

// const execAsync = promisify(exec);

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { pdfData, password } = req.body; // Assume that the PDF data and password are in the body of the POST request
//     //console.log("pdfData", pdfData, "password", password);
//     try {
//       const pdfText = await extractTextFromPdf(pdfData, password);
//       res.status(200).send({ text: pdfText });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send("An error occurred while parsing the PDF");
//     }
//   } else {
//     res.status(405).send("Method not allowed");
//   }
// }

// async function extractTextFromPdf(pdfData, password) {
//   try {
//     // Write the PDF data to a temporary file
//     const tempInputPath = "/tmp/input.pdf";
//     fs.writeFileSync(tempInputPath, pdfData);

//     // Try to extract the text without decrypting the PDF
//     let data;
//     try {
//       data = await pdfParse(pdfData);
//     } catch (err) {
//       // If that fails, try to decrypt the PDF
//       const tempOutputPath = "/tmp/output.pdf";
//       const qpdfCommand = `qpdf --password=${password} --decrypt ${tempInputPath} ${tempOutputPath}`;
//       await execAsync(qpdfCommand);

//       // Read the decrypted PDF file
//       const decryptedPdfData = fs.readFileSync(tempOutputPath);

//       // Try to extract the text again
//       try {
//         data = await pdfParse(decryptedPdfData);
//       } catch (err) {
//         throw new Error(
//           "Error extracting text from decrypted PDF: " + err.message
//         );
//       }
//     }

//     return data.text;
//   } catch (err) {
//     throw new Error("Error extracting text from PDF: " + err.message);
//   }
// }
