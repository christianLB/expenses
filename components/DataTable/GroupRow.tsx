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
  groupName: string;
  color: string;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, groupName, color }) => {
   const { collapsedKeys, toggleItemCollapse } =
    useContext<TableContextProps>(TableContext);

  const groupKey = `group-${groupName}`;
  const isCollapsed = !collapsedKeys.has(groupKey);

  const handleGroupClick = () => {
    toggleItemCollapse(groupKey);
  };

  const colorStyle = { backgroundColor: color, filter: 'brightness(90%)' }
  const padding = {paddingLeft: "2.5em", fontSize: "0.7rem"}
  
  return (
     <>
      {!isCollapsed &&
        group.expenses.map((expense, expenseIndex) => (
          <ExpensesRow key={expenseIndex} expense={expense} />
        ))}
      <tr className={styles.groupRow} onClick={handleGroupClick}>
        <td className={styles.groupCell} style={colorStyle}></td>
        <td
          style={{ ...colorStyle, ...padding }}
          className={styles.groupCell}
        >
          {group.groupName}
        </td>
        {group.totals.map((total, monthIndex) => (
          <td
            key={monthIndex} 
            style={{...colorStyle, ...padding}}
          >
            {total.toFixed(2)}
          </td>
        ))}
      </tr>
    </>
  );
};

export default GroupRow;
