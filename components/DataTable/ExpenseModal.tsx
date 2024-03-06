import React, { useState } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
  Checkbox,
  Select,
} from "@mantine/core";

const ExpenseModal = ({ expenseData, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    ...expenseData,
  });

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Editar gasto">
      <form onSubmit={handleSave}>
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
        <NumberInput
          label="Amount"
          value={formData.amount}
          onChange={(value) => handleInputChange("amount", value)}
          required
        />
        <TextInput
          label="Balance"
          value={formData.balance}
          onChange={(e) => handleInputChange("balance", e.target.value)}
        />
        <TextInput
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          required
        />
        {/* ... Other inputs for account, currency, etc. ... */}
        <Checkbox
          label="Needs Revision"
          checked={formData.needsRevision}
          onChange={(e) => handleInputChange("needsRevision", e.target.checked)}
        />
        {/* Assuming 'user' is a select field with options */}
        <Select
          label="User"
          value={formData.user}
          onChange={(value) => handleInputChange("user", value)}
          data={[]}
        />
        {/* Repeat for category, group, and any other fields you have */}
        <Group justify="right" mt="md">
          <Button type="submit">Guardar</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
