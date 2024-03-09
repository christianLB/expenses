// CategoryRow.tsx
import React, { useContext, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import styles from "./tableStyles.js";
import TableCell from "./TableCell";
import CategoryDetail from "./CategoryDetail";
import { Table, Text } from "@mantine/core";

import nextStyles from "../../styles/Expenses.module.css";

export interface CategoryData {
  id?: string;
  name?: string;
  color?: string;
  groups?: Array<GroupData>;
  totals?: Array<number>;
}

export interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface CategoryRowProps extends CategoryData {
  key?: number;
  category?: CategoryData;
  sortableProps?: any;
  dragListeners?: any;
  sortable: boolean;
  expenseGroups?: any;
  expenseCategories?: any;
}

const CategoryRow = (props: CategoryRowProps) => {
  const {
    collapsedKeys,
    handleCellClick,
    setHoveredCategory,
    hoveredCategory,
  } = useContext<TableContextProps>(TableContext);

  const {
    sortableProps,
    dragListeners,
    sortable = true,
    expenseGroups,
    expenseCategories,
    ...category
  } = props;
  const isCollapsed = !collapsedKeys.has(category?.id);
  const isIncome = category?.name === "Income";
  const isHovered = category?.id === hoveredCategory?.id;

  return (
    <>
      <CategoryDetail
        category={category}
        expenseGroups={expenseGroups}
        expenseCategories={expenseCategories}
      />
      <Table.Tr>
        <Table.Td
          style={{
            background: !isCollapsed ? category?.color : "",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Text fw="700" c="gray.8">
            {(isCollapsed && category?.name) || ""}
          </Text>
        </Table.Td>

        {category?.totals?.map((total, index) => (
          <TableCell
            monthIndex={index}
            key={index}
            style={{
              backgroundColor:
                isCollapsed || !isCollapsed || isIncome || isHovered
                  ? category.color
                  : "",
            }}
            onClick={() => handleCellClick(category, index)}
            onMouseMove={() => setHoveredCategory(category)}
          >
            {total === 0 ? "-" : total.toFixed(2)}
          </TableCell>
        ))}
      </Table.Tr>
    </>
  );
};

export default CategoryRow;
