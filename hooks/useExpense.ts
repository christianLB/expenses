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
  expense_category: {
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
  expense_group?: IExpenseGroup;
  id: number;
  published_at: string;
  updated_at: string;
}

const useExpense = () => {
  const { incomes, loading: loadingIncomes, totalIncomePerMonth } = useIncome();

  const [categoryGroupExpenses, setCategoryGroupExpenses] = useState({});

  const baseUrl = "https://cms.anaxi.net/api";
  const localUrl = "http://10.0.0.4:3020/api";
  //expenses
  const { arrayData: expenses, loading } = useApi(
    `${baseUrl}/expenses?depth=1&limit=1000"`,
    {
      fetchOnInit: true,
      //Entitykey: "docs",
    }
  );

  const { request: createExpenseHandler, loading: creatingExpense } = useApi(
    `${baseUrl}/api/expenses`,
    {
      method: "POST",
    }
  );

  function groupExpensesByCategory(expenses: IExpense[]): {
    [key: string]: IExpense[];
  } {
    const groupedExpenses = {};
    expenses.forEach((expense) => {
      const category = expense.expense_category.name;
      if (!groupedExpenses[category]) {
        groupedExpenses[category] = [];
      }
      groupedExpenses[category].push(expense);
    });
    return groupedExpenses;
  }

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

    const _tocalIncomePerMonth = [
      ...totalIncomePerMonth,
      totalIncomePerMonth.reduce((total, item) => total + item),
    ];
    result["Income"] = { totals: _tocalIncomePerMonth };
    _.forEach(expenses, (expense) => {
      //console.log(expense);
      const month = monthNames.indexOf(
        new Date(expense.date).toLocaleString("en-us", { month: "short" })
      );
      const category = expense.expense_category
        ? expense.expense_category.name
        : "Uncategorized";
      const group = expense.expense_group
        ? expense.expense_group.name
        : "no group";

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
  };
};

export default useExpense;
