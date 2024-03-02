import qs from "qs";
import _ from "lodash";
import authorizeRequest from "./authorizeRequest";

const getTotals = (expenses = []) => {
  return expenses?.reduce((acc, expense) => {
    const month = new Date(expense.date).getMonth();
    acc[month] += expense.amount;
    acc[12] += expense.amount;
    return acc;
  }, Array(13).fill(0));
};

const calculateBalance = (incomeTotals, summaryTotals) => {
  return incomeTotals.map(
    (incomeTotal, index) => incomeTotal - summaryTotals[index]
  );
};

const groupExpensesByCategory = (expenses, categories, groups, clients, income) => {
  console.log(income)
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
    .groupBy((expense) => (expense?.category && expense?.category?.id) || "0")
    .value();

  const expensesByGroup = (categoryExpenses) =>
    _(categoryExpenses)
      .groupBy((expense) => (expense?.group && expense.group.id) || "0")
      .value();

  // Agrupar ingresos por cliente
  const groupedIncomeByClient = clients.concat(noClient).map((client) => {
    const clientIncomes = incomeByClient(income)[client.id] || [];
    const totals = getTotals(clientIncomes);

    if (totals.some(total => total > 0)) {
      return {
        id: client.id,
        name: client.name || "No Client",
        expenses: clientIncomes,
        totals,
      };
    }
    return null;
  }).filter(client => client !== null); // Eliminar clientes nulos

  const categoryObjects = categories.concat(uncategorized).map((category) => {
    const categoryExpenses = expensesByCategory[category.id] || [];
    const groupedExpensesByGroup = groups.concat(noGroup).map((group) => {
      const groupExpenses = expensesByGroup(categoryExpenses)[group.id] || [];
      const totals = getTotals(groupExpenses);

      // Filtra los grupos con total de gastos igual a cero
      if (totals.some(total => total > 0)) {
        return {
          id: group.id,
          name: group.name,
          expenses: groupExpenses,
          totals,
        };
      }
      return null;
    }).filter(group => group !== null); // Elimina los grupos nulos (sin gastos)

    const totals = getTotals(categoryExpenses);
    if (totals.some(total => total > 0)) {
      return {
        ...category,
        groups: groupedExpensesByGroup,
        expenses: categoryExpenses,
        totals,
      };
    }
    return null;
  }).filter(category => category !== null); // Elimina las categorías nulas (sin gastos)

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
  console.log(groupedExpenses)
  return {
    categories: groupedExpenses,
  };
};

const generateYearlyQuery = (year) => {
  const startDate = new Date(Date.UTC(year, 0, 1)); // 1 de enero del año indicado en UTC
  const endDate = new Date(Date.UTC(year + 1, 0, 1)); // 1 de enero del año siguiente en UTC

  return {
    date: {
      greater_than_equal: startDate,
    },
    and: [
      {
        date: {
          less_than_equal: endDate,
        },
      },
    ],
  };
};


// Esta función puede ser invocada directamente para obtener los datos.
export async function getTableData() {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
  const currentYear = new Date().getFullYear() - 1;
  const query = generateYearlyQuery(currentYear);
  const queryString = qs.stringify({ where: query });
  const headers = {
    Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
  };

  // Tus URLs se mantienen igual...
  const expensesUrl = `${CMS_URL}/expenses?${queryString}&limit=0`;
  const groupsUrl = `${CMS_URL}/expense-group?limit=0`;
  const categoriesUrl = `${CMS_URL}/expense-category?limit=0`;
  const clientsUrl = `${CMS_URL}/clients?limit=0`;
  const incomesUrl = `${CMS_URL}/incomes?${queryString}&limit=0`;

  // Tus llamadas fetch se mantienen igual...
  const [expenses, groups, categories, clients, incomes] = await Promise.all([
    fetch(expensesUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(groupsUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(categoriesUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(clientsUrl, { method: "GET", headers }).then((r) => r.json()),
    fetch(incomesUrl, { method: "GET", headers }).then((r) => r.json()),
  ]);

  // Agrupa y combina los datos como antes
  const data = groupExpensesByCategory(
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
