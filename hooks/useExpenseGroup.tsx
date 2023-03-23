import useApi from "./useApi.ts";

const useExpenseGroup = () => {
  const baseUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const { data: expenseGroups, loading } = useApi(
    `${baseUrl}/expense-group?limit=0`,
    {
      fetchOnInit: true,
    }
  );

  return {
    expenseGroups: expenseGroups?.docs,
    loading,
  };
};

export default useExpenseGroup;
