// CategoryRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import nextStyles from "../../styles/Expenses.module.css";

const TableCell = ({ children = "", style, className, monthIndex = -1 }) => {
  const { selectedMonth, setSelectedMonth } =
    useContext<TableContextProps>(TableContext);

  const handleClick = () => {
    setSelectedMonth(monthIndex);
  };

  return (
    <td
      className={`${className} ${
        monthIndex === selectedMonth ? nextStyles.blinking : ""
      }`}
      style={{
        ...style,
      }}
      onClick={handleClick}
    >
      {children}
    </td>
  );
};
export default TableCell;
