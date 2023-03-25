// CategoryRow.tsx
import React, { useContext } from "react";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import GroupRow from "./GroupRow.tsx";
import styles from "./tableStyles.js";

interface CategoryData {
  name: string;
  groups: Array<GroupData>;
  totals: Array<number>;
}

interface GroupData {
  groupName: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface CategoryRowProps {
  category: CategoryData;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category }) => {
  const { expandedMonth } = useContext<TableContextProps>(TableContext);

  return (
    <>
      {category.groups.map((group, groupIndex) => (
        <GroupRow key={groupIndex} group={group} groupIndex={groupIndex} />
      ))}
      <tr className={styles.categoryRow}>
        <td className={styles.cell}></td>
        <td className={styles.cell}>{category.name}</td>
        {category.totals.map((total, index) => (
          <td className={styles.cell} key={index}>
            {total.toFixed(2)}
          </td>
        ))}
      </tr>
    </>
  );
};

export default CategoryRow;
