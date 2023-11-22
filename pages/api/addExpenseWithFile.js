import axios from "axios";

export default async function handler(req, res) {
  res.status(200).end(`todo ok`);
  return;
  if (req.method === "POST") {
    try {
      // Paso 1: Subir el archivo utilizando el endpoint `uploadMedia`
      const mediaResponse = await axios.post("/uploadMedia", req, {
        headers: {
          ...req.headers,
        },
      });

      if (mediaResponse.status !== 200) {
        return res.status(mediaResponse.status).json(mediaResponse.data);
      }

      const mediaId = mediaResponse.doc.id; // Asume que la respuesta incluye un `id` para el archivo

      // Paso 2: Crear un registro en la colección `Expenses`
      // Debes reemplazar esto con tu lógica y estructura de datos real
      const expenseData = {
        amount: 0.0,
        archivos: [mediaId], // El nombre de este campo debe coincidir con tu esquema de colección de `Expenses`
      };

      const expensesResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_CMS_API_URL}/expenses`,
        expenseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `users ${process.env.PAYLOAD_ADMIN_API_KEY}`,
          },
        }
      );

      // Envía la respuesta final al cliente
      res.status(200).json(expensesResponse.data);
    } catch (error) {
      res.status(500).json({
        error:
          error.response?.data ||
          error.message ||
          "An error occurred during the operation.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
