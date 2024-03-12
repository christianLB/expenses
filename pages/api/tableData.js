import qs from "qs";
import _, { forEach } from "lodash";
import authorizeRequest from "./authorizeRequest";
import { getAvailableYears } from "./expensesApi";

function getGroupTotals(expenses) {
  return expenses.reduce((acc, expense) => {
    // Asegura que expense.amount sea un número antes de sumarlo.
    // Esto es útil si los datos no son consistentes.
    const amount = Number(expense.amount) || 0;
    return acc + amount;
  }, 0); // Inicializa el acumulador como 0.
}

const getTotals = (expenses = []) => {
  return expenses.reduce((acc, expense) => {
    // Crear la fecha directamente desde el string ISO 8601
    const date = new Date(expense.date);
    const monthIndex = date.getUTCMonth(); // Obtiene el mes en UTC
    // Asegurar que expense.amount es un número
    const amount = Number(expense.amount) || 0;

    // Sumar el monto al mes correspondiente y al total anual
    acc[monthIndex] += amount; // Sumar al mes correspondiente
    acc[12] += amount; // Sumar al total anual

    return acc;
  }, Array(13).fill(0));
};

const calculateBalance = (incomeTotals, summaryTotals) => {
  return incomeTotals.map(
    (incomeTotal, index) => incomeTotal - summaryTotals[index]
  );
};

const groupExpensesByCategory = async (
  expenses,
  categories,
  groups,
  clients,
  income
) => {
  const uncategorized = {
    id: "0",
    name: "Uncategorized",
    color: "#da9898",
  };
  const noGroup = { id: "0", name: "No Group" };
  const noClient = { id: "0", name: "No Client" };

  // Esta función ahora agrupará los ingresos por cliente
  const incomeByClient = (income) =>
    _(income)
      .groupBy((inc) => (inc?.client && inc.client.id) || "0")
      .value();

  // Añadir la categoría de ingresos al principio
  const incomeTotals = getTotals(income);
  const incomeCategory = {
    id: "income",
    name: "Income",
    groups: [],
    expenses: income,
    color: "#72afff",
    totals: incomeTotals,
  };

  const expensesByCategory = _(expenses)
    .groupBy((expense) => expense?.category?.id || "0")
    .value();

  const expensesByGroup = (categoryExpenses) =>
    _(categoryExpenses)
      .groupBy((expense) => expense?.group?.id || "0")
      .value();

  // Agrupar ingresos por cliente
  const groupedIncomeByClient = clients
    .concat(noClient)
    .map((client) => {
      const clientIncomes = incomeByClient(income)[client.id] || [];
      const totals = getTotals(clientIncomes);

      if (totals.some((total) => total > 0)) {
        return {
          id: client.id,
          name: client.name || "No Client",
          expenses: clientIncomes,
          totals,
        };
      }
      return null;
    })
    .filter((client) => client !== null); // Eliminar clientes nulos

  const categoryObjects = categories.map((category) => {
    const categoryExpenses = expensesByCategory[category.id] || [];
    const groupedExpensesByGroup = [];
    groups.forEach((group) => {
      const groupExpenses = expensesByGroup(categoryExpenses)[group.id] || [];
      if (groupExpenses.length > 0) {
        groupedExpensesByGroup.push({
          id: group.id,
          name: group.name,
          expenses: [], // groupExpenses,
          totals: getTotals(groupExpenses),
        });
      }
    });

    // Always include 'No Group' even if it has no expenses
    const noGroupExpenses = expensesByGroup(categoryExpenses)["0"] || [];
    if (noGroupExpenses.length > 0)
      groupedExpensesByGroup.push({
        id: "0",
        name: "No Group",
        expenses: [], // noGroupExpenses,
        totals: getTotals(noGroupExpenses),
      });

    return {
      ...category,
      groups: groupedExpensesByGroup,
      totals: getTotals(categoryExpenses),
    };
  });

  // Always include 'Uncategorized' even if it has no expenses
  const uncategorizedExpenses = expensesByCategory["0"] || [];
  const uncategorizedObject = {
    id: "0",
    name: "Uncategorized",
    color: "#da9898",
    groups: [
      {
        id: "0",
        name: "No Group",
        expenses: uncategorizedExpenses,
        totals: getTotals(uncategorizedExpenses),
      },
    ],
    totals: getTotals(uncategorizedExpenses),
  };

  categoryObjects.push(uncategorizedObject);

  // Prepend the incomeCategory to the categoryObjects array
  // Actualizar la categoría de ingresos con la nueva agrupación por cliente
  incomeCategory.groups = groupedIncomeByClient;
  const groupedExpenses = [incomeCategory].concat(categoryObjects);

  // Add summary category
  const summaryTotals = getTotals(expenses);
  const summaryCategory = {
    id: "summary",
    name: "Summary",
    groups: [],
    expenses: [],
    color: "#A2A2A2",
    totals: summaryTotals,
  };
  groupedExpenses.push(summaryCategory);

  // Add balance row
  const balanceTotals = calculateBalance(incomeTotals, summaryTotals);
  const balanceCategory = {
    id: "balance",
    name: "Balance",
    groups: [],
    expenses: [],
    color: "",
    totals: balanceTotals,
  };
  groupedExpenses.push(balanceCategory);
  return {
    expenseCategories: categories,
    expenseGroups: groups,
    categories: groupedExpenses,
    years: await getAvailableYears(),
  };
};

