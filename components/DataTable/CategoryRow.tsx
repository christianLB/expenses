// CategoryRow.tsx
import React, { useContext, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { TableContext, TableContextProps } from "./DataTable";
import styles from "./tableStyles.js";
import withDroppable from "./withDroppable";
import TableCell from "./TableCell";
import CategoryDetail from "./CategoryDetail";
export interface CategoryData {
  id: string;
  name: string;
  color: string;
  groups: Array<GroupData>;
  totals: Array<number>;
}

export interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface CategoryRowProps extends CategoryData {
  key: number;
  category?: CategoryData;
  index: number;
  draggableProps: any;
  dragListeners: any;
}
const CategoryRow = forwardRef<HTMLTableRowElement, CategoryRowProps>(
  (category, ref) => {
    const {
      collapsedKeys,
      toggleItemCollapse,
      handleDrop,
      handleCellClick,
      setHoveredCategory,
      hoveredCategory,
    } = useContext<TableContextProps>(TableContext);

    const { draggableProps, dragListeners } = category;
    const isCollapsed = !collapsedKeys.has(category?.id);
    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item.id, category.id, "category"),
    });

    const dragDropRef = (instance) => {
      drop(instance);
    };
    const isIncome = category?.name === "Income";
    const isHovered = category?.id === hoveredCategory?.id;
    return (
      <>
        <CategoryDetail category={category} />
        <tr
          ref={dragDropRef}
          className={`${styles.categoryRow}`}
          //onClick={() => toggleItemCollapse(category.id)}
          //{...draggableProps}
        >
          <td
            className={styles.cell}
            style={{ backgroundColor: category?.color }}
          ></td>
          <td
            className={`cursor-pointer text-white text-base ${styles.cell} ${
              !isCollapsed || isIncome || isHovered
                ? styles.expandedRowCell
                : ""
            }`}
            style={{
              background: category?.color
                ? `linear-gradient(to right, ${category.color} 0%, ${category.color} 80%, ${category.color}80 150%)`
                : "",
            }}
          >
            {(isCollapsed && category?.name) || ""}
          </td>

          {category?.totals.map((total, index) => (
            <TableCell
              monthIndex={index}
              className={`${styles.cell} ${
                total <= 0 ? styles.emptyCell : ""
              } ${isIncome || isHovered ? styles.expandedRowCell : ""}`}
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
        </tr>
      </>
    );
  }
);

const DroppableExpensesRow = withDroppable(CategoryRow);

CategoryRow.displayName = "CategoryRow";
export default DroppableExpensesRow;
