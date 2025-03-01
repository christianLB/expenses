import { useState } from "react";
import {
  Table,
  Paper,
  Group,
  Stack,
  Loader,
  Pagination,
  ActionIcon,
  Checkbox,
  Button,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck as IconCheckMark,
  IconX as IconCancel,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useStrapiCollection } from "../../hooks/useStrapiCollection";

interface Client {
  id: number;
  name: string;
}

interface Income {
  id: number;
  amount: number;
  name: string;
  client: Client;
  currency: string;
  date: string;
  documentId: string;
}

export default function IncomeTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [editingDateId, setEditingDateId] = useState(null);
  const [editingDateValue, setEditingDateValue] = useState(null);
  const [updatingIncomes, setUpdatingIncomes] = useState(new Set());
  const [selectedIncomes, setSelectedIncomes] = useState(new Set());
  const [deletingIncomes, setDeletingIncomes] = useState(new Set());

  const {
    data: incomes,
    isLoading,
    update,
    delete: deleteIncome,
  } = useStrapiCollection("incomes", {
    pagination: { page, pageSize },
  });

  // Función para actualizar la fecha con feedback y loader
  const handleUpdate = async ({ documentId, updatedData, callback }) => {
    setUpdatingIncomes((prev) => new Set(prev).add(documentId));
    try {
      await update({ documentId, updatedData });
      showNotification({
        title: "Éxito",
        message: "Registro actualizado exitosamente",
        color: "green",
      });
      if (callback) callback();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Error al actualizar el registro",
        color: "red",
      });
    } finally {
      setUpdatingIncomes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  // Funciones para editar la fecha
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

  // Funciones de selección
  const handleSelectIncome = (documentId) => {
    setSelectedIncomes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(documentId)) newSet.delete(documentId);
      else newSet.add(documentId);
      return newSet;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIncomes(
        new Set(incomes.map((income: Income) => income.documentId))
      );
    } else {
      setSelectedIncomes(new Set());
    }
  };

  // Función para eliminar un registro con feedback y loader
  const handleDeleteIncome = async (documentId) => {
    setDeletingIncomes((prev) => new Set(prev).add(documentId));
    try {
      await deleteIncome(documentId);
      showNotification({
        title: "Éxito",
        message: "Registro eliminado exitosamente",
        color: "green",
        icon: <IconCheckMark size={18} />,
      });
      setSelectedIncomes((prev) => {
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
      setDeletingIncomes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <Checkbox
            label="Seleccionar Todos"
            checked={selectedIncomes.size === incomes?.length}
            indeterminate={
              selectedIncomes.size > 0 && selectedIncomes.size < incomes?.length
            }
            onChange={(event) => handleSelectAll(event.currentTarget.checked)}
          />
          <span>Income List</span>
          <Button
            color="red"
            leftSection={
              deletingIncomes.size > 0 ? (
                <Loader size={16} />
              ) : (
                <IconTrash size={16} />
              )
            }
            disabled={selectedIncomes.size === 0 || deletingIncomes.size > 0}
            onClick={() => {
              selectedIncomes.forEach((documentId) => {
                handleDeleteIncome(documentId);
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
              <th style={{ padding: "12px" }}>Cliente</th>
              <th style={{ padding: "12px" }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Loader size="sm" />
                </td>
              </tr>
            ) : (
              incomes?.map((income: Income) => (
                <tr key={income.documentId}>
                  <td style={{ padding: "12px" }}>
                    <Checkbox
                      checked={selectedIncomes.has(income.documentId)}
                      onChange={() => handleSelectIncome(income.documentId)}
                    />
                  </td>
                  <td style={{ padding: "12px", cursor: "pointer" }}>
                    {editingDateId === income.documentId ? (
                      <Group>
                        <DatePicker
                          value={editingDateValue}
                          onChange={setEditingDateValue}
                          //dropdownType="modal"
                          //withAsterisk
                        />
                        <ActionIcon
                          color="green"
                          onClick={() => saveEditingDate(income.documentId)}
                          disabled={updatingIncomes.has(income.documentId)}
                        >
                          {updatingIncomes.has(income.documentId) ? (
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
                          startEditingDate(income.documentId, income.date)
                        }
                      >
                        {new Date(income.date).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>{income.client?.name}</td>
                  <td style={{ padding: "12px" }}>
                    {income.amount} {income.currency}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Group mt="md">
          <Pagination
            total={Math.ceil((incomes?.length || 1) / pageSize)}
            value={page}
            onChange={setPage}
          />
        </Group>
      </Paper>
    </Stack>
  );
}
