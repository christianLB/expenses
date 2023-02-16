import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import * as _ from "lodash";
import useApi from "./useApi.ts";

interface IExpenseGroup {
  id: number;
  name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}
interface IExpense {
  Date: string;
  Name: string;
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
  const router = useRouter();

  const { arrayData: expenses, loading } = useApi(
    "http://10.0.0.4:1337/expenses",
    {
      fetchOnInit: true,
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

  // function getTotalsByCategoryAndGroup(expenses: IExpense[]) {
  //   const result = {};
  //   const monthNames = [
  //     "Jan",
  //     "Feb",
  //     "Mar",
  //     "Apr",
  //     "May",
  //     "Jun",
  //     "Jul",
  //     "Aug",
  //     "Sep",
  //     "Oct",
  //     "Nov",
  //     "Dec",
  //   ];
  //   const totals = {};
  //   totals["totals"] = Array(12).fill(0);

  //   _.forEach(expenses, (expense) => {
  //     const month = monthNames.indexOf(
  //       new Date(expense.Date).toLocaleString("en-us", { month: "short" })
  //     );
  //     const category = expense.expense_category.name;
  //     const group = expense.expense_group
  //       ? expense.expense_group.name
  //       : "no group";

  //     if (!result[category]) {
  //       result[category] = {};
  //       result[category]["totals"] = Array(12).fill(0);
  //     }

  //     if (!result[category][group]) {
  //       result[category][group] = Array(12).fill(0);
  //     }

  //     result[category][group][month] += expense.amount;
  //     result[category]["totals"][month] += expense.amount;
  //     totals["totals"][month] += expense.amount;
  //   });

  //   result["totals"] = totals;

  //   return result;
  // }

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

    _.forEach(expenses, (expense) => {
      const month = monthNames.indexOf(
        new Date(expense.Date).toLocaleString("en-us", { month: "short" })
      );
      const category = expense.expense_category.name;
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

    return result;
  }

  console.log(
    "getTotalsByCategoryAndGroup",
    getTotalsByCategoryAndGroup(expenses)
  );

  return {
    expenses,
    loading,
    categoryExpenses: groupExpensesByCategory(expenses),
    categoryGroupExpenses: getTotalsByCategoryAndGroup(expenses),
  };
};

export default useExpense;
