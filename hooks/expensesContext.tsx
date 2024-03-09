import React, { createContext, useContext, useState } from "react";
import { generateYearlyQuery } from "../parseUtils";
import useExpensesTable from "./useExpensesTable";
import usePayloadCollection from "./usePayloadCollection";
import useApi from "./useApi";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const query = generateYearlyQuery(currentYear);
  const isAuthenticated = status === "authenticated";

  const expensesCollection = usePayloadCollection({
    collection: "expenses",
    fetchOnInit: false,
    clearOnStart: false,
    ...(true && { query }),
  });
  const groupsCollection = usePayloadCollection({
    collection: "expense-group",
    fetchOnInit: false,
    clearOnStart: false,
  });
  const categoriesCollection = usePayloadCollection({
    collection: "expense-category",
    fetchOnInit: false,
    clearOnStart: false,
  });
  const clientsCollection = usePayloadCollection({
    collection: "clients",
    fetchOnInit: false,
    clearOnStart: false,
  });
  const incomesCollection = usePayloadCollection({
    collection: "incomes",
    fetchOnInit: false,
    clearOnStart: false,
    ...(true && { query }),
  });

  const { data, loading } = useApi("./api/tableData", {
    method: "POST",
    startOn: false, // isAuthenticated, // Solicitar datos solo cuando el usuario esté autenticado
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
    loading,
    //gmailApi,
    groupedExpensesByCategory: data?.data?.categories || [],
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
