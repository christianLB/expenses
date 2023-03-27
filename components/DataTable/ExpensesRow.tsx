// ExpensesRow.tsx
import React, { forwardRef, useContext } from "react";
import styles from "./tableStyles.js";
import useSelect from "../../hooks/useSelect.tsx";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDrag, useDrop } from "react-dnd";
import withDraggable from "./withDraggable.tsx";
import withDroppable from "./withDroppable.tsx";
import { TableContextProps, TableContext } from "./DataTable.tsx";

interface ExpenseData {
  id: string;
  name: string;
  amount: number;
  date: Date;
}

interface ExpensesRowProps {
  expense: ExpenseData;
  color: string;
  categoryId?: string;
  groupId?: string;
}

const ExpensesRow = forwardRef<HTMLTableRowElement, ExpensesRowProps>(
  (props, ref) => {
    const { expense, color } = props;
    const { categories, groups, deleteExpenseHandler, fetchExpenses } =
      useExpensesContext();

    const { selected: selectedCategory, SelectComponent: CategorySelect } =
      useSelect({
        options: categories,
        placeHolder: "category",
        className: "border-none",
      });
    const { handleDrop } = useContext<TableContextProps>(TableContext);

    const { selected: selectedGroup, SelectComponent: GroupsSelect } =
      useSelect({
        options: groups,
        placeHolder: "group",
        className: "border-none w-full",
      });
    const expenseDate = new Date(expense.date);
    const colorStyle = { backgroundColor: color, filter: "brightness(70%)" };

    const [, drag] = useDrag({
      type: "EXPENSE",
      item: { id: props.expense.id },
    });

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item.id, props.categoryId, props.groupId),
    });

    const dragDropRef = (instance) => {
      drag(drop(instance));
    };

    const handleDelete = async () => {
      await deleteExpenseHandler({ id: expense.id });
      fetchExpenses();
    };
    return (
      <tr ref={dragDropRef} className={styles.expensesRow}>
        <td
          className={`${styles.expcell} py-1 border-none`}
          style={colorStyle}
        ></td>
        <td
          className={`${styles.expcell} py-1 border-none`}
          style={colorStyle}
        ></td>
        <td
          className={`${styles.expcell} py-1 border-none`}
          style={colorStyle}
        >{`${expenseDate.getDate() + 1}/${expenseDate.getMonth() + 1}`}</td>
        <td className={`${styles.expcell} border-none`} style={colorStyle}>
          {expense.amount.toFixed(2)}
        </td>
        <td
          colSpan={10}
          className={`${styles.expcell} border-none ${styles.paddingLeft}`}
          style={colorStyle}
        >
          {expense.name}
        </td>
        <td
          className={`${styles.expcell} border-none text-center cursor-pointer`}
          style={colorStyle}
          onClick={handleDelete}
        >
          <DeleteIcon />
        </td>
      </tr>
    );
  }
);

const DraggableExpensesRow = withDraggable(ExpensesRow);
const DroppableExpensesRow = withDroppable(DraggableExpensesRow);

export default DroppableExpensesRow;
