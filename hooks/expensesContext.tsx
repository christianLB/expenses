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

  const {
    arrayData: expenses,
    create: createExpenseHandler,
    fetchAll: fetchExpenses,
    findByQuery: findExpensesByQueryHandler,
    deleteItem: deleteExpenseHandler,
    update: updateExpenseHandler,
    queryResults,
  } = usePayloadCollection({
    collection: "expenses",
    fetchOnInit: true,
    clearOnStart: false,
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
  const {
    arrayData: incomes,
    create: createIncomeHandler,
    fetchAll: fetchIncomes,
  } = usePayloadCollection({ collection: "incomes", fetchOnInit: true, query });

  const {
    //request: gmail,
    loading: gmailLoading,
    response: gmailResponse,
  } = useApi("./api/gmail", {
    method: "POST",
    fetchOnInit: true,
    body: { label: "BBVA/gastos" },
  });

  const { groupedExpensesByCategory } = useExpensesTable(
    expenses,
    categories,
    groups,
    incomes
  );

  const value = {
    colors,
    setCurrentYear,
    createIncomeHandler,
    createExpenseHandler,
    deleteExpenseHandler,
    updateExpenseHandler,
    fetchExpenses,
    fetchIncomes,
    findExpensesByQueryHandler,
    queryResults,
    currentYear,
    expenses,
    incomes,
    groups,
    categories,
    clients,
    groupedExpensesByCategory,
    gmailLoading,
    gmailResponse,
    // categoryGroupExpenses:
    //   expenses && categories && groups && incomes
    //     ? generateSummaryData(expenses, categories, groups, incomes)
    //     : {},
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
