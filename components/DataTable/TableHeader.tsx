// TableHeader.tsx
import React from "react";
import styles from "./tableStyles.js";
import nextStyles from "../../styles/Expenses.module.css";
import { Table } from "@mantine/core";

interface TableHeaderProps {}

const TableHeader: React.FC<TableHeaderProps> = () => {
  const months = [
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
    "Total",
  ];

  return (
    <Table.Tr>
      <Table.Td></Table.Td>
      {months.map((month, index) => (
        <Table.Td className="text-center" key={index} c="gray">
          {month}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default TableHeader;
