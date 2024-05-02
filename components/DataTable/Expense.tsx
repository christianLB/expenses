import { Group, Text, Checkbox } from "@mantine/core";
import { IconPencil, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import ExpenseModal from "./ExpenseModal";

const Expense = ({
  categories,
  groups,
  expense,
  onSelect,
  onEdit,
  isSelected,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  //const [expense, setExpense] = useState(defaultExpense);

  const handleDelete = async () => {
    await fetch(`./api/expensesApi?id=${expense.id}`, {
      method: "DELETE",
    });
    onDelete();
  };

  return (
    <Group w={"100%"} justify="space-between" key={expense.id} px="xs" py="5">
      <ExpenseModal
        expenseGroups={groups}
        expenseCategories={categories}
        isOpen={isEditing}
        expenseData={expense}
        onClose={() => setIsEditing(false)}
        onSave={async (expense) => {
          await fetch("./api/expensesApi", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(expense),
          });
          onEdit();
        }}
      />
      <Group gap="md">
        <Group gap="xs" mr="xl">
          <Checkbox w={20} h={20} checked={isSelected} onChange={onSelect} />

          <IconPencil
            width={20}
            height={20}
            cursor={"pointer"}
            onClick={() => setIsEditing(true)}
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
              <IconCheck cursor={"pointer"} onClick={handleDelete} />
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
