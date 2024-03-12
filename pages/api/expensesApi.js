import { createItem, updateItem, deleteItem, getItem, getItems } from "./cms";
import qs from "qs";
import authorizeRequest from "./authorizeRequest";

const collection = "expenses";

const buildQuery = ({
  groupId,
  categoryId,
  startDate = new Date(),
  endDate = new Date(),
}) => {
  const start = new Date(startDate); // Resta 24 horas para cubrir el día anterior
  const end = new Date(endDate);

  let query = {
    date: {
      greater_than_equal: start.toISOString(),
    },
    and: [
      {
        date: {
          less_than_equal: end.toISOString(), // Usamos less_than para excluir el inicio del próximo año
        },
      },
    ],
  };

  // Añadir condiciones de filtro solo si los valores están definidos
  if (groupId) {
    query["group"] = {
      equals: groupId,
    };
  }
  if (categoryId) {
    query["category"] = {
      equals: categoryId,
    };
  }

  return query;
};

export const getAvailableYears = async () => {
  // const startQuery = qs.stringify({ where: {} });
  // const endQuery = qs.stringify({ where: {}, sort: "-date", limit: 1 });
  const [startExpense, endExpense] = await Promise.all([
    getItems(collection, "", 1, "date"),
    getItems(collection, "", 1, "-date"),
  ]);
  // Asegúrate de que ambos extremos tienen datos antes de proceder
  if (startExpense.docs.length && endExpense.docs.length) {
    const startYear = new Date(startExpense.docs[0].date).getFullYear();
    const endYear = new Date(endExpense.docs[0].date).getFullYear();
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );

    return years;
  }

  return [];
};

export default async function handler(req, res) {
  try {
    //await authorizeRequest(req);

    switch (req.method) {
      case "GET":
        if (req.query.action === "availableYears") {
          const years = await getAvailableYears();
          return res.status(200).json(years);
        }

        const expenseId = req.query.id;
        if (expenseId) {
          const expense = await getItem(collection, expenseId);
          return res.status(200).json(expense);
        }
        const groupId = req.query.groupId;
        const categoryId = req.query.categoryId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const query = buildQuery({ groupId, categoryId, startDate, endDate });
        const queryString = qs.stringify({ where: query });
        const expenses = await getItems(collection, queryString);
        return res.status(200).json(expenses.docs);

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
    console.error(error); // Log completo para el desarrollador
    // Decide si quieres devolver el mensaje de error completo o uno genérico
    res
      .status(error.status || 500)
      .json({ error: error.message || "An internal server error occurred" });
  }
}
