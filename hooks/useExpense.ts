import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import * as _ from "lodash";
import useApi from "./useApi.ts";
import useIncome from "./useIncome.ts";

interface IExpenseGroup {
  id: number;
  name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}
interface IExpense {
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
  const { incomes, loading: loadingIncomes, totalIncomePerMonth = [] } = useIncome({fetchOnInit: true});
  const [categoryGroupExpenses, setCategoryGroupExpenses] = useState({});

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

  function getTotalsByCategoryAndGroup(expenses: IExpense[]) {
    const result = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize the sum of all categories
    let allCategoriesSum = Array(13).fill(0);

    if (totalIncomePerMonth.length) {
      const _tocalIncomePerMonth = [
        ...totalIncomePerMonth,
        totalIncomePerMonth.reduce((total, item) => total + item),
      ];
      result["Income"] = { totals: _tocalIncomePerMonth };
    }
    else {
      result["Income"] = { totals: 0 };
    }
    _.forEach(expenses, (expense) => {
      //console.log(expense);
      const month = monthNames.indexOf(
        new Date(expense.date).toLocaleString("en-us", { month: "short" })
      );
      const category = expense.category
        ? expense.category.name
        : "Uncategorized";
      const group = expense.group ? expense.group.name : "no group";

      if (!result[category]) {
        result[category] = {};
        result[category]["totals"] = Array(13).fill(0);
      }

      if (!result[category][group]) {
        result[category][group] = Array(13).fill(0);
      }

      result[category][group][month] += expense.amount;
      result[category][group][12] += expense.amount;
      result[category]["totals"][month] += expense.amount;
      result[category]["totals"][12] += expense.amount;

      allCategoriesSum[month] += expense.amount;
      allCategoriesSum[12] += expense.amount;
    });

    // Add the total sum of all categories to the result
    result["All Categories"] = {};
    result["All Categories"]["totals"] = allCategoriesSum;

    const balance = monthNames.map((month, i) => {
      const totalIncome = result["Income"]["totals"][i] ?? 0;
      const totalExpense = result["All Categories"]["totals"][i] ?? 0;
      return totalIncome - totalExpense;
    });
    result["Balance"] = {};
    result["Balance"].totals = balance;
    //aggregate total balance
    result["Balance"]["totals"] = [
      ...result["Balance"]["totals"],
      result["Balance"]["totals"].reduce((total, item) => total + item),
    ];

    return result;
  }

  useEffect(() => {
    setCategoryGroupExpenses(getTotalsByCategoryAndGroup(expenses[0]));
  }, [expenses, incomes]);

  return {
    expenses,
    loading: loading || loadingIncomes,
    creatingExpense,
    categoryGroupExpenses,
    createExpenseHandler,
    deleteExpenseHandler,
    deletingExpense,
    deletedExpense,
    newExpense: newExpense?.doc,
    fetchExpenses,
  };
};

export default useExpense;