const generateYearlyQuery = (year) => {
  // Comenzar desde el final del día anterior al 1 de enero del año indicado en UTC
  // Esto es para capturar cualquier registro que podría interpretarse como el día anterior
  // debido a la zona horaria. Por ejemplo, para compensar hasta 24 horas, restamos un día (en milisegundos).
  const startDate = new Date(Date.UTC(year, 0, 1) - 24 * 60 * 60 * 1000); // Resta 24 horas para cubrir el día anterior

  // El endDate es el inicio del próximo año, no necesita ajuste adicional
  const endDate = new Date(Date.UTC(year + 1, 0, 1));

  return {
    date: {
      greater_than_equal: startDate.toISOString(),
    },
    and: [
      {
        date: {
          less_than_equal: endDate.toISOString(), // Usamos less_than para excluir el inicio del próximo año
        },
      },
    ],
  };
};

// Esta función puede ser invocada directamente para obtener los datos.
export async function getTableData(req, year) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
  const currentYear = year;
  const query = generateYearlyQuery(currentYear);
  const queryString = qs.stringify({ where: query });
  const headers = {
    Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
  };

  // Tus URLs se mantienen igual...
  const expensesUrl = `${CMS_URL}/expenses?${queryString}&limit=0&sort=date`;
  const groupsUrl = `${CMS_URL}/expense-group?limit=0`;
  const categoriesUrl = `${CMS_URL}/expense-category?limit=0`;
  const clientsUrl = `${CMS_URL}/clients?limit=0`;
  const incomesUrl = `${CMS_URL}/incomes?${queryString}&limit=0&sort=-date`;

  // Tus llamadas fetch se mantienen igual...
  const [expenses, groups, categories, clients, incomes] = await Promise.all([
    fetch(expensesUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(groupsUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(categoriesUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(clientsUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(incomesUrl, { method: "GET", headers }).then((r) => r.json()),
  ]);

  // Agrupa y combina los datos como antes
  const data = await groupExpensesByCategory(
    expenses.docs,
    categories.docs,
    groups.docs,
    clients.docs,
    incomes.docs
  );

  return data;
}

export default async function handler(req, res) {
  try {
    // Esto arrojará un error si la solicitud no está autorizada
    await authorizeRequest(req, res);

    const data = await getTableData(); // Usa la función refactorizada.
    return res.status(200).json({ data });
  } catch (error) {
    // Manejar solicitudes no autorizadas
    res.status(401).json({ error: error.message });
  }
}
