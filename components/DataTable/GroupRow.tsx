// GroupRow.tsx
import React, { forwardRef, useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { filterByMonth } from "../../parseUtils.ts";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import ExpensesRow from "./ExpensesRow.tsx";
import styles from "./tableStyles.js";
import withDroppable from "./withDroppable.tsx";
import TableCell from "./TableCell.tsx";
import nextStyles from "../../styles/Expenses.module.css";
interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  groupName: string;
  category: any;
}

const GroupRow = forwardRef<HTMLTableRowElement, GroupRowProps>(
  ({ group, category }, ref) => {
    const { selectedMonth, collapsedKeys, toggleItemCollapse, handleDrop } =
      useContext<TableContextProps>(TableContext);
    const isCollapsed = !collapsedKeys.has(group.id);
    const colorStyle = {
      backgroundColor: category.color,
      filter: "brightness(110%)",
    };
    const padding = { paddingLeft: "2.5em", fontSize: "0.7rem" };

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item?.id, group?.id, "group"),
    });

    const dragDropRef = (instance) => {
      drop(instance);
    };

    const filtered = filterByMonth(group.expenses, selectedMonth);

    // If the group is empty, don't render the component
    if (filtered.length === 0) {
      //return null;
    }

    return (
      <>
        {!isCollapsed &&
          filtered.map((expense, expenseIndex) => (
            <ExpensesRow
              key={expense.id}
              expense={expense}
              color={category.color}
              categoryId={expense.category?.id}
              groupId={expense.group?.id}
            />
          ))}
        <tr
          ref={dragDropRef}
          className={`${styles.groupRow} ${nextStyles.groupRow}`}
          onClick={() => toggleItemCollapse(group.id)}
        >
          <TableCell
            className={styles.groupCell}
            style={{ backgroundColor: category.color }}
          ></TableCell>
          <TableCell
            style={{ ...padding, backgroundColor: category.color }}
            className={styles.groupCell}
          >
            {group.name}
          </TableCell>
          {group.totals.map((total, monthIndex) => (
            <TableCell
              key={monthIndex}
              monthIndex={monthIndex}
              style={{
                ...padding,
                backgroundColor: category.color,
              }}
              className={styles.groupCell}
            >
              {total > 0 ? total.toFixed(2) : "-"}
            </TableCell>
          ))}
        </tr>
      </>
    );
  }
);

const DroppableGroupRow = withDroppable(GroupRow);
GroupRow.displayName = "GroupRow";

export default DroppableGroupRow;
