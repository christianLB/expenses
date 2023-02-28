import useApi from "./useApi.ts";

const useExpenseCategory = () => {

  const { arrayData: expenseCategories, loading } = useApi(
    "http://10.0.0.4:1337/expense-categories",
    {
      fetchOnInit: true,
    }
  );

  return {
    expenseCategories,
    loading
  };
};

export default useExpenseCategory;
