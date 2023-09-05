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

const Conchis = ({ category }) => {
  const { collapsedKeys, selectedMonth } =
    useContext<TableContextProps>(TableContext);
  const isCollapsed = !collapsedKeys.has(category.id);
  console.log(category);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const selectedMonthName = monthNames[selectedMonth];
  const totalAmount = category.totals[selectedMonth];
  const groupsWithExpenses = category.groups.filter(
    (group) => group.totals[selectedMonth] > 0
  );

  return (
    <TableRow show={!isCollapsed} color={category.color}>
      <div className="flex gap-5 w-full text-white rounded p-2 font-semibold relative">
        <div className="left-panel">
          <h2 className="text-2xl">{category.name}</h2>
          <h3 className="text-lg">{selectedMonthName}</h3>
          <p className="text-xl">
            {totalAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>
        <div className="right-panel">
          <h3 className="text-lg">Expenses:</h3>
          {groupsWithExpenses.map((group) => (
            <div key={group.id}>
              <h4>{group.name}</h4>
              <p>
                {group.totals[selectedMonth].toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </TableRow>
  );
};

export default Conchis;
