import qs from 'qs';
import { generateYearlyQuery } from '../../parseUtils'
import _ from 'lodash'

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

const groupExpensesByCategory = (expenses, categories, groups, income) => {
  const uncategorized = {
    id: "0",
    name: "Uncategorized",
    color: "#da9898",
  };
  const noGroup = { id: "0", name: "No Group" };

  const expensesByCategory = _(expenses)
    .groupBy((expense) => (expense?.category && expense?.category?.id) || "0")
    .value();

  const expensesByGroup = (categoryExpenses) =>
    _(categoryExpenses)
      .groupBy((expense) => (expense?.group && expense.group.id) || "0")
      .value();

  // Add income category at the top
  const incomeTotals = getTotals(income);
  const incomeCategory = {
    id: "income",
    name: "Income",
    groups: [],
    expenses: income,
    color: "#72afff",
    totals: incomeTotals,
  };

  const categoryObjects = categories.concat(uncategorized).map((category) => {
    const categoryExpenses = expensesByCategory[category.id] || [];
    const groupedExpensesByGroup = groups.concat(noGroup).map((group) => {
      const groupExpenses = expensesByGroup(categoryExpenses)[group.id] || [];
      const totals = getTotals(groupExpenses);
      return {
        id: group.id,
        name: group.name,
        expenses: groupExpenses,
        totals,
      };
    });

    const totals = getTotals(categoryExpenses);
    return {
      ...category,
      groups: groupedExpensesByGroup,
      expenses: categoryExpenses,
      totals,
    };
  });

  // Prepend the incomeCategory to the categoryObjects array
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
    categories: groupedExpenses,
  };
};

// Main
export default async function handler(req, res) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
  const currentYear = new Date().getFullYear(); // Obtiene el año actual
  const query = generateYearlyQuery(currentYear);
  const queryString = qs.stringify({ where: query });

  try {
    // Preparar las URLs para cada petición
    const expensesUrl = `${CMS_URL}/expenses?${queryString}&limit=0`;
    const groupsUrl = `${CMS_URL}/expense-group?limit=0`;
    const categoriesUrl = `${CMS_URL}/expense-category?limit=0`;
    const clientsUrl = `${CMS_URL}/clients?limit=0`;
    const incomesUrl = `${CMS_URL}/incomes?${queryString}&limit=0`;

    // Realizar todas las peticiones en paralelo
    const headers = {
      Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
    }

    const [expenses, groups, categories, clients, incomes] = await Promise.all([
      fetch(expensesUrl, { method: 'GET', headers }).then(r => r.json()),
      fetch(groupsUrl, { method: 'GET', headers }).then(r => r.json()),
      fetch(categoriesUrl, { method: 'GET', headers }).then(r => r.json()),
      fetch(clientsUrl, { method: 'GET', headers }).then(r => r.json()),
      fetch(incomesUrl, { method: 'GET', headers }).then(r => r.json())
    ]);

    // Agrupar y combinar los datos.
    const data = groupExpensesByCategory(expenses.docs, categories.docs, groups.docs, incomes.docs)

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

