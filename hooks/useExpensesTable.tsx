import { useState, useEffect, useMemo } from "react";
import _ from "lodash";

const useExpensesTable = (expenses, categories, groups, income) => {
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);

  const getTotals = (expenses: any[] = []) => {
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

  const filterByCategory = (categoryId) => {
    const filtered = _.filter(
      expenses,
      (expense) => expense.category.id === categoryId
    );
    setFilteredExpenses(filtered);
  };

  const groupExpensesByCategory = (expenses, categories, groups, income) => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return { categories: [] };
    }

    const uncategorized: any = { id: "0", name: "Uncategorized" };
    const noGroup = { id: "0", name: "No Group" };

    const expensesByCategory = _(expenses)
      .groupBy((expense) => (expense.category && expense.category.id) || "0")
      .value();

    const expensesByGroup = (categoryExpenses) =>
      _(categoryExpenses)
        .groupBy((expense) => (expense.group && expense.group.id) || "0")
        .value();

    // Add income category at the top
    const incomeTotals = getTotals(income);
    const incomeCategory = {
      id: "income",
      name: "Income",
      groups: [],
      expenses: income,
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
        id: category.id,
        name: category.name,
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
      totals: balanceTotals,
    };
    groupedExpenses.push(balanceCategory);

    return {
      categories: groupedExpenses,
    };
  };

  const groupedExpensesByCategory = useMemo(() => {
    if (
      expenses.length &&
      categories.length &&
      groups.length &&
      income !== null &&
      income !== undefined
    ) {
      const groupedExpensesResult = groupExpensesByCategory(
        expenses,
        categories,
        groups,
        income
      );
      return groupedExpensesResult.categories;
    } else {
      return [];
    }
  }, [expenses, categories, income, groups]);

  return {
    groupedExpensesByCategory,
    filteredExpenses,
    getTotals,
    filterByCategory,
  };
};

export default useExpensesTable;
