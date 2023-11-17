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

  // Función para inicializar las colecciones con usePayloadCollection
  const initializeCollection = (collectionName, hasQuery = false) =>
    usePayloadCollection({
      collection: collectionName,
      fetchOnInit: false,
      clearOnStart: false,
      ...(hasQuery && { query }), // Agregar query solo si es necesario
    });

  // Inicializar colecciones usando la función
  const expensesCollection = initializeCollection("expenses", true);
  const groupsCollection = initializeCollection("expense-group");
  const categoriesCollection = initializeCollection("expense-category");
  const clientsCollection = initializeCollection("clients");
  const incomesCollection = initializeCollection("incomes", true);

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
