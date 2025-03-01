import { useState, useEffect } from "react";
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useStrapiCollection } from "../hooks/useStrapiCollection";

interface Client {
  id: string;
  name: string;
}

interface Income {
  name: string;
  amount: number;
  date: string;
  currency: string;
  selected?: boolean;
  client?: string | null;
}

interface BBVAMonthlyListProps {
  data: { incomes: Income[] };
}

export default function BBVAIncomesList({ data }: BBVAMonthlyListProps) {
  const { data: clients, isLoading: loadingClients } =
    useStrapiCollection<Client[]>("clients");
  const { create, isLoading: isCreating } = useStrapiCollection("incomes");

  const [movements, setMovements] = useState<Income[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    if (data?.incomes) {
      setMovements(
        data.incomes.map((movement) => ({
          ...movement,
          selected: false,
          client: null,
        }))
      );
    }
  }, [data]);

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);
    setMovements(movements.map((mov) => ({ ...mov, selected: checked })));
  };

  const handleSelectOne = (index: number, checked: boolean) => {
    const newMovements = [...movements];
    newMovements[index].selected = checked;
    setMovements(newMovements);
    setAllSelected(newMovements.every((mov) => mov.selected));
  };

  const handleClientChange = (index: number, value: string | null) => {
    const newMovements = [...movements];
    newMovements[index].client = value;
    setMovements(newMovements);
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
            client: mov.client,
            currency: mov.currency,
          })
        )
      );

      notifications.show({
        title: "Success",
        message: "Incomes saved successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save incomes",
        color: "red",
      });
    }
  };

  const clientOptions = //@ts-ignore
    clients?.map((client: Client) => ({
      value: String(client.id),
      label: client.name,
    })) || [];

  if (data.incomes?.length === 0) {
    return null;
  }

  return (
    <Stack>
      <Paper withBorder p="md">
        <Text size="lg" weight={500} mb="md">
          Income Movements
        </Text>
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
              <th>Client</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement, index) => (
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
                    data={clientOptions}
                    value={movement.client || ""}
                    onChange={(value) => handleClientChange(index, value)}
                    placeholder="Select client"
                    clearable
                    disabled={isCreating}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
