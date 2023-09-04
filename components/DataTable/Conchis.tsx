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
      console.log(contentRef.current?.getBoundingClientRect().height);
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
  const { collapsedKeys } = useContext<TableContextProps>(TableContext);
  const isCollapsed = !collapsedKeys.has(category.id);

  return (
    <TableRow show={!isCollapsed} color={category.color}>
      <div className="w-full text-white rounded p-2 font-semibold relative">
        <span className={"absolute top-0"} style={{ left: "52px" }}>
          {category.name}
        </span>
        <span className={"absolute top-0"} style={{ left: "100px" }}>
          ID: {category.id}
        </span>
        <span className={"absolute top-0"} style={{ left: "200px" }}>
          Totals: {category.totals.join(', ')}
        </span>
        <span className={"absolute top-0"} style={{ left: "300px" }}>
          Groups: {category.groups.join(', ')}
        </span>
      </div>
    </TableRow>
  );
};

export default Conchis;
