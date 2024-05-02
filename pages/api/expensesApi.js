const FormData = require('form-data');
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch si no estás en un entorno de navegador
import { endOfMonth } from "date-fns";
import { createItem, updateItem, deleteItem, getItem, getItems } from "./cms";
import qs from "qs";
import authorizeRequest from "./authorizeRequest";
import axios from 'axios'


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

export const createWithMedia = async (mediaId, expense = {}) => {
  console.log('creating with media id:', mediaId);
  const newExpense = {
    name: 'nuevo movimiento (doc adjunto)',
    amount: 0.0,
    date: new Date(),
    ...expense,
    category: '65f4427e24a70b002dd8853e',
    group: '65f410b957fd09665b52474a',
    archivos: [
      {
        documento: mediaId,
        enableAPIKey: true,
      },
    ],
  };

  const createResult = await createItem(collection, newExpense); // Asegúrate de que 'collection' sea 'expenses' o la colección correspondiente
  console.log('-----CREATED EXPENSE-----', { doc: createResult.doc.name, mediaId });
  return createResult.doc;
}

export const findByDateAmount = async (date, amount) => {
  const startDate = new Date(date);
  startDate.setUTCHours(0, 0, 0, 0); // Asegurar que la búsqueda comienza al inicio del día

  const endDate = new Date(date);
  endDate.setUTCHours(23, 59, 59, 999); // Asegurar que la búsqueda termina al final del día

  const query = {
    date: {
      greater_than_equal: startDate.toISOString(),
      less_than_equal: endDate.toISOString(),
    },
    and: [
      {
        amount: {
          equals: amount,
        },
      },
    ],
  };

  const queryString = qs.stringify({ where: query });
  const items = await getItems(collection, queryString);
  return items.docs; // Asumiendo que .docs contiene los documentos recuperados
};

export const addMediaToExpense = async (mediaId, { date, totalAmount }) => {
  const expenses = await findByDateAmount(date, totalAmount);

  if (expenses.length > 0) {
    // Toma el primer gasto encontrado
    const expenseToUpdate = expenses[0];
    console.log('Gasto encontrado para actualizar:', expenseToUpdate.name);

    // Preparar solo la actualización del campo 'archivos' añadiendo el nuevo documento
    const updatedArchivos = [
      ...expenseToUpdate.archivos.map(archivo => ({ documento: archivo.documento.id })),
      {
        documento: mediaId,
        enableAPIKey: true,
      },
    ];

    // Objeto de actualización que incluye solo lo que necesitamos actualizar
    const updateData = { archivos: updatedArchivos };

    try {
      // Llama a updateItem para actualizar el gasto con solo el campo 'archivos'
      const updateResult = await updateItem(collection, expenseToUpdate.id, updateData);
      console.log('Gasto actualizado con éxito:', updateResult);
      return updateResult;
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
      throw error;
    }
  } else {
    console.log('No se encontraron gastos para la fecha y monto dados.');
    return null;
  }
};


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
        switch (req.query.action) {
          case "createWithMedia":
            await uploadMedia(req, res, async (doc) => {
              if (doc.id) {
                const newExpense = await createWithMedia(doc.id);
                return res.status(200).json(newExpense);
              }
            });
            break;
          default:
            //  Manejo para la creación de items sin media
            const createResult = await createItem(collection, JSON.parse(req.body));
            return res.status(200).json(createResult);
        }

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
