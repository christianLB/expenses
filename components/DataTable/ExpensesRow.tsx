// ExpensesRow.tsx
import React, { forwardRef, useContext, useEffect } from "react";
import styles from "./tableStyles.js";
import useSelect from "../../hooks/useSelect.tsx";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
//import { DeleteIcon, Icon } from "@chakra-ui/icons";
import { DragSourceMonitor, useDrag, useDrop } from "react-dnd";
import withDraggable from "./withDraggable.tsx";
//import withDroppable from "./withDroppable.tsx";
import { TableContextProps, TableContext } from "./DataTable.tsx";
import useIcon from "../../hooks/useIcon.tsx";

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
    const { handleDrop, setIsDragging } =
      useContext<TableContextProps>(TableContext);

    const { selected: selectedGroup, SelectComponent: GroupsSelect } =
      useSelect({
        options: groups,
        placeHolder: "group",
        className: "border-none w-full",
      });
    const expenseDate = new Date(expense.date);
    const colorStyle = { backgroundColor: color, filter: "brightness(120%)" };

    const [{ isDragging }, drag] = useDrag({
      type: "EXPENSE",
      item: { id: props.expense.id },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    useEffect(() => {
      if (isDragging) setIsDragging(isDragging);
      else setTimeout(() => setIsDragging(isDragging), 1000);
    }, [isDragging]);
    // const [, drop] = useDrop({
    //   accept: "EXPENSE",
    //   drop: (item: any) => handleDrop(item.id, props.categoryId, props.groupId),
    // });

    const dragDropRef = (instance) => {
      //drag(drop(instance));
      drag(instance);
    };

    const handleDelete = async () => {
      await deleteExpenseHandler({ id: expense.id });
      fetchExpenses();
    };

    //const DeleteIcon = useIcon("FaTrash");
    const isEmpty = expense.amount <= 0;

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
        >{`${expenseDate.getDate()}/${expenseDate.getMonth() + 1}`}</td>
        <td className={`${styles.expcell} border-none`} style={colorStyle}>
          {isEmpty ? "-" : expense.amount.toFixed(2)}
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
          X{/* <DeleteIcon /> */}
        </td>
      </tr>
    );
  }
);

const DraggableExpensesRow = withDraggable(ExpensesRow);
//const DroppableExpensesRow = withDroppable(DraggableExpensesRow);
//const DroppableExpensesRow = withDroppable(ExpensesRow);

export default DraggableExpensesRow;
