import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
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

const useIncome = () => {
  function calculateTotalIncomePerMonth(invoices: IIncome[]): number[] {
    const totals = Array(12).fill(0); // Initialize an array of 12 zeroes

    for (const income of incomes) {
      const date = new Date(income.date);
      const month = date.getMonth();

      totals[month] += income.amount;
    }

    return totals;
  }

  const { arrayData: incomes, loading } = useApi(
    "http://10.0.0.4:1337/incomes",
    {
      fetchOnInit: false,
    }
  );

  return {
    incomes,
    totalIncomePerMonth: calculateTotalIncomePerMonth(incomes),
    loading,
  };
};

export default useIncome;
