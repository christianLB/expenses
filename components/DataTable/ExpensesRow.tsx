// ExpensesRow.tsx
import React from "react";
import styles from "./tableStyles.js";

interface ExpenseData {
  id: string;
  name: string;
  amount: number;
  date: Date;
}

interface ExpensesRowProps {
  expense: ExpenseData;
  color: string
}

const ExpensesRow: React.FC<ExpensesRowProps> = ({ expense, color }) => {
  const expenseDate = new Date(expense.date)
  const colorStyle = { backgroundColor: color, filter: 'brightness(70%)' }

  return (
    <tr className={styles.expensesRow}>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}></td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}></td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{`${expenseDate.getDate()+1}/${expenseDate.getMonth()+1}`}</td>
      <td colSpan={11} className={`${styles.cell} py-0 border-none ${styles.paddingLeft}`} style={colorStyle}>{expense.name}</td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{expense.amount.toFixed(2)}</td>
    </tr>
  );
};

export default ExpensesRow;
