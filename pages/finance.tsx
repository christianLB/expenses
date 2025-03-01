import { Container, Tabs, Paper, Title } from "@mantine/core";
import ExpenseTable from "../components/tables/ExpenseTable";
import IncomeTable from "../components/tables/IncomeTable";
import InvoiceTable from "../components/tables/InvoiceTable";
import YearlyReportTable from "../components/tables/YearlyExpenseReportTable";

export default function FinancePage() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Finance Management
      </Title>
      <Paper shadow="xs" p="md">
        <Tabs defaultValue="expenses">
          <Tabs.List>
            <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
            <Tabs.Tab value="income">Income</Tabs.Tab>
            <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
            <Tabs.Tab value="yearly">yearly Report</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="expenses" pt="md">
            <ExpenseTable />
          </Tabs.Panel>

          <Tabs.Panel value="income" pt="md">
            <IncomeTable />
          </Tabs.Panel>

          <Tabs.Panel value="invoices" pt="md">
            <InvoiceTable />
          </Tabs.Panel>

          <Tabs.Panel value="yearly" pt="md">
            <YearlyReportTable year={2025} />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}
