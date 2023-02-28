import useApi from "./useApi.ts";
import { Select } from "@chakra-ui/react";
import { useState } from "react";

const useExpenseCategory = () => {


    const [selectedGroup, setSelectedGroup] = useState();

  const { arrayData: expenseCategories, loading } = useApi(
    "http://10.0.0.4:1337/expense-categories",
    {
      fetchOnInit: true,
    }
  );

  const CategoriesSelect = <Select
    placeholder="Select option"
    size="xs" 
    onChange={(e: any) => setSelectedGroup(e.target.value)}
  >
    {expenseCategories?.map((category) => {
      return (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      );
    })}
  </Select>
  
  return {
    expenseCategories,
    CategoriesSelect,
    loading
  };
};

export default useExpenseCategory;
