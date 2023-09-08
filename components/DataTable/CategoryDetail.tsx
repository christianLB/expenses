// GroupRow.tsx
import React, { useContext, useEffect, useRef } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import { useSpring, animated } from "react-spring";
import tableStyles from "./tableStyles";

interface GroupData {
  id: string;
  name: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

interface GroupRowProps {
  group: GroupData;
  groupName: string;
  category: any;
}

const TableRow = ({ children, show, color }) => {
  const contentRef = React.useRef(null);
  const [contentHeight, setContentHeight] = React.useState(0);

  // Measure content height
  React.useLayoutEffect(() => {
    if (contentRef.current) {
      //console.log(contentRef.current?.getBoundingClientRect().height);
      setContentHeight(contentRef.current.getBoundingClientRect().height);
    }
  }, [contentRef.current]);

  const [props, setProps] = useSpring(() => ({
    height: 0,
    opacity: 0,
    backgroundColor: color,
    filter: "brightness(110%)",
    config: {
      mass: 3,
      friction: 70,
      tension: 2000,
    },
  }));

  useEffect(() => {
    setProps({
      height: show ? contentHeight : 0,
      opacity: show ? 1 : 0,
    });
  }, [show, setProps, contentHeight]);

  return (
    <tr className={tableStyles.categoryRow}>
      <td colSpan={15}>
        <animated.div style={{ ...props, overflow: "hidden" }}>
          <div ref={contentRef}>{children}</div>
        </animated.div>
      </td>
    </tr>
  );
};

const CategoryDetail = ({ category }) => {
  const { collapsedKeys, selectedMonth } =
    useContext<TableContextProps>(TableContext);
  const isCollapsed = !collapsedKeys.has(category.id);
  return (
    <TableRow show={!isCollapsed} color={category.color}>
      <div className="w-full h-full">
        {/* Top Panel */}
        <div
          className="flex justify-between w-full border-b-2 p-4"
          style={{
            background: `linear-gradient(to right, ${category.color}, ${category.color}, white)`,
          }}
        >
          <div>
            <h1 className="text-white text-3xl font-bold">{category.name}</h1>
            <h2 className="text-white text-2xl">
              {new Date(0, selectedMonth).toLocaleDateString("default", {
                month: "long",
              })}
            </h2>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Total del Mes</h1>
            <h1 className="text-2xl font-bold">
              {category.totals[selectedMonth]}
            </h1>
            {/* Future Chart Here */}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="w-full p-4 text-white">
          {category.groups.map((group: GroupData) => {
            // Filtrar los gastos según el mes seleccionado
            const filteredExpenses = group.expenses.filter((expense) => {
              //console.log("Expense month:", new Date(expense.date).getMonth());
              //console.log("Selected month:", selectedMonth - 1);
              return new Date(expense.date).getMonth() === selectedMonth;
            });

            return (
              filteredExpenses.length > 0 && (
                <div key={group.id} className="my-2 border-b-2">
                  <div className="flex justify-between px-2 font-semibold">
                    <h3 className="text-xl">{group.name}</h3>
                    <span>{group.totals[selectedMonth]}</span>
                  </div>
                  <ul className="list-disc pl-5">
                    {filteredExpenses.map((expense, index) => (
                      <li
                        key={index}
                        className="p-1 flex justify-between font-semibold"
                      >
                        <span className="w-1/4">
                          {new Date(expense.date).toLocaleDateString(
                            "default",
                            { day: "2-digit", month: "short" }
                          )}
                        </span>
                        <span className="w-3/4 text-left">{expense.name}</span>
                        <span className="w-1/4 text-right">
                          {expense.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            );
          })}
        </div>
      </div>
    </TableRow>
  );
};

export default CategoryDetail;
