import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import useApi from "./useApi.ts";

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
  id: number;
  published_at: string;
  updated_at: string;
}

const useExpense = () => {
  const router = useRouter();
  //const [expenses, setExpenses] = useState();
  // const [fixedExpenses, setFixedExpenses] = useState();

  // const handleDeleteExpense = async (expenseId) => {
  //   const response = await fetch("./api/expense/delete", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: expenseId,
  //   });
  //   const result = await response.json();
  //   router.replace(router.asPath);
  //   console.log("sos tarado eh", result);
  // };

  // const fetchAllExpenses = async () => {
  //   const response = await fetch("./api/expense", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const result = await response.json();
  //   setExpenses(result);
  // };

  // const fetchAllFixedExpenses = async () => {
  //   const response = await fetch("./api/fixedExpense", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const result = await response.json();
  //   setFixedExpenses(result);
  // };

  const { arrayData: expenses } = useApi("http://10.0.0.4:1337/expenses", {
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

  return {
    expenses,
    categoryExpenses: groupExpensesByCategory(expenses),
  };
};

export default useExpense;
