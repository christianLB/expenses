import authorizeRequest from "./authorizeRequest";
import { uploadToCMS } from "./uploadMedia"; // Asegúrate de que esta ruta es correcta
import { createExpense } from "./addExpense";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await authorizeRequest(req);
      res.status(200).json({ data: "todo ok" });
      return;
      const mediaData = await uploadToCMS(req.file);
      const newExpense = {
        amount: 0.0,
        archivo: mediaData.doc.id,
      };

      const expensesResponse = createExpense(newExpense);
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
