// GroupRow.tsx
import React, { useContext, useRef, useState } from "react";
import { TableContext, TableContextProps } from "./DataTable";
import { Collapse } from "@mantine/core";

import useExpandables from "../../hooks/useExpandables";
import { Group, Paper, Table, Text, rem } from "@mantine/core";
import ExpenseModal from "./ExpenseModal";
import ExpenseGroup from "./ExpenseGroup";

interface GroupData {
  id: string;
  name: string;
  totals: Array<number>;
  expenses: Array<any>; // Define a more specific interface for expenses if needed
}

const CategoryDetail = ({ category, expenseGroups, expenseCategories }) => {
  const { collapsedKeys, selectedMonth, isAllSelected } =
    useContext<TableContextProps>(TableContext);

  const contentRef = useRef(null);
  const [userColor, setUserColor] = useState(category?.color);
  const isCollapsed = !collapsedKeys.has(category.id);
  const month = new Date(0, selectedMonth).toLocaleDateString("default", {
    month: "long",
  });

  const { getExpandableProps, toggleExpand } = useExpandables();

  const expandableProps = getExpandableProps(category.id, !isCollapsed);
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <>
      <ExpenseModal
        expenseGroups={expenseGroups}
        expenseCategories={expenseCategories}
        isOpen={!!editingExpense}
        expenseData={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={async (expense) => {
          await fetch("./api/expensesApi", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(expense),
          });
        }}
      />
      <Table.Tr p="0">
        <Table.Td
          colSpan={14}
          ref={contentRef}
          p="0"
          style={{
            filter: "brightness(110%)",
            backgroundColor: userColor,
            ...expandableProps.style,
          }}
        >
          <Collapse in={!isCollapsed}>
            <Paper
              style={{
                background: userColor,
                borderBottom: `1px solid rgba(255,255,255,0.3)`,
              }}
              p="xs"
            >
              <Group justify={"center"} align="center" flex={1}>
                <Text size={rem(14)}>{month}</Text>
              </Group>
              <Group justify={"space-between"} mb="xs" flex={1}>
                <Text size={rem(32)}>{category.name}</Text>
                <Text size={rem(32)}>
                  {category?.totals[selectedMonth].toFixed(2)}
                </Text>
              </Group>

              {category?.groups?.map((group: GroupData) => {
                const groupExpensesIds = group.expenses.map((e) => e.id);
                return (
                  <ExpenseGroup
                    category={category}
                    selected={isAllSelected(groupExpensesIds)}
                    selectedMonth={selectedMonth}
                    key={group.id}
                    group={group}
                    onSelect={() => {}}
                    onExpand={() => {}}
                    onEdit={(expense) => setEditingExpense(expense)}
                  />
                );
              })}
            </Paper>
          </Collapse>
        </Table.Td>
      </Table.Tr>
    </>
  );
};

export default CategoryDetail;
