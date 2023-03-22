// Table.tsx
import React from "react";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import TableHeader from "./TableHeader.tsx";
import CategoryRow from "./CategoryRow.tsx";
import tableStyles from "./tableStyles.js";
interface DataTableProps {
  data?: {
    categories: Array<any>;
    summary: Array<number>;
    balance: Array<number>;
  };
}

const DataTable: React.FC<DataTableProps> = () => {
  const { categoryGroupExpenses: data } = useExpensesContext();

  if (!Object.keys(data).length) {
    return <div className="text-center py-4">No rows found</div>;
  }

  const { categories, summary, balance } = data;

  return (
    <table className={`${tableStyles.table} w-full`}>
      <TableHeader />
      <tbody>
        {categories?.map((category, index) => (
          <CategoryRow key={index} category={category} />
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
  );
};

export default DataTable;
