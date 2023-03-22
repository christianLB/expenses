import React, { createContext, useContext, useEffect, useState } from "react";
import useExpense from "./useExpense.ts";
import useExpenseGroup from "./useExpenseGroup.tsx";
import useExpenseCategory from "./useExpenseCategory.tsx";
import useIncome from "./useIncome.ts";
import { calculateExpensesTotals, processJSON } from "../utils.ts";
import { generateSummaryData } from "../parseUtils.ts";

const ExpensesContext = createContext({});

export const useExpensesContext = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
  const expenses = useExpense();
  const groups = useExpenseGroup();
  const categories = useExpenseCategory();
  const { incomes } = useIncome();

  const value = {
    ...expenses,
    ...incomes,
    ...groups,
    ...categories,
    categoryGroupExpenses: expenses.expenses[0]
      ? generateSummaryData(expenses.expenses[0], incomes)
      : {},
    // categoryGroupExpenses: expenses.expenses[0]
    //   ? processJSON(expenses.expenses[0], incomes)
    //   : {},
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
