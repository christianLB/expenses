// CategoryRow.tsx
import React, { useState } from "react";
import GroupRow from "./GroupRow.tsx";
import ExpensesRow from "./ExpensesRow.tsx";
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
  const [collapsedCategory, setCollapsedCategory] = useState(true);
  const [collapsedGroup, setCollapsedGroup] = useState(true);

  const toggleCategoryCollapse = () => {
    setCollapsedCategory(!collapsedCategory);
  };

  const toggleGroupCollapse = () => {
    setCollapsedGroup(!collapsedGroup);
  };

  return (
    <>
      <tr className={styles.categoryRow}>
        <td
          onClick={toggleCategoryCollapse}
          style={{ cursor: "pointer" }}
          className={styles.cell}
        >
          {collapsedCategory ? "+" : "-"}
        </td>
        <td className={styles.cell}>{category.name}</td>
        {category.totals.map((total, index) => (
          <td className={styles.cell} key={index}>
            {total.toFixed(2)}
          </td>
        ))}
      </tr>
      {!collapsedCategory &&
        category.groups.map((group, index) => (
          <React.Fragment key={index}>
            <GroupRow group={group} onToggle={toggleGroupCollapse} />
            {!collapsedGroup &&
              group.expenses.map((expense, idx) => (
                <ExpensesRow key={idx} expense={expense} />
              ))}
          </React.Fragment>
        ))}
    </>
  );
};

export default CategoryRow;
