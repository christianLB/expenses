const fetch = require("node-fetch");
const axios = require("axios");

/**
 * Convierte una imagen o un archivo de una URL a una cadena en formato base64.
 *
 * @param {string} url URL del archivo a convertir.
 * @returns {Promise<string>} Una promesa que se resuelve con el archivo en formato base64.
 */
async function convertUrlToBase64(url) {
  try {
    console.log("Fetching URL:", url);
    const response = await fetch(url);
    console.log("Response received");
    const buffer = await response.buffer();
    console.log("Buffer created");
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw new Error(
      `Error al obtener o convertir el archivo: ${error.message}`
    );
  }
}

/**
 * Envía una cadena en formato base64 a un modelo personalizado de GPT de OpenAI y obtiene la respuesta.
 *
 * @param {string} imageBase64 La imagen en formato base64.
 * @returns {Promise<object>} Una promesa que se resuelve con la respuesta del modelo.
 */
async function fetchResponseFromCustomGPTWithImage(imageBase64) {
  console.log("Sending image to OpenAI model");

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const CUSTOM_MODEL_NAME = "tu-modelo-personalizado"; // Reemplaza con el nombre de tu modelo

  const response = await axios.post(
    `https://api.openai.com/v1/engines/${CUSTOM_MODEL_NAME}/completions`,
    {
      prompt: imageBase64,
      max_tokens: 100, // Ajusta según tus necesidades
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Response received from OpenAI");

  return response.data;
}

import { authorizeRequest } from "./authorizeRequest";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await authorizeRequest(req);

      console.log("Received POST request");

      const { imageUrl } = req.body;

      console.log("Converting image URL to base64...");
      const imageBase64 = await convertUrlToBase64(imageUrl);

      console.log("Fetching response from OpenAI...");
      const data = await fetchResponseFromCustomGPTWithImage(imageBase64);

      console.log("Sending response");
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error handling request:", error);
      res
        .status(500)
        .json({ message: "Error al procesar la solicitud", error });
    }
  } else {
    console.log("Method not allowed, sending 405 response");
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
