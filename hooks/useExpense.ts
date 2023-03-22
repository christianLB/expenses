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

const useExpense = ({ fetchOnInit = true } = {}) => {
  const prodUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";

  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;

  //expenses
  const {
    request: fetchExpenses,
    arrayData: expenses,
    loading,
  } = useApi(`${baseUrl}/expenses?depth=1&limit=0`, {
    fetchOnInit: fetchOnInit,
    //Entitykey: "docs",
  });
  //create expense
  const {
    data: newExpense,
    request: createExpenseHandler,
    loading: creatingExpense,
  } = useApi(`${baseUrl}/expenses`, {
    method: "POST",
    //onFinish: fetchExpenses,
  });

  //delete expense
  const {
    data: deletedExpense,
    request: deleteExpenseHandler,
    loading: deletingExpense,
  } = useApi(`${baseUrl}/expenses/:id`, {
    method: "DELETE",
    //onFinish: fetchExpenses,
  });

  return {
    expenses,
    loading: loading,
    creatingExpense,
    createExpenseHandler,
    deleteExpenseHandler,
    deletingExpense,
    deletedExpense,
    newExpense: newExpense?.doc,
    fetchExpenses,
  };
};

export default useExpense;
