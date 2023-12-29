const fetch = require('node-fetch');
const axios = require('axios');

/**
 * Convierte una imagen o un archivo de una URL a una cadena en formato base64.
 *
 * @param {string} url URL del archivo a convertir.
 * @returns {Promise<string>} Una promesa que se resuelve con el archivo en formato base64.
 */
async function convertUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return buffer.toString('base64');
  } catch (error) {
    throw new Error(`Error al obtener o convertir el archivo: ${error.message}`);
  }
}

/**
 * Envía una cadena en formato base64 a un modelo personalizado de GPT de OpenAI y obtiene la respuesta.
 *
 * @param {string} imageBase64 La imagen en formato base64.
 * @returns {Promise<object>} Una promesa que se resuelve con la respuesta del modelo.
 */
async function fetchResponseFromCustomGPTWithImage(imageBase64) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const CUSTOM_MODEL_NAME = 'tu-modelo-personalizado'; // Reemplaza con el nombre de tu modelo

  const response = await axios.post(
    `https://api.openai.com/v1/engines/${CUSTOM_MODEL_NAME}/completions`,
    {
      prompt: imageBase64,
      max_tokens: 100, // Ajusta según tus necesidades
    },
    {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { imageUrl } = req.body;

      const imageBase64 = await convertUrlToBase64(imageUrl);
      const data = await fetchResponseFromCustomGPTWithImage(imageBase64);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la solicitud', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
