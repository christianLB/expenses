// TableHeader.tsx
import React from "react";
import styles from "./tableStyles.js";

interface TableHeaderProps {}

const TableHeader: React.FC<TableHeaderProps> = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Total",
  ];

  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th className={styles.columnHeader}></th>
        <th className={styles.columnHeader}>Category/Group</th>
        {months.map((month, index) => (
          <th className={styles.columnHeader} key={index}>
            {month}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
