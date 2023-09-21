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

  // const {
  //   arrayData: expenses,
  //   create: createExpenseHandler,
  //   fetchAll: fetchExpenses,
  //   findByQuery: findExpensesByQueryHandler,
  //   deleteItem: deleteExpenseHandler,
  //   update: updateExpenseHandler,
  //   queryResults,
  // } = usePayloadCollection({
  //   collection: "expenses",
  //   fetchOnInit: true,
  //   clearOnStart: false,
  //   query,
  // });
  // const {
  //   fetchAll: fetchGroups,
  //   arrayData: groups,
  //   create: createGroupHandler,
  //   update: updateGroupHandler,
  // } = usePayloadCollection({
  //   collection: "expense-group",
  //   fetchOnInit: true,
  // });
  // const {
  //   fetchAll: fetchCategories,
  //   arrayData: categories,
  //   create: createCategoryHandler,
  //   update: updateCategoryHandler,
  // } = usePayloadCollection({
  //   collection: "expense-category",
  //   fetchOnInit: true,
  // });
  // const { arrayData: clients } = usePayloadCollection({
  //   collection: "clients",
  //   fetchOnInit: true,
  // });
  // const {
  //   arrayData: incomes,
  //   create: createIncomeHandler,
  //   fetchAll: fetchIncomes,
  // } = usePayloadCollection({ collection: "incomes", fetchOnInit: true, query });

  // const {
  //   //request: gmail,
  //   loading: gmailLoading,
  //   response: gmailResponse,
  // } = useApi("./api/gmail", {
  //   method: "POST",
  //   fetchOnInit: true,
  //   body: { label: "BBVA/gastos" },
  //   onFinish: () => fetchExpenses(),
  // });

  const expensesCollection = usePayloadCollection({
    collection: "expenses",
    fetchOnInit: true,
    clearOnStart: false,
    query,
  });

  const groupsCollection = usePayloadCollection({
    collection: "expense-group",
    fetchOnInit: true,
  });

  const categoriesCollection = usePayloadCollection({
    collection: "expense-category",
    fetchOnInit: true,
  });

  const clientsCollection = usePayloadCollection({
    collection: "clients",
    fetchOnInit: true,
  });

  const incomesCollection = usePayloadCollection({
    collection: "incomes",
    fetchOnInit: true,
    query,
  });

  const gmailApi = useApi("./api/gmail", {
    method: "POST",
    fetchOnInit: true,
    body: { label: "BBVA/gastos" },
    //onFinish: () => fetchExpenses(),
  });

  const { groupedExpensesByCategory } = useExpensesTable(
    expensesCollection.arrayData,
    categoriesCollection.arrayData,
    groupsCollection.arrayData,
    incomesCollection.arrayData
  );

  const value = {
    colors,
    setCurrentYear,
    expensesCollection,
    groupsCollection,
    categoriesCollection,
    clientsCollection,
    incomesCollection,
    gmailApi,
    groupedExpensesByCategory,
  };

  // const value = {
  //   colors,
  //   setCurrentYear,
  //   createIncomeHandler,
  //   createExpenseHandler,
  //   deleteExpenseHandler,
  //   updateExpenseHandler,
  //   fetchExpenses,
  //   fetchCategories,
  //   fetchIncomes,
  //   findExpensesByQueryHandler,
  //   updateCategoryHandler,
  //   createGroupHandler,
  //   createCategoryHandler,
  //   updateGroupHandler,
  //   fetchGroups,
  //   queryResults,
  //   currentYear,
  //   expenses,
  //   incomes,
  //   groups,
  //   categories,
  //   clients,
  //   groupedExpensesByCategory,
  //   gmailLoading,
  //   gmailResponse,
  //   // categoryGroupExpenses:
  //   //   expenses && categories && groups && incomes
  //   //     ? generateSummaryData(expenses, categories, groups, incomes)
  //   //     : {},
  // };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};
