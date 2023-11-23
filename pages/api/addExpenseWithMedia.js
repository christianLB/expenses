import { uploadToCMS } from "./uploadToCMS";
import { createExpense } from "./addExpense";
import authorizeRequest from "./authorizeRequest";

export default function handler(req, res) {
  if (req.method === "POST") {
    // await authorizeRequest(req, res);
    uploadToCMS(req, res, async () => {
      try {
        const mediaData = req.fileData;
        //console.log(mediaData)
        const newExpense = {
          name: 'nuevo movimiento (doc adjunto)',
          amount: 0.0,
          date: new Date(),
          archivos: [
            {
              id: mediaData.doc.id, // Asegúrate de que el campo 'id' se asocie con un objeto
              // Puede que necesites incluir más datos aquí, dependiendo de tu esquema de Expenses
            }
          ],
        };

        const expensesResponse = await createExpense(newExpense);
        //console.log('expensesResponse', expensesResponse)
        res.status(200).json(expensesResponse.data);
      } catch (error) {
        res.status(500).json({
          error: error.message || "An error occurred during the operation.",
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};