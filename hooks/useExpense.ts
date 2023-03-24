import * as _ from "lodash";
import { useState } from "react";
import useApi from "./useApi.ts";
import qs from "qs";
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

const useExpense = ({
  fetchOnInit = true,
  currentYear = new Date().getFullYear(),
} = {}) => {
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

  const stringifiedQuery = qs.stringify({
    where: query, // ensure that `qs` adds the `where` property, too!
  });

  //expenses list
  const {
    request: fetchExpenses,
    arrayData: expenses,
    loading,
  } = useApi(`${baseUrl}/expenses?limit=0&depth=1&${stringifiedQuery}`, {
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
