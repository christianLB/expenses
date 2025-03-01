import { Container, Title, Paper } from "@mantine/core";
import ExpenseList from "../components/ExpenseList";

export default function List() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">
        Expense List
      </Title>
      <Paper shadow="xs" p="md">
        <ExpenseList />
      </Paper>
    </Container>
  );
}
