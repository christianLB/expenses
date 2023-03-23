import * as _ from "lodash";
import useApi from "./useApi.ts";
import qs from "qs";

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

const useIncome = ({ currentYear }) => {
  const startDate = `${currentYear}-01-01T00:00:00.000Z`;
  const endDate = `${++currentYear}-01-01T00:00:00.000Z`;

  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;

  const query = {
    date: {
      greater_than_equal: startDate,
    },
    and: [
      {
        date: {
          less_than_equal: endDate,
        },
      },
    ],
    // This query could be much more complex
    // and QS would handle it beautifully
  };

  const stringifiedQuery = qs.stringify(
    {
      where: query, // ensure that `qs` adds the `where` property, too!
    },
    { addQueryPrefix: true }
  );

  //fetch incomes
  const {
    request: fetchIncomes,
    arrayData: incomes,
    loading,
  } = useApi(`${baseUrl}/incomes${stringifiedQuery}`, {
    fetchOnInit: true,
  });
  //create incomes
  const {
    data: newIncome,
    request: createIncomeHandler,
    loading: creatingIncome,
  } = useApi(`${baseUrl}/incomes`, {
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
