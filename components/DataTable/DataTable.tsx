// Table.tsx
import React, {
  createContext,
} from "react";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import TableHeader from "./TableHeader.tsx";
import CategoryRow from "./CategoryRow.tsx";
import tableStyles from "./tableStyles.js";
import useCollapsedState from "../../hooks/useCollapsedState.tsx";
interface DataTableProps {
  data?: {
    categories: Array<any>;
    summary: Array<number>;
    balance: Array<number>;
  };
}

export interface TableContextProps {
 
}

export const TableContext = createContext<TableContextProps | undefined>(
  undefined
);
//main component
const DataTable: React.FC<DataTableProps> = () => {
  const [collapsedKeys, toggleItemCollapse] = useCollapsedState();
  const { categoryGroupExpenses: data } = useExpensesContext();

  if (!Object.keys(data).length) {
    return <div className="text-center py-4">No rows found</div>;
  }

  const { categories, summary, balance } = data;
  const colors = [
  "#1E88E5", // Blue
  "#43A047", // Green
  "#FB8C00", // Orange
  "#F4511E", // Deep Orange
  "#6D4C41", // Brown
  "#3949AB", // Indigo
  "#00897B", // Teal
  "#7B1FA2", // Purple
  "#D81B60", // Pink
  "#546E7A", // Blue Grey
];

  return (
    <TableContext.Provider value={{ collapsedKeys, toggleItemCollapse, colors }}>
      <table className={`${tableStyles.table} w-full`}>
        <TableHeader />
        <tbody>
          {categories?.map((category, index) => (
            <CategoryRow key={index} category={category} index={index} color={colors[index]}/>
          ))}
          <tr className={tableStyles.summaryRow}>
            <td className={tableStyles.cell} />
            <td className={tableStyles.cell}>Summary</td>
            {summary.map((total, index) => (
              <td className={tableStyles.cell} key={index}>
                {total.toFixed(2)}
              </td>
            ))}
          </tr>
          <tr className={tableStyles.balanceRow}>
            <td className={tableStyles.cell} />
            <td className={tableStyles.cell}>Balance</td>
            {balance.map((total, index) => (
              <td
                className={[
                  tableStyles.cell,
                  total > 0 ? tableStyles.positive : tableStyles.negative,
                ].join(" ")}
                key={index}
              >
                {total.toFixed(2)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </TableContext.Provider>
  );
};

export default DataTable;
