import useApi from "./useApi.ts";

const useExpenseGroup = () => {
  const { arrayData: expenseGroups, loading } = useApi(
    "http://10.0.0.4:1337/expense-groups",
    {
      fetchOnInit: true,
    }
  );

  const { request: createExpenseHandler, loading: creatingExpense } = useApi(
    "http://10.0.0.4:1337/expense-groups",
    {
      method: 'POST'
    }
  );

  return {
    expenseGroups,
    loading,
  };
};

export default useExpenseGroup;
