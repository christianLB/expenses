import React from "react";

type IFixedExpense = {
  id: number;
  name: string;
  category: string;
  description: string;
};

interface IProps {
  fixedExpenses: IFixedExpense[];
}

const FixedExpenseList = ({ fixedExpenses }: IProps) => {
  const listStyles = "bg-white rounded-lg shadow-lg overflow-hidden";
  const itemStyles =
    "flex items-center px-5 py-3 font-medium text-sm leading-5 text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out";

  return (
    <ul className={listStyles}>
      {fixedExpenses?.map((expense) => (
        <li key={expense.id} className={itemStyles}>
          {expense.name}
        </li>
      ))}
    </ul>
  );
};

export default FixedExpenseList;
