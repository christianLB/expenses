import { Group, Text, Checkbox } from "@mantine/core";
import { IconPencil, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";

const Expense = ({
  expense: defaultExpense,
  onSelect,
  onEdit,
  isSelected,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [expense, setExpense] = useState(defaultExpense);

  const handleDelete = async (expense) => {
    await fetch(`./api/expensesApi?id=${expense.id}`, {
      method: "DELETE",
    });
  };

  return (
    <Group w={"100%"} justify="space-between" key={expense.id}>
      <Group gap="md">
        <Group gap="xs" mr="xl">
          <Checkbox w={20} h={20} checked={isSelected} onChange={onSelect} />

          <IconPencil
            width={20}
            height={20}
            cursor={"pointer"}
            onClick={() => onEdit(expense)}
          />
          {!isDeleting && (
            <IconTrash
              width={20}
              height={20}
              cursor={"pointer"}
              onClick={() => {
                setIsDeleting(true);
              }}
            />
          )}
          {!!isDeleting && (
            <Group gap="xs">
              <IconCheck cursor={"pointer"} onClick={onDelete} />
              <IconX cursor={"pointer"} onClick={() => setIsDeleting(false)} />
            </Group>
          )}
        </Group>
        <Text w={100}>
          {new Date(expense.date).toLocaleDateString("default", {
            day: "2-digit",
            month: "short",
          })}
        </Text>
        <Text>{expense.name}</Text>
      </Group>
      <Group>
        <Text>{expense.amount}</Text>
      </Group>
    </Group>
  );
};

export default Expense;
