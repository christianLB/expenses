// GroupRow.tsx
import React from "react";
import styles from "./tableStyles.js";

interface GroupData {
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  onToggle: () => void;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, onToggle }) => {
  return (
    <tr
      onClick={onToggle}
      style={{ cursor: "pointer" }}
      className={styles.groupRow}
    >
      <td></td>
      <td style={{ paddingLeft: "1.5em" }}>{group.groupName}</td>
      {group.totals.map((total, index) => (
        <td key={index}>{total.toFixed(2)}</td>
      ))}
    </tr>
  );
};

export default GroupRow;
