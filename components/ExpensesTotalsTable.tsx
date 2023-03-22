import React, { useEffect, useLayoutEffect, useState } from "react";
import { Table, IconButton, Box, Collapse } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import * as _ from "lodash";
import { useExpensesContext } from "../hooks/expensesContext.tsx";

const monthNames = [
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
];
const colors = [
  "#F1F1F1",
  "#E6F1E6",
  "#F1E6E6",
  "#E6E6F1",
  "#FFFFCC",
  "#D9EDF7",
  "#CCE5FF",
  "#F1CCD9",
  "#B6A1CF",
  "#F1D9CC",
  "#CCF1E6",
  "#D9CCF1",
  "#CCD9F1",
  "#F1CCE6",
  "#E6CCF1",
  "#CCE6F1",
  "#CCF1D9",
  "#F1CCF1",
  "#E6E6E6",
  "#E6F1F1",
];

const ExpenseTable = () => {
  const { categoryGroupExpenses: expensesResult = {} } = useExpensesContext();
  const [collapsed, setCollapsed] = useState({});
  const _INCOME = "Income";
  const _BALANCE = "Balance";

  useLayoutEffect(() => {
    const collapsedDefault = _.zipObject(
      _.keys(expensesResult),
      Array(Object.keys(expensesResult).length).fill(true)
    );
    setCollapsed(collapsedDefault);
  }, [expensesResult]);
  console.log(expensesResult);
  return (
    <Table style={{ fontSize: "0.8rem" }}>
      <thead>
        <tr style={{ backgroundColor: "darkgray", color: "white" }}>
          <th style={{ width: "40px" }}></th>
          <th>Category/Group</th>
          {monthNames.map((month) => (
            <th style={{ borderLeft: "1px solid white" }} key={month}>
              {month}
            </th>
          ))}
          <th style={{ borderLeft: "1px solid white" }}></th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(expensesResult).map(
          ([category, groups]: [any, any], i) => {
            const color = colors[i];
            const isCollapsed: boolean = collapsed[category];
            const groupsMap: any[] = Object.entries(groups).filter(
              ([groupName]) => groupName !== "totals"
            );
            const hasGroups = groupsMap.length > 1;
            const isIncome = category === _INCOME;
            const isBalance = category === _BALANCE;

            return (
              <React.Fragment key={category}>
                {!isCollapsed &&
                  hasGroups &&
                  groupsMap.map(([groupName, amounts]: [any, any]) => {
                    return (
                      <tr
                        key={groupName}
                        style={{
                          backgroundColor: !isCollapsed ? color : "",
                        }}
                      >
                        <td style={{ backgroundColor: color }}></td>
                        <td
                          style={{
                            backgroundColor: color,
                            paddingLeft: "20px",
                          }}
                        >
                          {groupName}
                        </td>
                        {Array.isArray(amounts) &&
                          amounts?.map((amount, index) => (
                            <td
                              key={monthNames[index] + "amounts"}
                              style={{
                                padding: "0 0.5%",
                                ...(!amount
                                  ? {
                                      textAlign: "center",
                                      color: "#000",
                                      paddingLeft: "0",
                                    }
                                  : {}),
                              }}
                            >
                              {(amount && amount.toFixed(2)) || "-"}
                            </td>
                          ))}
                      </tr>
                    );
                  })}
                <tr style={{ fontWeight: "bold", height: "40px" }}>
                  <td
                    style={{ backgroundColor: isIncome ? "lightblue" : color }}
                  >
                    {hasGroups && (
                      <IconButton
                        onClick={() =>
                          setCollapsed((state) => ({
                            ...state,
                            [category]: !state[category],
                          }))
                        }
                        icon={
                          collapsed[category] ? (
                            <TriangleUpIcon />
                          ) : (
                            <TriangleDownIcon />
                          )
                        }
                        size="sm"
                        variant="ghost"
                        aria-label={""}
                      />
                    )}
                  </td>
                  <td
                    style={{
                      backgroundColor: isIncome ? "lightblue" : color,
                      borderBottom: "1px solid gray",
                    }}
                  >
                    {category}
                  </td>
                  {groups?.totals?.map((total, index) => (
                    <td
                      style={{
                        borderLeft: "1px solid #d2d2d2",
                        backgroundColor: isIncome
                          ? "lightblue"
                          : isBalance
                          ? color
                          : "gray",
                        color: "white",
                        padding: "0px 0.5%",
                        ...(!total
                          ? {
                              textAlign: "center",
                              //color: "gray",
                            }
                          : {}),
                        ...(!isCollapsed && hasGroups
                          ? {
                              borderBottom: `1px solid ${color}`,
                            }
                          : {}),
                      }}
                      key={monthNames[index] + "td"}
                    >
                      {(total && total.toFixed(2)) || "-"}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            );
          }
        )}
      </tbody>
    </Table>
  );
};

export default ExpenseTable;
