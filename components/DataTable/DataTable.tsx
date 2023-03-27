// Table.tsx
import React, { createContext } from "react";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import TableHeader from "./TableHeader.tsx";
import CategoryRow from "./CategoryRow.tsx";
import tableStyles from "./tableStyles.js";
import useCollapsedState from "../../hooks/useCollapsedState.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface DataTableProps {
  data?: {
    categories: Array<any>;
    summary: Array<number>;
    balance: Array<number>;
  };
}

export interface TableContextProps {
  handleDrop: (draggedExpense: string, targetExpense: string) => void;
}

export const TableContext = createContext<TableContextProps | undefined>(
  undefined
);
//main component
const DataTable: React.FC<DataTableProps> = () => {
  const [collapsedKeys, toggleItemCollapse] = useCollapsedState();
  const {
    categoryGroupExpenses: data,
    colors,
    updateExpenseHandler,
  } = useExpensesContext();

  const { categories, summary, balance } = data;

  if (!Object.keys(data).length) {
    return <div className="text-center py-4">No rows found</div>;
  }

  const handleDrop = (
    expenseId: string,
    targetId: string,
    targetType: string
  ) => {
    // Implement the logic to recategorize and regroup expenses here
    console.log({ expenseId, targetId, targetType });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <TableContext.Provider
        value={{ collapsedKeys, toggleItemCollapse, colors, handleDrop }}
      >
        <table className={`${tableStyles.table} w-full`}>
          <TableHeader />
          <tbody>
            {categories?.map((category, index) => (
              <CategoryRow
                key={index}
                category={category}
                index={index}
                color={colors[index]}
              />
            ))}
            <tr className={tableStyles.summaryRow}>
              <td className={tableStyles.cell} />
              <td className={tableStyles.cell}>Summary</td>
              {summary.map((total, index) => (
                <td className={tableStyles.cell} key={index}>
                  {total.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr className={tableStyles.balanceRow}>
              <td className={tableStyles.cell} />
              <td className={tableStyles.cell}>Balance</td>
              {balance.map((total, index) => (
                <td
                  className={[
                    tableStyles.cell,
                    total > 0 ? tableStyles.positive : tableStyles.negative,
                  ].join(" ")}
                  key={index}
                >
                  {total.toFixed(2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </TableContext.Provider>
    </DndProvider>
  );
};

export default DataTable;
