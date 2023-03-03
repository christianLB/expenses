import useApi from "./useApi.ts";

const useExpenseGroup = () => {

  const { data: expenseGroups, loading } = useApi(
    "http://10.0.0.4:3020/api/expense-group",
    {
      fetchOnInit: true,
    }
  );

  const { request: createExpenseHandler, loading: creatingExpense } = useApi(
    "http://10.0.0.4:3020/api/expense-groups",
    {
      method: 'POST'
    }
  );

  return {
    expenseGroups: expenseGroups?.docs,
    loading,
  };
};

export default useExpenseGroup;
