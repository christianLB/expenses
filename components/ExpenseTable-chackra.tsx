import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useToggle from "../hooks/useToggle.ts";

const months = [
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

const ExpenseTable = ({ expenses = [], name = "", displayMonths = false }) => {
  const expensesByMonth = (expenses) => {
    let monthlyExpenses = Array(12).fill(0);
    expenses.forEach((expense) => {
      let expenseMonth = new Date(expense.Date).getMonth();
      monthlyExpenses[expenseMonth] += expense.amount;
    });
    return monthlyExpenses;
  };
  const totals = expensesByMonth(expenses);
  const [open, toggleOpen] = useToggle(false);

  return (
    <TableContainer>
      <Table size="sm" borderWidth="1px" variant="simple">
        <Thead>
          <Tr bgColor="gray.200">
            <Th key={"exp"} onClick={toggleOpen} w={[60]}>
              {name}
            </Th>
            {months.map((month) => (
              <Th key={month} w={[20]}>
                {displayMonths && month}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {open && (
            <>
              {expenses?.map((expense) => {
                const date = new Date(expense.Date);
                const expenseMonth = months[date.getMonth()];

                return (
                  <Tr key={expense.id}>
                    <Td>{expense.Name}</Td>
                    {months.map((month) => {
                      const match = expenseMonth == month;
                      return (
                        <Td key={month} fontSize={"xs"}>
                          {(match && !!expense.amount && expense.amount) ||
                            "--"}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </>
          )}
          <Tr>
            <Td></Td>
            {totals.map((month, i) => {
              const total = totals[i].toFixed(2);

              return (
                <Td key={i} fontSize={"xs"}>
                  {(!!total && total > 0 && total) || "--"}
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseTable;
