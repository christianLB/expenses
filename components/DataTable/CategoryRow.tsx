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
  index: number;
  color: string;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, color }) => {
   const { collapsedKeys, toggleItemCollapse } =
    useContext<TableContextProps>(TableContext);

  const categoryKey = `category-${category.name}`;

  const isCollapsed = !collapsedKeys.has(categoryKey);

  const handleCategoryClick = () => {
    toggleItemCollapse(categoryKey);
  };

  return (
    <>
      {!isCollapsed &&
        category.groups.map((group, groupIndex) => (
          <GroupRow key={groupIndex} group={group} groupName={group.groupName} color={color}/>
        ))}
      <tr className={styles.categoryRow} onClick={handleCategoryClick}>
         <td className={styles.cell} style={{backgroundColor:color}}></td>
        <td className={styles.cell} style={{backgroundColor:color}}>{category.name}</td>
        {category.totals.map((total, index) => (
          <td className={styles.cell} key={index} style={{backgroundColor:color}}>
            {total.toFixed(2)}
          </td>
        ))}
      </tr>
    </>
  );
};

export default CategoryRow;
