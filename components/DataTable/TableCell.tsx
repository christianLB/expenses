// CategoryRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import nextStyles from "../../styles/Expenses.module.css";
import { Table } from "@mantine/core";

const TableCell = ({
  children = "",
  style = {},
  className = "",
  monthIndex = -1,
  onClick = () => {},
  onMouseMove = () => {},
}) => {
  const { selectedMonth } = useContext<TableContextProps>(TableContext);

  return (
    <Table.Td
      className={`${className} ${
        monthIndex === selectedMonth ? nextStyles.blinking : ""
      } select-none`}
      style={{
        ...style,
      }}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {children}
    </Table.Td>
  );
};
export default TableCell;
