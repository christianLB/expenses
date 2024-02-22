// Table.tsx
import React, { createContext, useRef, useState } from "react";
import { useExpensesContext } from "../../hooks/expensesContext";
import TableHeader from "./TableHeader";
import CategoryRow, { CategoryData, GroupData } from "./CategoryRow";
import tableStyles from "./tableStyles.js";
import useCollapsedState from "../../hooks/useCollapsedState";
import BalanceRow from "./BalanceRow";
import SummaryRow from "./SummaryRow";
import SortableList from "../SortableList";
import useToggleList from "../../hooks/useToggleList";
import useExpandables from "../../hooks/useExpandables";
import { Table } from "@mantine/core";
import Table2 from "../DataTable2/DataTable2";

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
interface ICategory {
  [key: string]: any;
}
interface IProps {
  data: ICategory[];
}
//main component
const DataTable: React.FC<DataTableProps> = ({
  data: categories,
}: DataTableProps) => {
  const [collapsedKeys, toggleItemCollapse] = useCollapsedState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [hoveredCategory, setHoveredCategory] = useState<CategoryData>();
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, toggleExpanded] = useState(false);

  const contentRef = useRef(null);

  const {
    list: selectedExpenses,
    toggleItem: handleSelectExpense,
    toggleAll: handleSelectAll,
    isAllSelected,
  } = useToggleList();

  const {
    //categoryGroupExpenses: data,
    //groupedExpensesByCategory: categories,
    colors,
    categoriesCollection: {
      update: updateCategoryHandler,
      fetchAll: fetchCategories,
    },
    expensesCollection: { fetchAll: fetchExpenses },
  } = useExpensesContext();

  const handleCellClick = (parentRow, monthIndex) => {
    const isCollapsed = !collapsedKeys.has(parentRow.id);
    const columnChange = monthIndex !== selectedMonth;
    if (columnChange) isCollapsed && toggleItemCollapse(parentRow.id);
    if (!columnChange) toggleItemCollapse(parentRow.id);
    setSelectedMonth(monthIndex);
  };

  //@ts-ignore
  const balanceCategory = categories?.find(
    (category) => category.id === "balance"
  );
  //@ts-ignore
  const summaryCategory = categories?.find(
    (category) => category.id === "summary"
  );
  //@ts-ignore
  const uncategorizedCategory = categories?.find(
    (category) => category.id === "0"
  );
  //@ts-ignore
  const incomeCategory = categories?.find(
    (category) => category.id === "income"
  );
  //@ts-ignore
  const sortableCategories = categories?.filter((category) => {
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

  const [isCollapsed, toggleCollapse] = useState(true);
  const { getExpandableProps } = useExpandables();
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
      <Table withRowBorders={false} c={"gray.1"}>
        <TableHeader />
        <CategoryRow {...{ ...incomeCategory }} sortable={false} />
        {sortableCategories.map((category) => (
          <CategoryRow key={category.id} sortable={false} {...category} />
        ))}
        {!!uncategorizedCategory?.expenses?.length && (
          <CategoryRow
            {...{
              ...uncategorizedCategory,
              sortable: false,
            }}
          />
        )}
        <CategoryRow
          sortable={false}
          {...summaryCategory}
          color={colors[colors.length - 1]}
        />
        <CategoryRow
          sortable={false}
          {...balanceCategory}
          color={colors[colors.length - 1]}
        />
      </Table>
    </TableContext.Provider>
  );
};

export default DataTable;
