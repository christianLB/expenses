import React, { Fragment } from "react";
//@ts-ignore
import TrashIcon from "../components/trashIcon.tsx";

const gridStyles = "w-full bg-white shadow-xs rounded-md grid grid-cols-8";
const headStyles =
  "text-sm font-small text-gray-600 uppercase tracking-wide border";
const cellStyles = "px-4 py-2 text-xs font-medium text-gray-700 border";
const iconButtonStyles = "w-8 h-8 cursor-pointer";
const selectedStyles = "border-blue-700";

function ExpenseTable({ expenses, onDelete, onSelect, selectedExpense }) {
  const selectExpenseHandler = (expense) => {
    onSelect(expense);
  };

  return (
    <div className={gridStyles}>
      <div className={`${cellStyles} ${headStyles}`}></div>
      <div className={`${cellStyles} ${headStyles}`}>Amount</div>
      <div className={`${cellStyles} ${headStyles}`}>Type</div>
      <div className={`${cellStyles} ${headStyles}`}>Date</div>
      <div className={`${cellStyles} ${headStyles}`}>Payments remaining</div>
      <div className={`${cellStyles} ${headStyles}`}>Due date</div>
      <div className={`${cellStyles} ${headStyles}`}>Name</div>
      <div className={`${cellStyles} ${headStyles}`}>Description</div>
      {expenses?.map((expense) => (
        <Fragment key={expense.id}>
          <div
            className={`${cellStyles} ${
              expense.id == selectedExpense?.id ? selectedStyles : ""
            }`.trim()}
            onClick={() => selectExpenseHandler(expense)}
          >
            {
              <TrashIcon
                className={iconButtonStyles}
                onClick={() => onDelete(expense.id)}
              />
            }
          </div>
          <div className={cellStyles}>{expense.amount}</div>
          <div className={cellStyles}>
            {expense.type === "FIXED_EXPENSE"
              ? expense.fixedExpense.name
              : expense.type}
          </div>
          <div className={cellStyles}>{expense.date}</div>
          <div className={cellStyles}>{expense.paymentsRemaining}</div>
          <div className={cellStyles}>{expense.dueDate}</div>
          <div className={cellStyles}>{expense.name}</div>
          <div className={cellStyles}>{expense.description}</div>
        </Fragment>
      ))}
    </div>
  );
}

export default ExpenseTable;
