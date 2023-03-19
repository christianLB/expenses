import * as _ from "lodash";
import useApi from "./useApi.ts";

interface IIncome {
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

const useIncome = ({ fetchOnInit = false} = {}) => {
  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;
  
  function calculateTotalIncomePerMonth(invoices: IIncome[]): number[] {
    const totals = Array(12).fill(0); // Initialize an array of 12 zeroes

    if (!incomes.length) return []
    for (const income of incomes) {
      const date = new Date(income.date);
      const month = date.getMonth();

      totals[month] += income.amount;
    }

    return totals;
  }

  //fetch incomes
  const { request: fetchIncomes, arrayData: incomes, loading } = useApi(
    `${baseUrl}/incomes`,
    {
      fetchOnInit: fetchOnInit,
    }
  );
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
    incomes,
    newIncome,
    createIncomeHandler,
    creatingIncome,
    totalIncomePerMonth: calculateTotalIncomePerMonth(incomes),
    loading,
  };
};

export default useIncome;
