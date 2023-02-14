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

  const { arrayData: expenses, loading } = useApi("http://10.0.0.4:1337/expenses", {
    fetchOnInit: true,
  });

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

  function groupExpensesByCategoryGroup(expenses: IExpense[]): {
    [key: string]: { [key: string]: IExpense[] };
  } {
    const groupedExpenses = {};
    expenses.forEach((expense) => {
      const category = expense.expense_category.name;
      const group = expense.expense_group?.name || "no-group";
      if (!groupedExpenses[category]) {
        groupedExpenses[category] = {};
      }
      if (!groupedExpenses[category][group]) {
        groupedExpenses[category][group] = [];
      }
      groupedExpenses[category][group].push(expense);
    });
    return groupedExpenses;
  }

  function groupExpensesByGroup(expenses: IExpense[]): {
    [key: string]: IExpense[];
  } {
    const groupedExpenses = {};
    expenses.forEach((expense) => {
      const group = expense.expense_group?.name || "";
      if (!groupedExpenses[group]) {
        groupedExpenses[group] = [];
      }
      groupedExpenses[group].push(expense);
    });
    return groupedExpenses;
  }

  //////////////////

  const totalAmountPerMonth = (expenses) => {
    // Group the expenses by month
    const groupedExpenses = _.groupBy(expenses, (expense) => {
      const date = new Date(expense.Date);
      return date.getMonth();
    });

    // Get the total amount for each month
    const monthlyTotals = _.map(groupedExpenses, (expensesForMonth) => {
      return _.sumBy(expensesForMonth, "amount");
    });

    return monthlyTotals;
  };

  const groupExpenses = (expenses) => {
    const categories = _.groupBy(
      expenses,
      (expense) => expense.expense_category.name
    );

    const groupedExpenses = _.mapValues(categories, (categoryExpenses) => {
      const groupExpenses = _.groupBy(categoryExpenses, (expense) => {
        return expense.expense_group ? expense.expense_group.name : "no group";
      });
      return _.mapValues(groupExpenses, (group) => {
        return _.sumBy(group, "amount");
      });
    });

    return groupedExpenses;
  };

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
        result[category]["totals"] = Array(12).fill(0);
      }

      if (!result[category][group]) {
        result[category][group] = Array(12).fill(0);
      }

      result[category][group][month] += expense.amount;
      result[category]["totals"][month] += expense.amount;
    });

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
