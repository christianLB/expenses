import * as _ from "lodash";
import useApi from "./useApi.ts";

export interface IIncome {
  id: number;
  name: string;
  amount: number;
  invoice: null;
  date: string;
  desc: null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const useIncome = () => {
  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;

  //fetch incomes
  const {
    request: fetchIncomes,
    arrayData: incomes,
    loading,
  } = useApi(`${baseUrl}/incomes`, {
    fetchOnInit: true,
  });
  //create incomes
  const {
    data: newIncome,
    request: createIncomeHandler,
    loading: creatingIncome,
  } = useApi(`${baseUrl}/expenses`, {
    method: "POST",
    onFinish: fetchIncomes,
  });

  return {
    incomes: incomes?.length ? incomes[0] : [],
    newIncome,
    createIncomeHandler,
    creatingIncome,
    loading,
  };
};

export default useIncome;
