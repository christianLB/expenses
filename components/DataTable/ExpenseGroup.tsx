import { Group, Checkbox, Collapse, Stack, Text, Loader } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import exp from "constants";

const ExpenseGroup = ({
  group,
  category,
  selectedMonth,
  selected,
  onSelect,
  onExpand,
  onEdit,
}) => {
  const groupTotals = group.totals[selectedMonth].toFixed(2);
  const [expenses, setExpenses] = useState([]);
  const [expanded, toggleExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const router = useRouter();
  const { year } = router.query;

  const refresh = async () => {
    const startDate = new Date(Number(year), selectedMonth, 1).toISOString();
    const endDate = new Date(Number(year), selectedMonth + 1, 0).toISOString();

    const queryParameters = new URLSearchParams({
      categoryId: category.id,
      groupId: group.id,
      startDate,
      endDate,
    }).toString();

    try {
      setLoading(true);

      const resp = await fetch(`./api/expensesApi?${queryParameters}`, {
        method: "GET",
      });
      const expenses = await resp.json();
      if (expenses.length > 0) {
        setExpenses(expenses);
        return expenses;
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async () => {
    if (expanded) {
      toggleExpanded(false);
      return;
    }
    const expenses = await refresh();
    if (expenses?.length) toggleExpanded(true);
  };

  useEffect(() => {
    toggleExpanded(false);
  }, [selectedMonth]);

  if (!groupTotals) return null;

  return (
    <Group bg={"gray.8"} mb="xs" p="xs" opacity={0.5}>
      <Group w={"100%"} onClick={handleExpand}>
        {loading && (
          <Group w={20} h={20}>
            <Loader size={"sm"} />
          </Group>
        )}
        {expanded && !loading ? (
          <Checkbox
            w={20}
            h={20}
            onClick={(e) => {
              //e.stopPropagation();
            }}
            checked={selected}
            onChange={onSelect}
          />
        ) : (
          <></>
        )}
        {!expanded && !loading && <IconChevronDown width={20} height={20} />}

        <Group w={"97%"} wrap="nowrap" justify="space-between">
          <Text fw={expanded ? "bold" : ""}>{group.name}</Text>
          <Text fw={expanded ? "bold" : ""}>{groupTotals}</Text>
        </Group>
      </Group>
      <Collapse in={expanded} style={{ width: "100%" }}>
        <Stack
          w={"100%"}
          pt={"xs"}
          justify="space-between"
          gap={"xs"}
          style={{ borderTop: `1px solid rgba(255,255,255,0.3)` }}
        >
          {(expenses ?? []).map((expense) => {
            return (
              <Expense
                key={expense.id}
                expense={expense}
                //isSelected={selectedExpenses.includes(expense.id)}
                isSelected={false}
                onSelect={() => {
                  //handleSelectExpense(expense.id);
                }}
                onEdit={onEdit}
                //onDelete={() => handleDelete(expense)}
                onDelete={() => {}}
              />
            );
          })}
        </Stack>
      </Collapse>
    </Group>
  );
};

export default ExpenseGroup;
