// CategoryRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import nextStyles from "../../styles/Expenses.module.css";

const TableCell = ({
  children = "",
  style = {},
  className,
  monthIndex = -1,
  onClick = () => {},
  onMouseMove = () => {},
}) => {
  const { selectedMonth } = useContext<TableContextProps>(TableContext);

  return (
    <td
      className={`${className} ${
        monthIndex === selectedMonth ? nextStyles.blinking : ""
      }`}
      style={{
        ...style,
      }}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {children}
    </td>
  );
};
export default TableCell;
