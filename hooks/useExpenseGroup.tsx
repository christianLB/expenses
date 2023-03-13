import useApi from "./useApi.ts";

const useExpenseGroup = () => {
  const baseUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const { data: expenseGroups, loading } = useApi(`${baseUrl}/expense-group`, {
    fetchOnInit: true,
  });

  const { request: createExpenseHandler, loading: creatingExpense } = useApi(
    `${baseUrl}/expense-group`,
    {
      method: "POST",
    }
  );

  return {
    expenseGroups: expenseGroups?.docs,
    loading,
  };
};

export default useExpenseGroup;
