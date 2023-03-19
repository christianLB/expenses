import React, { createContext, useContext, useState } from "react";
import useExpense from "./useExpense.ts";
import useExpenseGroup from "./useExpenseGroup.tsx";
import useExpenseCategory from "./useExpenseCategory.tsx";
import useIncome from "./useIncome.ts";

const ExpensesContext = createContext({});

export const useExpensesContext = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
  const expenses = useExpense();
  const groups = useExpenseGroup();
  const categories = useExpenseCategory();
  const incomes = useIncome();

  const value = { ...expenses, ...incomes, ...groups, ...categories };
  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
