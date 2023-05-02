const getContrastingTextColor = (backgroundColor) => {
  const color = backgroundColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "text-black" : "text-white";
};

const baseStyles = {
  table:
    "w-full text-sm bg-white shadow-md rounded-lg overflow-hidden border-collapse mt-10",
  cell: "border-b border-gray-300 px-4 py-2 text-left font-semibold",
  expcell:
    "border-b border-gray-300 py-1 text-left font-semibold text-gray-100",
  emptyCell:
    "border-b border-gray-100 py-1 text-center font-semibold text-gray-100",
  balancePositive: "border-b border-gray-100 py-1 font-semibold text-green-500",
  balanceNegative: "border-b border-gray-100 py-1 font-semibold text-red-500",
  paddingLeft: "pl-8",
  categoryRow: "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white",
  groupRow: "bg-indigo-200 cursor-pointer hover:bg-indigo-300",
  groupCell: "border-b border-gray-300 px-4 py-2 text-left font-semibold",
  expensesRow: "bg-white hover:bg-gray-100",
  summaryRow: "mt-5 bg-gradient-to-r from-indigo-700 to-indigo-600 text-white",
  balanceRow: "bg-gradient-to-r from-indigo-800 to-indigo-700 text-white",
  positive: "text-green-600 font-bold",
  negative: "text-red-600 font-bold",
  highlighted: "bg-indigo-400",
  highlightedMonth: "border",
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
  groupRow: `${baseStyles.groupRow} ${getContrastingTextColor("#cbd5e0")}`,
  groupCell: `${baseStyles.groupCell}`,
  expensesRow: `${baseStyles.expensesRow} font-medium`,
  summaryRow: `${baseStyles.summaryRow}`,
  balanceRow: `${baseStyles.balanceRow}`,
  positive: `${baseStyles.positive}`,
  negative: `${baseStyles.negative}`,
  highlighted: `${baseStyles.highlighted}`,
};

export default { ...baseStyles, ...combinedStyles };
