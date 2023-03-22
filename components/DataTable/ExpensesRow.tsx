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
      <td></td>
      <td></td>
      <td style={{ paddingLeft: "3em" }}>{expense.name}</td>
      <td colSpan={11}></td>
      <td>{expense.amount.toFixed(2)}</td>
    </tr>
  );
};

export default ExpensesRow;
