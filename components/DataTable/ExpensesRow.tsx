// ExpensesRow.tsx
import React from "react";
import styles from "./tableStyles.js";
import useSelect from '../../hooks/useSelect.tsx'
import { useExpensesContext } from '../../hooks/expensesContext.tsx'
import { DeleteIcon } from '@chakra-ui/icons'

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
const {
    categories,
  groups,
  deleteExpenseHandler,
    fetchExpenses
} = useExpensesContext();
  
  const { selected: selectedCategory, SelectComponent: CategorySelect } =
    useSelect({ options: categories, placeHolder: "category" });
  
  const { selected: selectedGroup, SelectComponent: GroupsSelect } = useSelect({
    options: groups,
    placeHolder: "group",
  });
  const expenseDate = new Date(expense.date)
  const colorStyle = { backgroundColor: color, filter: 'brightness(70%)' }

  const handleDelete = async () => {
    await deleteExpenseHandler({ id: expense.id })
    fetchExpenses()
  }
  return (
    <tr className={styles.expensesRow}>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{GroupsSelect}</td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{CategorySelect}</td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{`${expenseDate.getDate()+1}/${expenseDate.getMonth()+1}`}</td>
      <td colSpan={10} className={`${styles.cell} py-0 border-none ${styles.paddingLeft}`} style={colorStyle}>{expense.name}</td>
      <td className={`${styles.cell} py-0 border-none`} style={colorStyle}>{expense.amount.toFixed(2)}</td>
      <td className={`${styles.cell} py-0 border-none text-center cursor-pointer`} style={colorStyle} onClick={handleDelete}><DeleteIcon /></td>
    </tr>
  );
};

export default ExpensesRow;
