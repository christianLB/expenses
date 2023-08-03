// CategoryRow.tsx
import React, { useContext, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { TableContext, TableContextProps } from "./DataTable";
import GroupRow from "./GroupRow";
import styles from "./tableStyles.js";
import withDroppable from "./withDroppable";
import TableCell from "./TableCell";
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

interface CategoryRowProps {
  key: number;
  category?: CategoryData;
  index: number;
}
const CategoryRow = forwardRef<HTMLTableRowElement, CategoryRowProps>(
  ({ category }, ref) => {
    const {
      collapsedKeys,
      toggleItemCollapse,
      handleDrop,
      handleCellClick,
      setHoveredCategory,
      hoveredCategory,
    } = useContext<TableContextProps>(TableContext);
    const isCollapsed = !collapsedKeys.has(category.id);

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item.id, category.id, "category"),
    });

    const dragDropRef = (instance) => {
      drop(instance);
    };
    const isIncome = category.name === "Income";
    const isHovered = category.id === hoveredCategory?.id;
    return (
      <>
        {!isCollapsed &&
          category.groups.map((group, groupIndex) => (
            //@ts-ignore
            <GroupRow key={groupIndex} group={group} category={category} />
          ))}
        <tr
          ref={dragDropRef}
          className={`${styles.categoryRow}`}
          //onClick={() => toggleItemCollapse(category.id)}
        >
          <td
            className={styles.cell}
            style={{ backgroundColor: category.color }}
          ></td>
          <td
            className={`cursor-pointer text-white ${styles.cell} ${
              !isCollapsed || isIncome || isHovered
                ? styles.expandedRowCell
                : ""
            }`}
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </td>
          {category.totals.map((total, index) => (
            <TableCell
              monthIndex={index}
              className={`${styles.cell} ${
                total <= 0 ? styles.emptyCell : ""
              } ${
                !isCollapsed || isIncome || isHovered
                  ? styles.expandedRowCell
                  : ""
              }`}
              key={index}
              style={{
                backgroundColor:
                  !isCollapsed || isIncome || isHovered ? category.color : "",
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
