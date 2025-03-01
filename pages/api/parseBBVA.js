import _ from "lodash";
import authorizeRequest from "./authorizeRequest";

const API_URL = process.env.API_URL;

async function fetchMediaFile(mediaId) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL; // Asegúrate de tener esta variable de entorno configurada
  const MEDIA_COLLECTION = "media"; // Asume que 'media' es la ruta de la colección de archivos en tu Payload CMS
  const response = await fetch(`${CMS_URL}/${MEDIA_COLLECTION}/${mediaId}`, {
    method: "GET",
    headers: {
      Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media details: ${response.statusText}`);
  }

  const mediaDetails = await response.json();
  return mediaDetails;
}

async function convertPdfToBase64(pdfUrl) {
  const response = await fetch(pdfUrl, {
    headers: {
      Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
    },
  });
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return base64;
}

const parseBBVA = async ({ id }) => {
  const file = await fetchMediaFile(id);
  const pdfBase64 = await convertPdfToBase64(file.url); // mediaFileUrl obtenido de fetchMediaFile
  // Luego, envías esta cadena base64 a tu endpoint de pdf2json
  const params = new URLSearchParams();
  params.append("pdfData", pdfBase64); // Usa la cadena base64 aquí
  params.append("password", "72298830D");
  // Añade otros parámetros según sea necesario

  const response = await fetch(`${API_URL}/pdf2json?label=BBVA`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await response.json();
  console.log(file.url, data);
  return data.text;
};

export default async function handler(req, res) {
  try {
    const data = await parseBBVA(req.body); // Usa la función refactorizada.
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
