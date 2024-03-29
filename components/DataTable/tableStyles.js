const baseStyles = {
  table:
    "w-full text-sm shadow-md rounded-lg overflow-hidden mt-10 border-none",
  cell: "px-4 py-2 text-left font-semibold text-white",
  expcell: "py-1 text-left text-white",
  emptyCell: "py-1 text-center font-semibold text-gray-600",
  expandedRowCell: "",
  balancePositive: "py-1 font-semibold text-green-400",
  balanceNegative: "py-1 font-semibold text-red-400",
  paddingLeft: "pl-8",
  categoryRow: "text-gray:600",
  groupRow: "cursor-pointer",
  groupCell: "px-4 py-1 text-left font-semibold text-white",
  expensesRow: "",
  summaryRow: "mt-5 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white",
  balanceRow: "text-white",
  highlighted: "bg-indigo-400",
  highlightedMonth: "",
};

const combinedStyles = {
  table: `${baseStyles.table}`,
  cell: `${baseStyles.cell}`,
  expcell: `${baseStyles.expcell}`,
  emptyCell: `${baseStyles.emptyCell}`,
  balancePositive: `${baseStyles.balancePositive}`,
  balanceNegative: `${baseStyles.balanceNegative}`,
  paddingLeft: `${baseStyles.paddingLeft}`,
  categoryRow: `${baseStyles.categoryRow}`,
  groupRow: `${baseStyles.groupRow}`,
  groupCell: `${baseStyles.groupCell}`,
  expensesRow: `${baseStyles.expensesRow}`,
  summaryRow: `${baseStyles.summaryRow}`,
  balanceRow: `${baseStyles.balanceRow}`,
  positive: `${baseStyles.positive}`,
  negative: `${baseStyles.negative}`,
  highlighted: `${baseStyles.highlighted}`,
};

const styles = { ...baseStyles, ...combinedStyles };
export default styles;
