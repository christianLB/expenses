import { useState, useEffect, useMemo } from "react";
import _ from "lodash";

const useExpensesTable = (expenses, categories, groups) => {
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);

  const getTotals = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).getMonth();
      acc[month] += expense.amount;
      acc[12] += expense.amount;
      return acc;
    }, Array(13).fill(0));
  };

  const filterByCategory = (categoryId) => {
    const filtered = _.filter(
      expenses,
      (expense) => expense.category.id === categoryId
    );
    setFilteredExpenses(filtered);
  };

  const groupExpensesByCategory = (expenses, categories, groups) => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return { categories: [] };
    }

    const uncategorized = { id: "0", name: "Uncategorized" };
    const noGroup = { id: "0", name: "No Group" };

    const expensesByCategory = _(expenses)
      .groupBy((expense) => (expense.category && expense.category.id) || "0")
      .value();

    const expensesByGroup = (categoryExpenses) =>
      _(categoryExpenses)
        .groupBy((expense) => (expense.group && expense.group.id) || "0")
        .value();

    const groupedExpenses = categories.concat(uncategorized).map((category) => {
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

    return {
      categories: groupedExpenses,
    };
  };

  const groupedExpensesByCategory = useMemo(() => {
    if (expenses.length && categories.length && groups.length) {
      console.log({ expenses, categories });
      const groupedExpensesResult = groupExpensesByCategory(
        expenses,
        categories,
        groups
      );
      return groupedExpensesResult.categories;
    } else {
      return [];
    }
  }, [expenses, categories]);

  return {
    groupedExpensesByCategory,
    filteredExpenses,
    getTotals,
    filterByCategory,
  };
};

export default useExpensesTable;
