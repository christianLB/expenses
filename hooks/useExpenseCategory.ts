import { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import useApi from "./useApi.ts";

const useExpenseCategory = () => {
  const router = useRouter();

  const { arrayData: expenseCategories } = useApi(
    "http://192.168.1.22:1337/expense-categories",
    {
      fetchOnInit: true,
    }
  );

  return {
    expenseCategories,
  };
};

export default useExpenseCategory;
