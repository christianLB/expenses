// import { ChatGPTAPI } from 'chatgpt';

export async function chatGptVision(imageUrl, prompt) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY; // Asegúrate de tener la clave API de OpenAI configurada en tus variables de entorno

    const api = new ChatGPTAPI({
      apiKey: openaiApiKey,
      completionParams: {
        model: "gpt-4-vision-preview", // Asegúrate de que este modelo soporte vision
        temperature: 0.5,
        top_p: 0.8,
        prompt: `${prompt}\nImage: ${imageUrl}`, // Combina el prompt y la URL de la imagen
      },
    });

    const response = await api.getCompletion();
    return response.data.choices[0].text; // Devuelve la respuesta generada por la API
  } catch (error) {
    console.error("Error en chatGptVision:", error);
    throw error; // Puedes manejar el error según tus necesidades
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { imageUrl, prompt } = req.body;
      const response = await chatGptVision(imageUrl, prompt);
      res.status(200).json({ response });
    } catch (error) {
      console.error("Error en ChatGPT Vision API:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
