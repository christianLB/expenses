import React, { createContext, useContext, useState } from "react";
import { generateSummaryData } from "../parseUtils.ts";
import usePayloadCollection from "./usePayloadCollection.ts";

const ExpensesContext = createContext({});

export const useExpensesContext = () => useContext(ExpensesContext);

export const ExpensesProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const startDate = `${currentYear}-01-01T00:00:00.000Z`;
  const endDate = `${currentYear + 1}-01-01T00:00:00.000Z`;

  const query = {
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
    // This query could be much more complex
    // and QS would handle it beautifully
  };
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
