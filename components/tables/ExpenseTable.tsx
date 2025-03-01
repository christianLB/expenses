import { useState } from "react";
import {
  Table,
  Select,
  Switch,
  Paper,
  Group,
  Stack,
  Loader,
  Pagination,
  Checkbox,
  Button,
  ActionIcon,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconTrash,
  IconCheck,
  IconX,
  IconCheck as IconCheckMark,
  IconX as IconCancel,
} from "@tabler/icons-react";
import { useStrapiCollection } from "../../hooks/useStrapiCollection";

interface ExpenseCategory {
  id: number;
  name: string;
}
interface ExpenseGroup {
  id: number;
  name: string;
}
interface Expense {
  documentId: string;
  amount: number;
  currency: string;
  name: string;
  expense_category: ExpenseCategory;
  expense_group: ExpenseGroup;
  date: string;
  needsRevision: boolean;
}

export default function ExpenseTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedExpenses, setSelectedExpenses] = useState(new Set());
  const [editingDateId, setEditingDateId] = useState(null);
  const [editingDateValue, setEditingDateValue] = useState(null);
  const [updatingExpenses, setUpdatingExpenses] = useState(new Set());
  const [deletingExpenses, setDeletingExpenses] = useState(new Set());

  // Obtiene categorías y grupos
  const { data: categories = [], isLoading: loadingCategories } =
    useStrapiCollection("expense-categories");
  const { data: groups = [], isLoading: loadingGroups } =
    useStrapiCollection("expense-groups");

  const {
    data: expenses,
    isLoading: loadingExpenses,
    update,
    delete: deleteExpense,
  } = useStrapiCollection("expenses", {
    pagination: { page, pageSize },
  });

  const handleSelectExpense = (documentId) => {
    setSelectedExpenses((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(documentId)) newSelection.delete(documentId);
      else newSelection.add(documentId);
      return newSelection;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedExpenses(
        new Set(expenses.map((exp: Expense) => exp.documentId))
      );
    } else {
      setSelectedExpenses(new Set());
    }
  };

  const handleUpdate = async ({ documentId, updatedData, callback }) => {
    setUpdatingExpenses((prev) => new Set(prev).add(documentId));
    try {
      await update({ documentId, updatedData });
      showNotification({
        title: "Éxito",
        message: "Registro actualizado exitosamente",
        color: "green",
        icon: <IconCheck size={18} />,
      });
      if (callback) callback();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error al actualizar el registro",
        color: "red",
        icon: <IconX size={18} />,
      });
    } finally {
      setUpdatingExpenses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const handleDeleteExpense = async (documentId) => {
    setDeletingExpenses((prev) => new Set(prev).add(documentId));
    try {
      await deleteExpense(documentId);
      showNotification({
        title: "Éxito",
        message: "Registro eliminado exitosamente",
        color: "green",
        icon: <IconCheck size={18} />,
      });
      setSelectedExpenses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error al eliminar el registro",
        color: "red",
        icon: <IconX size={18} />,
      });
    } finally {
      setDeletingExpenses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const startEditingDate = (documentId, currentDate) => {
    setEditingDateId(documentId);
    setEditingDateValue(new Date(currentDate));
  };

  const cancelEditingDate = () => {
    setEditingDateId(null);
    setEditingDateValue(null);
  };

  const saveEditingDate = (documentId) => {
    handleUpdate({
      documentId,
      updatedData: { date: editingDateValue },
      callback: () => {
        cancelEditingDate();
      },
    });
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <Checkbox
            label="Seleccionar Todos"
            checked={selectedExpenses.size === expenses?.length}
            indeterminate={
              selectedExpenses.size > 0 &&
              selectedExpenses.size < expenses?.length
            }
            onChange={(event) => handleSelectAll(event.currentTarget.checked)}
          />
          <span>Lista de Gastos</span>
          <Button
            color="red"
            leftSection={
              deletingExpenses.size > 0 ? (
                <Loader size={16} />
              ) : (
                <IconTrash size={16} />
              )
            }
            disabled={selectedExpenses.size === 0 || deletingExpenses.size > 0}
            onClick={() => {
              selectedExpenses.forEach((documentId) => {
                handleDeleteExpense(documentId);
              });
            }}
          >
            Eliminar Seleccionados
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th style={{ padding: "12px" }}></th>
              <th style={{ padding: "12px" }}>Fecha</th>
              <th style={{ padding: "12px" }}>Descripción</th>
              <th style={{ padding: "12px" }}>Monto</th>
              <th style={{ padding: "12px" }}>Categoría</th>
              <th style={{ padding: "12px" }}>Grupo</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Revisar</th>
              <th style={{ padding: "12px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingExpenses || loadingCategories || loadingGroups ? (
              <tr>
                <td
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Loader size="sm" />
                </td>
              </tr>
            ) : (
              expenses?.map((expense: Expense) => (
                <tr key={expense.documentId}>
                  <td style={{ padding: "12px" }}>
                    <Checkbox
                      checked={selectedExpenses.has(expense.documentId)}
                      onChange={() => handleSelectExpense(expense.documentId)}
                    />
                  </td>
                  <td style={{ padding: "12px", cursor: "pointer" }}>
                    {editingDateId === expense.documentId ? (
                      <Group>
                        <DatePicker
                          value={editingDateValue}
                          onChange={setEditingDateValue}
                          //dropdownType="modal"
                          //withAsterisk
                        />
                        <ActionIcon
                          color="green"
                          onClick={() => saveEditingDate(expense.documentId)}
                          disabled={updatingExpenses.has(expense.documentId)}
                        >
                          {updatingExpenses.has(expense.documentId) ? (
                            <Loader size={16} />
                          ) : (
                            <IconCheckMark size={16} />
                          )}
                        </ActionIcon>
                        <ActionIcon color="red" onClick={cancelEditingDate}>
                          <IconCancel size={16} />
                        </ActionIcon>
                      </Group>
                    ) : (
                      <span
                        onClick={() =>
                          startEditingDate(expense.documentId, expense.date)
                        }
                      >
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>{expense.name}</td>
                  <td style={{ padding: "12px" }}>
                    {expense.amount} {expense.currency}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Select
                      data={categories.map((cat: ExpenseCategory) => ({
                        value: String(cat.id),
                        label: cat.name,
                      }))}
                      value={
                        expense.expense_category
                          ? String(expense.expense_category.id)
                          : ""
                      }
                      placeholder="Selecciona categoría"
                      onChange={(value) =>
                        handleUpdate({
                          callback: null,
                          documentId: expense.documentId,
                          updatedData: {
                            expense_category: value
                              ? { connect: { id: Number(value) } }
                              : { disconnect: true },
                          },
                        })
                      }
                      clearable
                    />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Select
                      data={groups.map((group: ExpenseGroup) => ({
                        value: String(group.id),
                        label: group.name,
                      }))}
                      value={
                        expense.expense_group
                          ? String(expense.expense_group.id)
                          : ""
                      }
                      placeholder="Selecciona grupo"
                      onChange={(value) =>
                        handleUpdate({
                          callback: null,
                          documentId: expense.documentId,
                          updatedData: {
                            expense_group: value
                              ? { connect: { id: Number(value) } }
                              : { disconnect: true },
                          },
                        })
                      }
                      clearable
                    />
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <Switch
                      checked={expense.needsRevision}
                      onChange={(event) =>
                        handleUpdate({
                          callback: null,
                          documentId: expense.documentId,
                          updatedData: {
                            needsRevision: event.currentTarget.checked,
                          },
                        })
                      }
                    />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Button
                      size="xs"
                      color="red"
                      leftSection={
                        deletingExpenses.has(expense.documentId) ? (
                          <Loader size={14} />
                        ) : (
                          <IconTrash size={14} />
                        )
                      }
                      onClick={() => handleDeleteExpense(expense.documentId)}
                      disabled={deletingExpenses.has(expense.documentId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

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
