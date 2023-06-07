import useApi from "./useApi";

const useExpenseCategory = () => {
  const baseUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const { data: expenseCategories, loading } = useApi(
    `${baseUrl}/expense-category?limit=0`,
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
