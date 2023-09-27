// CategoryRow.tsx
import React, { useContext, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import styles from "./tableStyles.js";
import TableCell from "./TableCell";
import CategoryDetail from "./CategoryDetail";

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
}

const CategoryRow = (props: CategoryRowProps) => {
  const {
    collapsedKeys,
    handleCellClick,
    setHoveredCategory,
    hoveredCategory,
  } = useContext<TableContextProps>(TableContext);

  const { sortableProps, dragListeners, sortable = true, ...category } = props;
  const isCollapsed = !collapsedKeys.has(category?.id);
  const isIncome = category?.name === "Income";
  const isHovered = category?.id === hoveredCategory?.id;

  return (
    <div className={`text-gray:600`} {...sortableProps}>
      <CategoryDetail category={category} />
      <div className={`${nextStyles.gridtable}`}>
        <div
          {...dragListeners}
          className={`cursor-grabbing text-white text-base ${styles.cell} ${
            !isCollapsed || isIncome || isHovered ? styles.expandedRowCell : ""
          } select-none flex`}
          style={{
            background: category?.color,
            //? `linear-gradient(to right, ${category.color} 0%, rgba(${category.color}, 0.8) 80%, rgba(${category.color}, 0.5) 150%)`
            //: "",
          }}
        >
          {(isCollapsed && category?.name) || ""}
        </div>

        {category?.totals?.map((total, index) => (
          <TableCell
            monthIndex={index}
            className={`${styles.cell} ${total <= 0 ? styles.emptyCell : ""} ${
              isIncome || isHovered ? styles.expandedRowCell : ""
            }`}
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
            {total > 0 ? total.toFixed(2) : "-"}
          </TableCell>
        ))}
      </div>
    </div>
  );
};

export default CategoryRow;
