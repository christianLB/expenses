import { useState } from "react";
import {
  Table,
  Checkbox,
  Select,
  Button,
  Paper,
  Text,
  Group,
  Stack,
  Loader,
  Switch,
  Pagination,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useStrapiCollection } from "../hooks/useStrapiCollection";

interface ExpenseCategory {
  id: string;
  name: string;
}

interface ExpenseGroup {
  id: string;
  name: string;
  connect: any;
}

interface Movement {
  documentId: string;
  id: string;
  name: string;
  amount: number;
  date: string;
  currency: string;
  needsRevision: boolean;
  notes?: string;
  selected?: boolean;
  expense_category?: ExpenseCategory | null;
  expense_group?: ExpenseGroup | null;
}

export default function ExpenseList() {
  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of expenses per page

  const {
    data: expenses,
    isLoading,
    update,
    delete: deleteExpense,
  } = useStrapiCollection<Movement>("expenses", {
    pagination: { page, pageSize },
  });

  const { data: categories } =
    useStrapiCollection<ExpenseCategory>("expense-categories");
  const { data: groups } = useStrapiCollection<ExpenseGroup>("expense-groups");

  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedExpenses(
      checked ? expenses?.map((exp) => exp.documentId) || [] : []
    );
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedExpenses((prev) =>
      checked ? [...prev, id] : prev.filter((expenseId) => expenseId !== id)
    );
  };

  const handleUpdate = (id: string, updatedData: Partial<Movement>) => {
    update({ documentId: id, updatedData });
  };

  const handleDeleteSelected = () => {
    if (selectedExpenses.length === 0) return;
    selectedExpenses.forEach((id) => deleteExpense(id));
    setSelectedExpenses([]);
    notifications.show({
      title: "Deleted",
      message: "Selected expenses were deleted successfully",
      color: "red",
    });
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <Checkbox
            checked={selectedExpenses.length === expenses?.length}
            onChange={(event) => handleSelectAll(event.currentTarget.checked)}
            label="Select All"
            disabled={isLoading}
          />
          <Button
            onClick={handleDeleteSelected}
            disabled={selectedExpenses.length === 0}
            color="red"
          >
            Delete Selected
          </Button>
        </Group>

        <Table striped>
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Group</th>
              <th style={{ textAlign: "center" }}>Needs Revision</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  <Loader size="sm" />
                </td>
              </tr>
            ) : (
              expenses?.map((movement) => (
                <tr key={movement.documentId}>
                  <td>
                    <Checkbox
                      checked={selectedExpenses.includes(movement.documentId)}
                      onChange={(event) =>
                        handleSelectOne(
                          movement.documentId,
                          event.currentTarget.checked
                        )
                      }
                    />
                  </td>
                  <td>{new Date(movement.date).toLocaleDateString()}</td>
                  <td>{movement.name}</td>
                  <td>
                    {movement.amount} {movement.currency}
                  </td>
                  <td>
                    <Select
                      data={categories?.map((cat) => ({
                        value: String(cat.id),
                        label: cat.name,
                      }))}
                      value={
                        movement.expense_category
                          ? String(movement.expense_category.id)
                          : ""
                      }
                      onChange={(value) =>
                        handleUpdate(movement.documentId, {
                          expense_category: value
                            ? //@ts-ignore
                              { connect: { id: Number(value) } }
                            : null,
                        })
                      }
                      placeholder="Select category"
                      clearable
                    />
                  </td>
                  <td>
                    <Select
                      data={
                        groups?.map((group) => ({
                          value: String(group.id),
                          label: group.name,
                        })) || []
                      }
                      value={
                        movement.expense_group
                          ? String(movement.expense_group.id)
                          : ""
                      }
                      onChange={(value) =>
                        handleUpdate(movement.documentId, {
                          //@ts-ignore
                          expense_group: value
                            ? { connect: { id: Number(value) } }
                            : null,
                        })
                      }
                      placeholder="Select group"
                      clearable
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Group justify="center">
                      <Switch
                        checked={movement.needsRevision}
                        onChange={(event) =>
                          handleUpdate(movement.documentId, {
                            needsRevision: event.currentTarget.checked,
                          })
                        }
                      />
                    </Group>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Pagination Controls */}
        <Group mt="md">
          <Pagination
            total={Math.ceil((expenses?.length || 1) / pageSize)}
            value={page}
            onChange={setPage}
          />
        </Group>
      </Paper>
    </Stack>
  );
}
