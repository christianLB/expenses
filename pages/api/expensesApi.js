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
  const start = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate()
    )
  );
  const end = new Date(
    Date.UTC(
      endDate.getUTCFullYear(),
      endDate.getUTCMonth(),
      endDate.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  let query = {
    date: {
      greater_than_equal: start.toISOString(),
    },
    and: [
      {
        date: {
          less_than_equal: end.toISOString(),
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

export const getExpensesByYear = async (year) => {
  // Crear fechas en UTC
  const startDate = new Date(Date.UTC(year, 0, 1)); // Primer día del año indicado en UTC
  const endDate = new Date(Date.UTC(year + 1, 0, 1)); // Primer día del siguiente año en UTC

  const query = buildQuery({ startDate, endDate });
  const queryString = qs.stringify({ where: query });

  const expenses = await getItems(collection, queryString);
  return expenses;
};

export const getIncomeByYear = async (year) => {
  // Crear fechas en UTC
  const startDate = new Date(Date.UTC(year, 0, 1)); // Primer día del año indicado en UTC
  const endDate = new Date(Date.UTC(year + 1, 0, 1)); // Primer día del siguiente año en UTC

  const query = buildQuery({ startDate, endDate });
  const queryString = qs.stringify({ where: query });

  const incomes = await getItems("incomes", queryString);
  return incomes;
};

export const getAvailableYears = async () => {
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

export const expensesByCategoryGroupYearMonth = async ({
  date,
  categoryId,
  groupId,
}) => {
  // Crear fechas en UTC
  const year = new Date(date).getFullYear();
  const month = new Date(date).getUTCMonth();

  const startDate = new Date(Date.UTC(year, month, 0));
  const endDate = new Date(Date.UTC(year, month, 31));

  const query = buildQuery({ startDate, endDate, categoryId, groupId });
  const queryString = qs.stringify({ where: query });

  const expenses = await getItems(collection, queryString);
  console.log(expenses);
  return expenses.docs;
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

        if (req.query.action === "expensesByYear") {
          const year = req.query.year || new Date().getFullYear();
          const expenses = await getExpensesByYear(year);
          return res.status(200).json(expenses);
        }

        if (req.query.action === "getIncomeByYear") {
          const year = req.query.year || new Date().getFullYear();
          const incomes = await getIncomeByYear(year);
          return res.status(200).json(incomes);
        }

        if (req.query.action === "expensesByCategoryGroupYearMonth") {
          const date = req.query.date;
          const groupId = req.query.groupId;
          const categoryId = req.query.categoryId;
          const expenses = await expensesByCategoryGroupYearMonth({
            date,
            groupId,
            categoryId,
          });
          return res.status(200).json(expenses);
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
