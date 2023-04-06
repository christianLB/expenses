// CategoryRow.tsx
import React from "react";
import styles from "./tableStyles.js";

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
        <td
          className={`${styles.cell} ${
            total <= 0 ? styles.balanceNegative : styles.balancePositive
          }`}
          key={index}
          style={{ backgroundColor: color }}
        >
          {total.toFixed(2)}
        </td>
      ))}
    </tr>
  );
};

export default BalanceRow;
