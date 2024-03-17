import { Group, Checkbox, Collapse, Stack, Text, Loader } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Expense from "./Expense";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ExpenseGroup = ({
  group,
  category,
  selectedMonth,
  selected,
  onSelect,
  onExpand,
  onEdit,
}) => {
  const [expenses, setExpenses] = useState([]);
  const [expanded, toggleExpanded] = useState(false);
  const [visible, toggleVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const router = useRouter();
  const { year } = router.query;

  const refresh = async () => {
    const date = new Date(
      Number(year),
      selectedMonth + 1,
      1,
      0,
      0,
      0,
      0
    ).toISOString();

    const queryParameters = new URLSearchParams({
      action: "expensesByCategoryGroupYearMonth",
      categoryId: category.id,
      groupId: group.id,
      date,
    }).toString();
    console.log(queryParameters);
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
    const groupTotals = Number(group.totals[selectedMonth].toFixed(2));
    if (expanded) refresh();
    //toggleExpanded(false);
    //toggleVisible(groupTotals > 0 || category.name === "Otros" ? true : false);
  }, [selectedMonth]);

  return (
    <Collapse
      in={true}
      style={{ width: "100%" }}
      mb={expanded ? "0.5rem" : "0.0rem"}
    >
      <Group
        w={"100%"}
        onClick={handleExpand}
        bg={`${expanded ? "gray.8" : "gray.7"}`}
        opacity={0.5}
        justify="space-between"
        p="xs"
        pr={expanded ? "lg" : "xs"}
      >
        <Group>
          {loading && (
            <Group w={20} h={20}>
              <Loader size={"sm"} />
            </Group>
          )}
          {!expanded && !loading && (
            <Group w={20} h={20}>
              <IconChevronDown width={20} height={20} />
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
          <Text fw={expanded ? "bold" : ""}>{group.name}</Text>
        </Group>
        <Text fw={expanded ? "bold" : ""} size={expanded ? "xl" : ""}>
          {group.totals[selectedMonth].toFixed(2)}
        </Text>
      </Group>
      <Group bg={"gray.9"} opacity={0.5}>
        <Collapse in={expanded} style={{ width: "100%" }}>
          <Stack
            gap={"0.1rem"}
            w={"100%"}
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
    </Collapse>
  );
};

export default ExpenseGroup;
