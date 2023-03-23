import React, { createContext, useContext, useEffect, useState } from "react";
import useExpense from "./useExpense.ts";
import useExpenseGroup from "./useExpenseGroup.tsx";
import useExpenseCategory from "./useExpenseCategory.tsx";
import useIncome from "./useIncome.ts";
import { generateSummaryData } from "../parseUtils.ts";
import useClient from "./useClient.ts";

const ExpensesContext = createContext({});

export const useExpensesContext = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const expenses = useExpense({ currentYear });
  const groups = useExpenseGroup();
  const categories = useExpenseCategory();
  const { clients } = useClient();
  const { incomes, createIncomeHandler } = useIncome({ currentYear });

  const value = {
    setCurrentYear,
    createIncomeHandler,
    currentYear,
    ...expenses,
    ...incomes,
    ...groups,
    ...categories,
    clients: clients[0] || [],
    categoryGroupExpenses: expenses.expenses[0]
      ? generateSummaryData(expenses.expenses[0], incomes)
      : {},
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
