import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Checkbox,
  Select,
  Textarea,
  Stack,
  Loader,
  Paper,
  Text,
} from "@mantine/core";

import { IconFileTypePdf, IconTrash } from "@tabler/icons-react";

import { DateInput } from "@mantine/dates";

const ExpenseModal = ({
  expenseData,
  onSave,
  onClose,
  isOpen,
  expenseGroups,
  expenseCategories,
}) => {
  const [formData, setFormData] = useState({
    ...expenseData,
  });

  const [updating, setUpdating] = useState<boolean>(false);

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = async (event) => {
    setUpdating(true);
    event.preventDefault();
    delete formData.archivos;
    await onSave(formData);
    setUpdating(false);
    onClose();
  };

  const parseBBVA = async (documento) => {
    try {
      setUpdating(true);
      const response = await fetch("./api/parseBBVA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documento),
      });
      const { data } = await response.json();
      setFormData({ ...formData, ...data });
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (expenseData) {
      setFormData({
        ...expenseData,
        category: expenseData?.category?.id ?? "",
        group: expenseData?.group?.id ?? "",
      });
    }
  }, [expenseData]);

  return (
    <Modal
      size="xl"
      opened={isOpen}
      onClose={onClose}
      title={`Editar gasto ${formData.id}`}
      centered
    >
      <form onSubmit={handleSave}>
        <Stack>
          <TextInput
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
            disabled={updating}
          />
          <Group wrap={"nowrap"}>
            <NumberInput
              w={"20%"}
              placeholder="Amount"
              value={formData.amount}
              onChange={(value) => handleInputChange("amount", value)}
              required
              disabled={updating}
            />
            <DateInput
              placeholder="Date"
              value={new Date(formData.date ?? new Date().toISOString())}
              onChange={(value) => handleInputChange("date", value)}
              disabled={updating}
            />
            {/* ... Other inputs for account, currency, etc. ... */}
            <Select
              placeholder="Category"
              value={formData?.category ?? ""}
              onChange={(value) => handleInputChange("category", value)}
              data={(expenseCategories ?? []).map((category) => {
                return { value: category.id, label: category.name };
              })}
              disabled={updating}
            />
            <Select
              placeholder="Group"
              value={formData?.group ?? ""}
              onChange={(value) => handleInputChange("group", value)}
              data={(expenseGroups ?? []).map((group) => {
                return { value: group.id, label: group.name };
              })}
              disabled={updating}
            />
          </Group>
          <Textarea
            placeholder="Notes"
            value={formData?.notes ?? ""}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            disabled={updating}
          />
          <Checkbox
            label="Needs Revision"
            checked={formData.needsRevision}
            onChange={(e) =>
              handleInputChange("needsRevision", e.target.checked)
            }
            disabled={updating}
          />
          {formData.archivos?.map(({ documento }, index) => {
            return (
              <Paper mx="xs" p="xs" withBorder key={index}>
                <Group justify="space-between">
                  <Group>
                    <IconFileTypePdf width="20" height="20" />
                    <Text>
                      {documento.filename}
                      {documento?.createdAt ?? ""}
                    </Text>
                  </Group>
                  <Group>
                    <Button
                      variant="tertiary"
                      disabled={!formData.archivos?.length || updating}
                      onClick={() => parseBBVA(documento)}
                    >
                      BBVA
                    </Button>
                    <IconTrash width="20" height="20" />
                  </Group>
                </Group>
              </Paper>
            );
          })}
          <Group justify="right" mt="md">
            {updating && <Loader />}
            <Button type="submit">Guardar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
