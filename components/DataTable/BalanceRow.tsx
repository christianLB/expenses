// CategoryRow.tsx
import React from "react";
import styles from "./tableStyles.js";
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
  color: string;
}
const BalanceRow = ({ category, color }) => {
  return (
    <tr className={styles.categoryRow}>
      <td className={styles.cell} style={{ backgroundColor: color }}></td>
      <td className={styles.cell} style={{ backgroundColor: color }}>
        {"Balance"}
      </td>
      {category.totals.map((total, index) => (
        <TableCell
          monthIndex={index}
          className={`${styles.cell} ${
            total <= 0 ? styles.balanceNegative : styles.balancePositive
          }`}
          key={index}
          style={{ backgroundColor: color }}
        >
          {total.toFixed(2)}
        </TableCell>
      ))}
    </tr>
  );
};

export default BalanceRow;
