// GroupRow.tsx
import React, { forwardRef, useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { filterByMonth } from "../../parseUtils.ts";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import ExpensesRow from "./ExpensesRow.tsx";
import styles from "./tableStyles.js";
import withDroppable from "./withDroppable.tsx";

interface GroupData {
  id: string;
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  groupName: string;
  color: string;
}

const GroupRow = forwardRef<HTMLTableRowElement, GroupRowProps>(
  ({ group, color }, ref) => {
    const { collapsedKeys, toggleItemCollapse, handleDrop } =
      useContext<TableContextProps>(TableContext);
    const isCollapsed = !collapsedKeys.has(group.id);
    const colorStyle = { backgroundColor: color, filter: "brightness(90%)" };
    const padding = { paddingLeft: "2.5em", fontSize: "0.7rem" };
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const [, drop] = useDrop({
      accept: "EXPENSE",
      drop: (item: any) => handleDrop(item?.id, group?.id, "group"),
    });

    const dragDropRef = (instance) => {
      drop(instance);
    };
    const handleMonthClick = (e, monthIndex) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedMonth(monthIndex);
    };

    const filtered = filterByMonth(group.expenses, selectedMonth);

    return (
      <>
        {!isCollapsed &&
          filtered.map((expense, expenseIndex) => (
            <ExpensesRow
              key={expense.id}
              expense={expense}
              color={color}
              categoryId={expense.category?.id}
              groupId={expense.group?.id}
            />
          ))}
        <tr
          ref={dragDropRef}
          className={styles.groupRow}
          onClick={() => toggleItemCollapse(group.id)}
        >
          <td className={styles.groupCell} style={colorStyle}></td>
          <td
            style={{ ...colorStyle, ...padding }}
            className={styles.groupCell}
          >
            {group.name}
          </td>
          {group.totals.map((total, monthIndex) => (
            <td
              key={monthIndex}
              style={{ ...colorStyle, ...padding }}
              className={`${monthIndex === selectedMonth ? "border" : ""}`}
              onClick={(e) => {
                total > 0 && handleMonthClick(e, monthIndex);
              }}
            >
              {total.toFixed(2)}
            </td>
          ))}
        </tr>
      </>
    );
  }
);

const DroppableGroupRow = withDroppable(GroupRow);
GroupRow.displayName = "GroupRow";

export default DroppableGroupRow;
