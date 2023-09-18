// CategoryRow.tsx
import React from "react";
import styles from "./tableStyles.js";
import TableCell from "./TableCell";
import nextStyles from "../../styles/Expenses.module.css";

interface CategoryData {
  id: string;
  name: string;
  groups: Array<GroupData>;
  totals: Array<number>;
}

interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface CategoryRowProps {
  category: CategoryData;
  index: number;
  color: string;
}
const SummaryRow = ({ category, color, onClick = () => {} }) => {
  return (
    <div
      className={`${styles.categoryRow} ${nextStyles.gridtable}`}
      onClick={onClick}
    >
      <div
        className={`${styles.cell} text-white`}
        style={{ backgroundColor: color }}
      >
        Gastos
      </div>
      {category.totals.map((total, index) => (
        <TableCell
          monthIndex={index}
          className={`${styles.cell} text-white`}
          key={index}
          style={{ backgroundColor: color }}
        >
          {total.toFixed(2)}
        </TableCell>
      ))}
    </div>
  );
};

export default SummaryRow;
