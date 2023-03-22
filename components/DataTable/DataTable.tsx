// Table.tsx
import React from "react";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import TableHeader from "./TableHeader.tsx";
import CategoryRow from "./CategoryRow.tsx";
import tableStyles from "./tableStyles.js";

interface TableProps {}

const Table: React.FC<TableProps> = () => {
  const { categoryGroupExpenses: tableData } = useExpensesContext();

  if (!tableData) {
    return <p>Loading...</p>; // Display a loading message while waiting for data
  }

  const hasCategories = tableData.categories && tableData.categories.length > 0;

  const { table } = tableStyles;

  return (
    <table className={table}>
      <TableHeader />
      <tbody>
        {hasCategories ? (
          tableData.categories.map((category, index) => (
            <CategoryRow key={index} category={category} />
          ))
        ) : (
          <tr>
            <td colSpan={14} style={{ textAlign: "center" }}>
              No rows found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
