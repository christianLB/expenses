import { useState } from "react";
import {
  Table,
  Button,
  Paper,
  Group,
  Stack,
  Loader,
  Pagination,
} from "@mantine/core";
import { useStrapiCollection } from "../../hooks/useStrapiCollection";

interface Invoice {
  id: number;
  invoiceNumber: string;
  precioUnitario: number;
  cantidad: number;
  concepto: string;
  fechaInvoice: string;
  yearFacturado: number;
  archivos: any[];
  total: number;
  documentId: string;
  date: string;
  client: any;
  currency: string;
}

export default function InvoiceTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: invoices, isLoading } = useStrapiCollection("invoices", {
    pagination: { page, pageSize },
  });

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group justify="space-between" mb="md">
          <span>Invoice List</span>
        </Group>

        <Table striped>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  <Loader size="sm" />
                </td>
              </tr>
            ) : (
              invoices?.map((invoice: Invoice) => (
                <tr key={invoice.documentId}>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.client}</td>
                  <td>
                    {invoice.total} {invoice.currency}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Group mt="md">
          <Pagination
            total={Math.ceil((invoices?.length || 1) / pageSize)}
            value={page}
            onChange={setPage}
          />
        </Group>
      </Paper>
    </Stack>
  );
}
