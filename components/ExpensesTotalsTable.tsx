import React, { useState } from "react";
import { Table, IconButton, Box, Collapse } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import * as _ from "lodash";

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
  "#E6F1CC",
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

const ExpenseTable = ({ expensesResult }) => {
  const collapsedDefault = _.zipObject(
    _.keys(expensesResult),
    Array(Object.keys(expensesResult).length).fill(true)
  );
  const [collapsed, setCollapsed] = useState(collapsedDefault);
  const _INCOME = 'Income';

  return (
    <Table style={{fontSize: '0.8rem'}}>
      <thead>
        <tr style={{ backgroundColor: "darkgray", color: "white" }}>
          <th style={{ width: "40px" }}></th>
          <th>Category/Group</th>
          {monthNames.map((month) => (
            <th
              style={{ borderLeft: "1px solid white" }}
              key={month}
            >
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
            return (
              <React.Fragment key={category}>
                {!isCollapsed &&
                  hasGroups &&
                  groupsMap.map(([groupName, amounts]: [any, any]) => {
                    const isIncome = groupName == _INCOME
                    console.log(isIncome)
                    return (<tr
                      key={groupName}
                      style={{
                        ...(!isCollapsed || !hasGroups && !isIncome
                          ? { backgroundColor: color }
                          : {}),
                        ...(isIncome
                          ? { backgroundColor: 'light-blue' }
                          : {})
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
                      {Array.isArray(amounts) && amounts?.map((amount, index) => (
                        <td
                          key={monthNames[index] + 'amounts'}
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
                    </tr>)
})}
                <tr style={{ fontWeight: "bold", height: "40px" }}>
                  <td style={{ backgroundColor: color }}>
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
                      backgroundColor: color,
                      borderBottom: "1px solid gray",
                    }}
                  >
                    {category}
                  </td>
                  {groups?.totals?.map((total, index) => (
                    <td
                      style={{
                        borderLeft: "1px solid #d2d2d2",
                        backgroundColor: "gray",
                        color: "white",
                        padding: "0px 0.5%",
                        ...(!total
                          ? {
                              textAlign: "center",
                              color: "#d2d2d2",
                              //paddingLeft: "0",
                            }
                          : {}),
                        ...(!isCollapsed && hasGroups
                          ? {
                              borderBottom: `1px solid ${color}`,
                            }
                          : {}),
                      }}
                      key={monthNames[index]}
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
