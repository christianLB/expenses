import { useState, useEffect } from "react";
import {
  Table,
  Checkbox,
  Select,
  Button,
  Paper,
  Group,
  Stack,
  Loader,
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
}

interface Movement {
  name: string;
  amount: number;
  date: string;
  currency: string;
  needsRevision?: boolean;
  notes?: string;
  selected?: boolean;
  expense_category?: string | null;
  expense_group?: string | null;
}

interface BBVAMonthlyListProps {
  data: { expenses: Movement[] };
}

export default function BBVAMonthlyList({ data }: BBVAMonthlyListProps) {
  const { data: categories = [], isLoading: loadingCategories } =
    useStrapiCollection<ExpenseCategory>("expense-categories");
  const { data: groups = [], isLoading: loadingGroups } =
    useStrapiCollection<ExpenseGroup>("expense-groups");
  const { create, isLoading: isCreating } = useStrapiCollection("expenses");

  const [movements, setMovements] = useState<Movement[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    if (
      data?.expenses.length > 0 &&
      categories.length > 0 &&
      groups.length > 0
    ) {
      const group_otros = groups.find((g) => g.name === "Otros")?.id || null;
      const category_otros =
        categories.find((cat) => cat.name === "Otros")?.id || null;

      setMovements(
        data.expenses.map((movement) => ({
          ...movement,
          selected: false,
          expense_category: movement.expense_category || category_otros,
          expense_group: movement.expense_group || group_otros,
        }))
      );
    }
  }, [data, categories, groups]);

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    setMovements((prev) => prev.map((mov) => ({ ...mov, selected: checked })));
  };

  const handleSelectOne = (index: number, checked: boolean) => {
    setMovements((prev) =>
      prev.map((mov, i) => (i === index ? { ...mov, selected: checked } : mov))
    );
  };

  const handleSaveToDatabase = async () => {
    const selectedMovements = movements.filter((mov) => mov.selected);
    if (selectedMovements.length === 0) return;

    try {
      await Promise.all(
        selectedMovements.map((mov) =>
          create({
            name: mov.name,
            amount: mov.amount,
            date: mov.date,
            currency: mov.currency,
            needsRevision: mov.needsRevision,
            notes: mov.notes,
            expense_category: mov.expense_category
              ? { connect: { id: mov.expense_category } }
              : undefined,
            expense_group: mov.expense_group
              ? { connect: { id: mov.expense_group } }
              : undefined,
          })
        )
      );

      notifications.show({
        title: "Success",
        message: "Movements saved successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save movements",
        color: "red",
      });
    }
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <Checkbox
            checked={allSelected}
            onChange={(event) => handleSelectAll(event.currentTarget.checked)}
            label="Select All"
            disabled={isCreating}
          />
          <Button
            onClick={handleSaveToDatabase}
            disabled={isCreating || !movements.some((mov) => mov.selected)}
          >
            Save Selected to Database
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
            </tr>
          </thead>
          <tbody>
            {loadingCategories || loadingGroups ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  <Loader size="sm" />
                </td>
              </tr>
            ) : (
              movements.map((movement, index) => (
                <tr key={index}>
                  <td>
                    <Checkbox
                      checked={movement.selected}
                      onChange={(event) =>
                        handleSelectOne(index, event.currentTarget.checked)
                      }
                      disabled={isCreating}
                    />
                  </td>
                  <td>{new Date(movement.date).toLocaleDateString()}</td>
                  <td>{movement.name}</td>
                  <td>
                    {movement.amount} {movement.currency}
                  </td>
                  <td>
                    <Select
                      data={categories.map((cat) => ({
                        value: String(cat.id), // Convertimos a string
                        label: cat.name,
                      }))}
                      value={
                        movement.expense_category
                          ? String(movement.expense_category)
                          : ""
                      }
                      onChange={(value) =>
                        setMovements((prev) =>
                          prev.map((mov, i) =>
                            i === index
                              ? { ...mov, expense_category: value }
                              : mov
                          )
                        )
                      }
                      placeholder="Select category"
                      clearable
                      disabled={isCreating}
                    />
                  </td>
                  <td>
                    <Select
                      data={groups.map((group) => ({
                        value: String(group.id), // Convertimos a string
                        label: group.name,
                      }))}
                      value={
                        movement.expense_group
                          ? String(movement.expense_group)
                          : ""
                      }
                      onChange={(value) =>
                        setMovements((prev) =>
                          prev.map((mov, i) =>
                            i === index ? { ...mov, expense_group: value } : mov
                          )
                        )
                      }
                      placeholder="Select group"
                      clearable
                      disabled={isCreating}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
