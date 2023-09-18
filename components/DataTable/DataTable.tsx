// Table.tsx
import React, { createContext, useState } from "react";
import { useExpensesContext } from "../../hooks/expensesContext";
import TableHeader from "./TableHeader";
import CategoryRow, { CategoryData, GroupData } from "./CategoryRow";
import tableStyles from "./tableStyles.js";
import useCollapsedState from "../../hooks/useCollapsedState";
import BalanceRow from "./BalanceRow";
import SummaryRow from "./SummaryRow";
import SortableList from "../SortableList";
import useToggleList from "../../hooks/useToggleList";
import { group } from "console";
import ExpandablePanel from "../ExpandablePanel";

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
  handleSelectExpense: (expenseId: string) => void;
  isAllSelected: (group: any) => boolean;
  handleSelectAll: (group: any) => void;
  selectedExpenses: string[];
  setHoveredCategory: (category: CategoryData) => void;
  categories: any;
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
  const [expanded, toggleExpanded] = useState(false);

  const {
    list: selectedExpenses,
    toggleItem: handleSelectExpense,
    toggleAll: handleSelectAll,
    isAllSelected,
  } = useToggleList();

  const {
    //categoryGroupExpenses: data,
    groupedExpensesByCategory: categories,
    colors,
    categories: originalCategories,
    updateCategoryHandler,
    fetchExpenses,
    fetchCategories,
  } = useExpensesContext();

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
  const uncategorizedCategory = categories.find(
    (category) => category.id === "0"
  );
  const incomeCategory = categories.find(
    (category) => category.id === "income"
  );

  const sortableCategories = categories.filter((category) => {
    // Filter out the balance category as it will be rendered separately
    const hiddenCategories = [
      incomeCategory,
      balanceCategory,
      summaryCategory,
      uncategorizedCategory,
    ];
    if (hiddenCategories.includes(category)) return false;

    // Filter out the uncategorized category if it's empty
    if (category === uncategorizedCategory && category.totals[12] <= 0)
      return false;

    return true;
  });

  const handleSortChange = async ({ sortedList }) => {
    // sortedList ya está ordenada, sólo tenemos que actualizar los campos 'order'
    for (let i = 0; i < sortedList.length; i++) {
      const item = sortedList[i];
      const newOrder = i; // El nuevo orden simplemente es el índice en la lista ordenada

      // Actualizar el orden en el servidor usando updateCategoryHandler
      await updateCategoryHandler({
        id: item.id, // Asume que cada ítem tiene un id
        body: {
          order: newOrder,
        },
      });
    }

    // Recargar la lista de gastos, si es necesario
    await fetchCategories();
    fetchExpenses();
  };

  return (
    <TableContext.Provider
      value={{
        collapsedKeys,
        toggleItemCollapse,
        colors,
        isAllSelected,
        selectedMonth,
        handleSelectAll,
        handleCellClick,
        handleSelectExpense,
        isDragging,
        selectedExpenses,
        setIsDragging,
        setHoveredCategory,
        hoveredCategory,
        categories,
      }}
    >
      <div className={`${tableStyles.table} w-full`}>
        <TableHeader />
        <CategoryRow {...{ ...incomeCategory }} sortable={false} />
        <SortableList
          items={sortableCategories}
          ItemComponent={CategoryRow}
          onSort={handleSortChange}
        />
        {/* <ExpandablePanel
            show={true}
            dependencies={[selectedMonth]}
          ></ExpandablePanel> */}
        <CategoryRow
          {...{
            ...uncategorizedCategory,
            sortable: false,
          }}
        />
        {summaryCategory?.totals && (
          <SummaryRow
            category={summaryCategory}
            color={colors[colors.length - 1]}
            onClick={() => toggleExpanded(!expanded)}
          />
        )}
        {balanceCategory?.totals && (
          <BalanceRow
            category={balanceCategory}
            color={colors[colors.length - 1]}
          />
        )}
      </div>
    </TableContext.Provider>
  );
};

export default DataTable;
