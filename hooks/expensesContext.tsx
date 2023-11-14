import React, { createContext, useContext, useState } from "react";
import { generateYearlyQuery } from "../parseUtils";
import useExpensesTable from "./useExpensesTable";
import usePayloadCollection from "./usePayloadCollection";
import useApi from "./useApi";

const ExpensesContext = createContext<any>({});

export const useExpensesContext = () => useContext(ExpensesContext);

const colors = [
  "#1E88E5", // Blue
  "#43A047", // Green
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#6D4C41", // Brown
  "#3949AB", // Indigo
  "#00897B", // Teal
  "#7B1FA2", // Purple
  "#D81B60", // Pink
  "#546E7A", // Blue Grey
];

export const ExpensesProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const query = generateYearlyQuery(currentYear);

  const expensesCollection = usePayloadCollection({
    collection: "expenses",
    fetchOnInit: false,
    clearOnStart: false,
    query,
  });

  const groupsCollection = usePayloadCollection({
    collection: "expense-group",
    fetchOnInit: false,
  });

  const categoriesCollection = usePayloadCollection({
    collection: "expense-category",
    fetchOnInit: false,
  });

  const clientsCollection = usePayloadCollection({
    collection: "clients",
    fetchOnInit: false,
  });

  const incomesCollection = usePayloadCollection({
    collection: "incomes",
    fetchOnInit: false,
    query,
  });

  const { data, loading } = useApi("./api/tableData", {
    method: "POST",
    fetchOnInit: true,
  });

  const value = {
    colors,
    setCurrentYear,
    currentYear,
    expensesCollection,
    groupsCollection,
    categoriesCollection,
    clientsCollection,
    incomesCollection,
    //gmailApi,
    groupedExpensesByCategory: data?.data?.categories || [],
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
