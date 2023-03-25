const tableStyles = {
  table: `
    w-full
    text-xs
    bg-white
    shadow-md
    rounded-lg
    overflow-hidden
    border-collapse
    mt-10
  `,
  cell: `
    border-b
    border-gray-300
    px-4
    py-2
    text-left
    font-semibold
  `,
  paddingLeft: `
    pl-8
  `,
  categoryRow: `
    bg-gradient-to-r
    from-indigo-600
    to-indigo-500
    text-white
  `,
  groupRow: `
    bg-indigo-200
    cursor-pointer
    hover:bg-indigo-300
  `,
  groupCell: `
    border-b
    border-gray-300
    px-4
    py-2
    text-left
    font-semibold
  `,
  expensesRow: `
    bg-white
    hover:bg-indigo-100
  `,
  summaryRow: `
    bg-gradient-to-r
    from-indigo-700
    to-indigo-600
    text-white
  `,
  balanceRow: `
    bg-gradient-to-r
    from-indigo-800
    to-indigo-700
    text-white
  `,
  positive: `
    text-green-600
    font-bold
  `,
  negative: `
    text-red-600
    font-bold
  `,
  highlighted: `
    bg-indigo-400
  `,
};

export default tableStyles;
