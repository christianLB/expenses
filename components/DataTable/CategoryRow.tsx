// CategoryRow.tsx
import React, { useContext, forwardRef } from "react";
import { useDrop } from "react-dnd";
import { TableContext, TableContextProps } from "./DataTable.tsx";
import GroupRow from "./GroupRow.tsx";
import styles from "./tableStyles.js";
import withDroppable from './withDroppable.tsx'

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
const CategoryRow = forwardRef<HTMLTableRowElement, CategoryRowProps>(({ category, color }, ref) => {
  const { collapsedKeys, toggleItemCollapse, handleDrop } = useContext<TableContextProps>(TableContext);
  const isCollapsed = !collapsedKeys.has(category.id);

  const [, drop] = useDrop({
    accept: "EXPENSE",
    drop: (item: any) => handleDrop(item.id, category.id, 'category'),
  });

  const dragDropRef = (instance) => {
    drop(instance);
  };

  return (
    <>
      {!isCollapsed &&
        category.groups.map((group, groupIndex) => (
          <GroupRow key={groupIndex} group={group} color={color}/>
        ))}
      <tr ref={dragDropRef} className={styles.categoryRow} onClick={() => toggleItemCollapse(category.id)}>
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
});

const DroppableExpensesRow = withDroppable(CategoryRow);

export default DroppableExpensesRow;