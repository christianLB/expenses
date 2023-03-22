import React from "react";
import { Table } from "@chakra-ui/react";
import { useExpensesContext } from "../../hooks/expensesContext.tsx";
import CategoryRow from "./CategoryRow.tsx";
import GroupRow from "./GroupRow.tsx";
import MonthHeader from "./MonthHeader.tsx";
import useCollapsedState from "../../hooks/useCollapsedState.ts"; // Import the custom hook
import { getMonthNames, colors } from "../../utils.ts";

const ExpenseTable = () => {
  const { categoryGroupExpenses: expensesResult = {} } = useExpensesContext();
  const [collapsed, setCollapsed] = useCollapsedState(expensesResult); // Use the custom hook
  const _INCOME = "Income";
  const _BALANCE = "Balance";
  const monthNames = getMonthNames();
  console.log(expensesResult.Income); //)
  return (
    <Table style={{ fontSize: "0.8rem" }}>
      <thead>
        <tr style={{ backgroundColor: "darkgray", color: "white" }}>
          <th style={{ width: "40px" }}></th>
          <th>Category/Group</th>
          {monthNames.map((month) => (
            <MonthHeader key={month} month={month} />
          ))}
          <th style={{ borderLeft: "1px solid white" }}></th>
        </tr>
      </thead>
      <tbody>
        <CategoryRow
          key={"income"}
          category={"Income"}
          color={"blue"}
          isIncome={true}
          totals={expensesResult.Income?.totals || []}
          collapsed={true}
        />
        <CategoryRow
          key={"summary"}
          category={"summary"}
          color={"lightblue"}
          totals={expensesResult.summary}
          collapsed={true}
        />
        {/* <CategoryRow
          key={"balance"}
          category={"Balance"}
          color={"lightgreen"}
          isBalance={true}
          totals={expensesResult.Balance.totals}
          collapsed={true}
        /> */}
        {Object.entries(expensesResult).map(
          ([category, groups]: [any, any], i) => {
            const color = colors[i];
            const isCollapsed: boolean = collapsed[category];
            const groupsMap: any[] = Object.entries(groups).filter(
              ([groupName]) => groupName !== "totals"
            );
            const hasGroups = groupsMap.length > 1;
            console.log({ category, groups });
            return (
              <React.Fragment key={category}>
                {!isCollapsed &&
                  hasGroups &&
                  groupsMap.map(([groupName, amounts]: [any, any]) => {
                    return (
                      <GroupRow
                        key={groupName}
                        groupName={groupName}
                        amounts={amounts}
                        color={!isCollapsed ? color : ""}
                        monthNames={monthNames}
                      />
                    );
                  })}
                {/* <CategoryRow
                  key={category}
                  category={category}
                  color={isIncome ? "lightblue" : color}
                  isIncome={isIncome}
                  isBalance={isBalance}
                  totals={groups.totals}
                  collapsed={collapsed[category]}
                  onToggleCollapse={() =>
                    setCollapsed((state) => ({
                      ...state,
                      [category]: !state[category],
                    }))
                  }
                /> */}
              </React.Fragment>
            );
          }
        )}
      </tbody>
    </Table>
  );
};

export default ExpenseTable;
