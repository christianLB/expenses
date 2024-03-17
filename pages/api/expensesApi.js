import { endOfMonth } from "date-fns";
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
  let query = {
    date: {
      greater_than_equal: startDate.toISOString(),
    },
    and: [
      {
        date: {
          less_than_equal: endDate.toISOString(),
        },
      },
    ],
  };

  // Añadir condiciones de filtro solo si los valores están definidos
  if (groupId) {
    if (groupId == "0") {
      query.and.push({ group: { exists: false } });
    } else {
      query.and.push({ group: { equals: groupId } });
    }
  }
  if (categoryId) {
    query["category"] = {
      equals: categoryId,
    };
  }

  return query;
};

const getYearRange = (year) => {
  const startDate = new Date(Date.UTC(year, 0, 1)); // Primer día del año en UTC
  const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // Último momento del último día del año en UTC
  return { startDate, endDate };
};

export const getExpensesByYear = async (year) => {
  try {
    const { startDate, endDate } = getYearRange(year);

    const query = buildQuery({ startDate, endDate });

    const queryString = qs.stringify({ where: query });
    const expenses = await getItems(collection, queryString);

    return expenses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getIncomeByYear = async (year) => {
  const { startDate, endDate } = getYearRange(year);

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

  const inputDate = new Date(date);
  const year = inputDate.getUTCFullYear();
  const month = inputDate.getUTCMonth();

  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = endOfMonth(startDate);

  const query = buildQuery({ startDate, endDate, categoryId, groupId });
  const queryString = qs.stringify({ where: query });

  const expenses = await getItems(collection, queryString, 0, "-date");
  console.log({ date, year, month, startDate, endDate, queryString });
  return expenses.docs;
};
// export const expensesByCategoryGroupYearMonth = async ({
//   date,
//   categoryId,
//   groupId,
// }) => {
//   // Crear fechas en UTC
//   let query = {
//     date: {
//       greater_than_equal: startDate.toISOString(),
//     },
//     and: [
//       {
//         date: {
//           less_than_equal: endDate.toISOString(),
//         },
//       },
//     ],
//   };

//   const inputDate = new Date(date);
//   const year = inputDate.getUTCFullYear();
//   const month = inputDate.getUTCMonth();

//   const startDate = new Date(Date.UTC(year, 0, 1));
//   const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 999));

//   const queryString = qs.stringify({ where: query });

//   const expenses = await getItems(collection, queryString, 0, "-date");
//   console.log({ date, year, month, startDate, endDate, queryString });
//   return expenses.docs;
// };

export default async function handler(req, res) {
  try {
    //await authorizeRequest(req);

    switch (req.method) {
      case "GET":
        switch (req.query.action) {
          case "availableYears":
            const years = await getAvailableYears();
            return res.status(200).json(years);
          case "expensesByYear":
            const yearExpenses = req.query.year || new Date().getFullYear();
            console.log("hola", yearExpenses);
            const expenses = await getExpensesByYear(yearExpenses);
            return res.status(200).json(expenses);
          case "getIncomeByYear":
            const yearIncome = req.query.year || new Date().getFullYear();
            const incomes = await getIncomeByYear(yearIncome);
            return res.status(200).json(incomes);
          case "expensesByCategoryGroupYearMonth":
            const { date, groupId, categoryId } = req.query;
            const expensesByGroup = await expensesByCategoryGroupYearMonth({
              date,
              groupId,
              categoryId,
            });
            return res.status(200).json(expensesByGroup);
          default:
            // Manejo de la lógica cuando no hay una acción específica o para recuperar un ítem específico
            const expenseId = req.query.id;
            if (expenseId) {
              const expense = await getItem(collection, expenseId);
              return res.status(200).json(expense);
            }
            // Si no se solicita un ítem específico, se devuelve una lista de ítems basada en otros parámetros de consulta
            const generalQuery = buildQuery({
              groupId: req.query.groupId,
              categoryId: req.query.categoryId,
              startDate: req.query.startDate,
              endDate: req.query.endDate,
            });
            const queryString = qs.stringify({ where: generalQuery });
            const expensesList = await getItems(collection, queryString);
            return res.status(200).json(expensesList.docs);
        }
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
