// CategoryRow.tsx
import React, { useContext, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import GroupRow from "./GroupRow.tsx";
import styles from "./tableStyles.js";
import withDroppable from "./withDroppable.tsx";
import TableCell from "./TableCell.tsx";
interface CategoryData {
  id: string;
  name: string;
  groups: Array<GroupData>;
  totals: Array<number>;
}

interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface CategoryRowProps {
  category: CategoryData;
  index: number;
}
const CategoryRow = forwardRef<HTMLTableRowElement, CategoryRowProps>(
  ({ category }, ref) => {
    const { collapsedKeys, toggleItemCollapse, handleDrop } =
      useContext<TableContextProps>(TableContext);
    const isCollapsed = !collapsedKeys.has(category.id);

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item.id, category.id, "category"),
    });

    const dragDropRef = (instance) => {
      drop(instance);
    };

    return (
      <>
        {!isCollapsed &&
          category.groups.map((group, groupIndex) => (
            <GroupRow key={groupIndex} group={group} category={category} />
          ))}
        <tr
          ref={dragDropRef}
          className={styles.categoryRow}
          onClick={() => toggleItemCollapse(category.id)}
        >
          <td
            className={styles.cell}
            style={{ backgroundColor: category.color }}
          ></td>
          <td
            className={`${styles.cell}`}
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </td>
          {category.totals.map((total, index) => (
            <TableCell
              monthIndex={index}
              className={`${styles.cell} ${total <= 0 ? styles.emptyCell : ""}`}
              key={index}
              style={{ backgroundColor: category.color }}
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
