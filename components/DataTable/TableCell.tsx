// CategoryRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import styles from "./tableStyles.js";

const TableCell = ({ children, style, className, monthIndex }) => {
  const { selectedMonth, setSelectedMonth } =
    useContext<TableContextProps>(TableContext);

  const handleClick = () => {
    setSelectedMonth(monthIndex);
  };

  return (
    <td
      className={className}
      style={{
        ...style,
        filter: `brightness(${monthIndex === selectedMonth ? "120" : "110"}%)`,
      }}
      onClick={handleClick}
    >
      {children}
    </td>
  );
};
export default TableCell;
