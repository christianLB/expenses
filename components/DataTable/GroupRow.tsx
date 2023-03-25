// GroupRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import ExpensesRow from "./ExpensesRow.tsx";
import styles from "./tableStyles.js";

interface GroupData {
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  groupIndex: number;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, groupIndex }) => {
  const { expandedMonth, setExpandedMonth } =
    useContext<TableContextProps>(TableContext);

  const handleMonthClick = (monthIndex: number) => {
    if (
      expandedMonth?.groupIndex === groupIndex &&
      expandedMonth?.monthIndex === monthIndex
    ) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth({ groupIndex, monthIndex });
    }
  };

  return (
    <>
      <tr className={styles.groupRow}>
        <td className={styles.groupCell}></td>
        <td
          className={styles.groupCell}
          style={{ paddingLeft: "2.5em", fontSize: "0.7rem" }}
        >
          {group.groupName}
        </td>
        {group.totals.map((total, monthIndex) => (
          <td
            key={monthIndex}
            onClick={() => handleMonthClick(monthIndex)}
            className={[
              styles.groupCell,
              expandedMonth?.groupIndex === groupIndex &&
              expandedMonth?.monthIndex === monthIndex
                ? styles.highlighted
                : "",
            ].join(" ")}
          >
            {total.toFixed(2)}
          </td>
        ))}
      </tr>
      {expandedMonth?.groupIndex === groupIndex &&
        group.expenses.map((expense, expenseIndex) => (
          <ExpensesRow key={expenseIndex} expense={expense} />
        ))}
    </>
  );
};

export default GroupRow;
