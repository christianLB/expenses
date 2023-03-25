import React, { createContext, useContext, useState } from "react";
import { generateYearlyQuery } from "../parseUtils.ts";
import { generateSummaryData } from "../parseUtils.ts";
import usePayloadCollection from "./usePayloadCollection.ts";

const ExpensesContext = createContext({});

export const useExpensesContext = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const query = generateYearlyQuery(currentYear);

  const { arrayData: expenses } = usePayloadCollection({
    collection: "expenses",
    fetchOnInit: true,
    query,
  });
  const { arrayData: groups } = usePayloadCollection({
    collection: "expense-group",
    fetchOnInit: true,
  });
  const { arrayData: categories } = usePayloadCollection({
    collection: "expense-category",
    fetchOnInit: true,
  });
  const { arrayData: clients } = usePayloadCollection({
    collection: "clients",
    fetchOnInit: true,
  });
  const { arrayData: incomes, create: createIncomeHandler } =
    usePayloadCollection({ collection: "incomes", fetchOnInit: true, query });

  const value = {
    setCurrentYear,
    createIncomeHandler,
    currentYear,
    expenses,
    incomes,
    groups,
    categories,
    clients,
    categoryGroupExpenses: expenses
      ? generateSummaryData(expenses, incomes)
      : {},
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
