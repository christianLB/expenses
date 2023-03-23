import * as _ from "lodash";
import useApi from "./useApi.ts";
export interface IExpenseGroup {
  id: number;
  name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}
export interface IExpense {
  date: string;
  name: string;
  amount: number;
  created_at: string;
  desc: string | null;
  category: {
    additional_info: string | null;
    client_number: string | null;
    contract_number: string | null;
    created_at: string;
    expense_group: string | null;
    id: number;
    name: string;
    payments_left: string | null;
    published_at: string;
    updated_at: string;
  };
  group?: IExpenseGroup;
  id: number;
  published_at: string;
  updated_at: string;
}

const useClient = () => {
  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;

  //const startDate = `${currentYear}-01-01T00:00:00.000Z`;
  //const endDate = `${++currentYear}-01-01T00:00:00.000Z`;
  // const query = {
  //   date: {
  //     greater_than_equal: startDate,
  //   },
  //   and: [
  //     {
  //       date: {
  //         less_than_equal: endDate,
  //       },
  //     },
  //   ],
  //   // This query could be much more complex
  //   // and QS would handle it beautifully
  // };

  // const stringifiedQuery = qs.stringify(
  //   {
  //     where: query, // ensure that `qs` adds the `where` property, too!
  //   },
  //   { addQueryPrefix: true }
  // );

  //expenses
  const {
    request: fetchClients,
    arrayData: clients,
    loading,
  } = useApi(`${baseUrl}/clients`, {
    fetchOnInit: true,
    //Entitykey: "docs",
  });

  return {
    clients,
    loading: loading,
    fetchClients,
  };
};

export default useClient;
