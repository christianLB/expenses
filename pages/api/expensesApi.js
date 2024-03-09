import { createItem, updateItem, deleteItem } from "./cms";
import authorizeRequest from "./authorizeRequest";

const collection = "expenses";

export default async function handler(req, res) {
  try {
    //await authorizeRequest(req);

    try {
      switch (req.method) {
        case "POST":
          const itemToCreate = req.body;
          const createResult = await createItem(collection, itemToCreate);
          return res.status(200).json(createResult);

        case "PATCH":
          const { id, ...itemToUpdate } = req.body;
          const updateResult = await updateItem(collection, id, itemToUpdate);
          return res.status(200).json(updateResult);

        case "DELETE":
          const itemIdToDelete = req.query.id;
          if (!itemIdToDelete) {
            return res
              .status(400)
              .json({ error: "Item ID query parameter is missing for delete" });
          }
          const deleteResult = await deleteItem(collection, itemIdToDelete);
          return res.status(200).json(deleteResult);

        default:
          res.setHeader("Allow", ["POST", "PATCH", "DELETE"]);
          return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error); // Log completo para el desarrollador
    // Decide si quieres devolver el mensaje de error completo o uno genérico
    res
      .status(error.status || 500)
      .json({ error: error.message || "An internal server error occurred" });
  }
}
