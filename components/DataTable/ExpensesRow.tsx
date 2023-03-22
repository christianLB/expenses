// ExpensesRow.tsx
import React from "react";
import styles from "./tableStyles.js";

interface ExpenseData {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface ExpensesRowProps {
  expense: ExpenseData;
}

const ExpensesRow: React.FC<ExpensesRowProps> = ({ expense }) => {
  return (
    <tr className={styles.expensesRow}>
      <td className={`${styles.cell}`}></td>
      <td className={`${styles.cell}`}></td>
      <td className={`${styles.cell} ${styles.paddingLeft}`}>{expense.name}</td>
      <td colSpan={11}></td>
      <td>{expense.amount.toFixed(2)}</td>
    </tr>
  );
};

export default ExpensesRow;
