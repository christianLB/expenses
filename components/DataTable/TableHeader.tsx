// TableHeader.tsx
import React from "react";
import styles from "./tableStyles.js";
import nextStyles from "../../styles/Expenses.module.css";

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
    <div className={`${styles.categoryRow} ${nextStyles.gridtable}`}>
      <div></div>
      {months.map((month, index) => (
        <div className="text-center" key={index}>
          {month}
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
