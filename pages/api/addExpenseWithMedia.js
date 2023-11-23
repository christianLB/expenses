import { uploadToCMS } from "./uploadToCMS";
import { createExpense } from "./addExpense";
import authorizeRequest from "./authorizeRequest";

export default function handler(req, res) {
  if (req.method === "POST") {
    // await authorizeRequest(req, res);
    uploadToCMS(req, res, async () => {
      try {
        const mediaData = req.fileData;

        const newExpense = {
          amount: 0.0,
          archivo: mediaData.doc.id,
        };

        //const expensesResponse = await createExpense(newExpense);
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