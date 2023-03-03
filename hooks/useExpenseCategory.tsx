import useApi from "./useApi.ts";

const useExpenseCategory = () => {
  const { data: expenseCategories, loading } = useApi(
    "http://10.0.0.4:3020/api/expense-category",
    {
      fetchOnInit: true,
    }
  );

  return {
    expenseCategories: expenseCategories.docs,
    loading,
  };
};

export default useExpenseCategory;
