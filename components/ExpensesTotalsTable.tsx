import React, { useState } from "react";
import { Table, IconButton, Box, Collapse } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

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
  "#e2c6ff",
  "#d1c5e8",
  "#f1c5f9",
  "#c2e2b8",
  "#e5f5c5",
  "#f5b8c5",
  "#c5f9e2",
  "#b8e2c5",
  "#e2c5b8",
  "#c5f5e2",
  "#b8c5e2",
  "#f9c5e2",
  "#e2f5c5",
  "#c5b8e2",
  "#f5e2c5",
  "#e2c5f9",
  "#c5e2f5",
  "#b8f5c5",
  "#e2f9c5",
  "#f5c5e2",
  "#c5e2b8",
  "#b8c5f5",
  "#f9e2c5",
  "#c5b8f5",
];

const ExpenseTable = ({ expensesResult }) => {
  const [collapsed, setCollapsed] = useState({});

  return (
    <Table>
      <thead>
        <tr style={{ backgroundColor: "darkgray", color: "white" }}>
          <th style={{ width: "40px" }}></th>
          <th>Category/Group</th>
          {monthNames.map((month) => (
            <th style={{ borderLeft: "1px solid white" }} key={month}>
              {month}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(expensesResult).map(
          ([category, groups]: [any, any], i) => {
            const color = colors[i];
            const isCollapsed: boolean = collapsed[category];
            const groupsMap: any[] = Object.entries(groups).filter(([groupName]) => groupName !== "totals")
            const hasGroups = groupsMap.length > 1
            return (
              <React.Fragment key={category}>
                {!isCollapsed && hasGroups && groupsMap.map(([groupName, amounts]: [any, any]) => (
                      <tr
                        key={groupName}
                        style={{
                          ...(!isCollapsed || !hasGroups ? { backgroundColor: color } : {}),
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
                        {amounts.map((amount, index) => (
                          <td
                            key={monthNames[index]}
                            style={{
                              paddingLeft: "5px",
                              ...(!amount ? {textAlign: 'center'} : {})
                            }}
                          >
                            {amount && amount.toFixed(2) || '--'}
                          </td>
                        ))}
                      </tr>
                    ))}
                <tr style={{ fontWeight: "bold" }}>
                  <td style={{ backgroundColor: color }}>
                    {hasGroups && <IconButton
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
                    />}
                  </td>
                  <td style={{ backgroundColor: color, borderBottom: '1px solid gray' }}>{category}</td>
                  {groups.totals.map((total, index) => (
                    <td
                      style={{
                        borderLeft: "1px solid #d2d2d2",
                        backgroundColor: 'gray',
                        color: 'white',
                        paddingLeft: "5px",
                        ...(!total ?  {textAlign: 'center'} : {})
                        //...(!isCollapsed
                        //</tr>  ? { backgroundColor: "gray", color: "white" }
                         // : {}),
                      }}
                      key={monthNames[index]}
                    >
                      {total && total.toFixed(2) || '--'}
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
