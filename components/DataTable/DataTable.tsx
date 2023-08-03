// Table.tsx
import React, { createContext, useState } from "react";
import { useExpensesContext } from "../../hooks/expensesContext";
import TableHeader from "./TableHeader";
import CategoryRow, { CategoryData, GroupData } from "./CategoryRow";
import tableStyles from "./tableStyles.js";
import useCollapsedState from "../../hooks/useCollapsedState";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BalanceRow from "./BalanceRow";
import SummaryRow from "./SummaryRow";

interface DataTableProps {
  data?: {
    categories: Array<any>;
    summary: Array<number>;
    balance: Array<number>;
  };
}

export interface TableContextProps {
  isDragging: boolean;
  collapsedKeys?: any;
  toggleItemCollapse?: any;
  selectedMonth?: number;
  hoveredCategory: CategoryData;
  colors: string[];
  setIsDragging: (value: boolean) => void;
  handleCellClick: (
    parentRow: CategoryData | GroupData,
    montIhndex: number
  ) => void;
  setHoveredCategory: (category: CategoryData) => void;
  handleDrop: (draggedExpense: string, targetExpense: string, type) => void;
}

export const TableContext = createContext<TableContextProps | undefined>(
  undefined
);
//main component
const DataTable: React.FC<DataTableProps> = () => {
  const [collapsedKeys, toggleItemCollapse] = useCollapsedState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [hoveredCategory, setHoveredCategory] = useState<CategoryData>();
  const [isDragging, setIsDragging] = useState(false);
  const {
    //categoryGroupExpenses: data,
    groupedExpensesByCategory: categories,
    colors,
    updateExpenseHandler,
    categories: originalCategories,
    groups,
    expenses,
    fetchExpenses,
  } = useExpensesContext();

  const handleDrop = async (
    expenseId: string,
    targetId: string,
    targetType: string
  ) => {
    const expense = expenses.find((exp) => exp.id === expenseId);

    if (!expense) return;

    const originalCategory = expense.category
      ? originalCategories.find((cat) => cat.id === expense.category.id)
      : { id: 0 };
    const originalGroup = expense.group
      ? groups.find((grp) => grp._id === expense.group)
      : { id: 0 };

    let updatedCategory = originalCategory;
    let updatedGroup = originalGroup;

    if (targetType === "category") {
      const targetCategory = originalCategories.find(
        (cat) => cat.id === targetId
      );

      if (targetCategory && targetCategory.id !== originalCategory?.id) {
        updatedCategory = targetCategory;
        updatedGroup = null;
      }
    }

    if (targetType === "group") {
      const targetGroup = groups.find((grp) => grp.id === targetId);
      if (
        targetGroup &&
        (!originalGroup || targetGroup.id !== originalGroup.id)
      ) {
        updatedGroup = targetGroup;
      }
    }

    if (
      (updatedCategory && updatedCategory.id !== originalCategory.id) ||
      (updatedGroup && (!originalGroup || updatedGroup.id !== originalGroup.id))
    ) {
      await updateExpenseHandler({
        id: expense.id,
        body: {
          ...(updatedCategory ? { category: updatedCategory.id } : {}),
          ...(updatedGroup ? { group: updatedGroup.id } : {}),
        },
      });
      fetchExpenses();
    }
  };

  const handleCellClick = (parentRow, monthIndex) => {
    const isCollapsed = !collapsedKeys.has(parentRow.id);
    const columnChange = monthIndex !== selectedMonth;
    if (columnChange) isCollapsed && toggleItemCollapse(parentRow.id);
    if (!columnChange) toggleItemCollapse(parentRow.id);
    setSelectedMonth(monthIndex);
  };

  const balanceCategory = categories.find(
    (category) => category.id === "balance"
  );
  const summaryCategory = categories.find(
    (category) => category.id === "summary"
  );

  const displayCategories = categories.filter((category) => {
    // Filter out the balance category as it will be rendered separately
    if (category.id === "balance") return false;
    if (category.id === "summary") return false;

    // Filter out the uncategorized category if it's empty
    if (category.id === "0" && category.totals[12] <= 0) return false;

    return true;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <TableContext.Provider
        value={{
          collapsedKeys,
          toggleItemCollapse,
          colors,
          handleDrop,
          selectedMonth,
          handleCellClick,
          isDragging,
          setIsDragging,
          setHoveredCategory,
          hoveredCategory,
        }}
      >
        <table className={`${tableStyles.table} w-full`}>
          <TableHeader />
          <tbody>
            {displayCategories?.map((category, index) => (
              //@ts-ignore
              <CategoryRow key={index} category={category} index={index} />
            ))}
            {summaryCategory?.totals && (
              <SummaryRow
                category={summaryCategory}
                color={colors[colors.length - 1]}
              />
            )}
            {balanceCategory?.totals && (
              <BalanceRow
                category={balanceCategory}
                color={colors[colors.length - 1]}
              />
            )}
          </tbody>
        </table>
      </TableContext.Provider>
    </DndProvider>
  );
};

export default DataTable;
