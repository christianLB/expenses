import { useEffect, useState } from "react";
import { Table, Paper, Group, Stack, Loader } from "@mantine/core";
import { useStrapiCollection } from "../../hooks/useStrapiCollection";
import GroupBreakdownRow from "./GroupBreakdownRow"; // <-- Import subcomponente

export default function YearlyReportTable({ year }) {
  // Reporte anual
  const {
    data: report,
    isLoading: reportLoading,
    error: reportError,
  } = useStrapiCollection("expenses/yearly-report", {
    filters: { year },
  });

  const [tableData, setTableData] = useState([]);
  const [expandedCells, setExpandedCells] = useState({}); // { [cellId]: bool }

  useEffect(() => {
    if (Array.isArray(report)) {
      setTableData(report);
    }
  }, [report]);

  // Genera una key única para cada celda
  function makeCellId(category, monthIndex) {
    return `${category}-${monthIndex}`;
  }

  // Alternar expandir/cerrar
  function toggleExpand(category, monthIndex) {
    const cellId = makeCellId(category, monthIndex);
    const wasExpanded = expandedCells[cellId];
    setExpandedCells((prev) => ({
      ...prev,
      [cellId]: !wasExpanded,
    }));
  }

  return (
    <Stack>
      <Paper withBorder p="md">
        <Group mb="md">
          <span>Yearly Expense Report - {year}</span>
        </Group>

        <Table striped>
          <thead>
            <tr>
              <th>Category</th>
              <th>Enero</th>
              <th>Febrero</th>
              <th>Marzo</th>
              <th>Abril</th>
              <th>Mayo</th>
              <th>Junio</th>
              <th>Julio</th>
              <th>Agosto</th>
              <th>Septiembre</th>
              <th>Octubre</th>
              <th>Noviembre</th>
              <th>Diciembre</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reportLoading ? (
              <tr>
                <td colSpan={14} style={{ textAlign: "center" }}>
                  <Loader size="sm" />
                </td>
              </tr>
            ) : reportError ? (
              <tr>
                <td colSpan={14} style={{ textAlign: "center", color: "red" }}>
                  Error: {reportError.message}
                </td>
              </tr>
            ) : tableData.length > 0 ? (
              tableData.map(({ category, category_id, months, total }) => (
                <>
                  {/* Fila principal de la categoría */}
                  <tr key={category}>
                    <td>
                      <strong>{category}</strong>
                    </td>

                    {months.map((amount, monthIndex) => {
                      const cellId = makeCellId(category, monthIndex);
                      const isExpanded = !!expandedCells[cellId];
                      // Si se hace clic, invertimos el estado "expandido"
                      return (
                        <td
                          key={monthIndex}
                          onClick={() => toggleExpand(category, monthIndex)}
                          style={{ cursor: "pointer", position: "relative" }}
                        >
                          {amount === 0 ? "-" : amount.toFixed(2)}
                          {isExpanded && (
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                backgroundColor: "#eee",
                                fontSize: 10,
                                padding: "0 2px",
                              }}
                            >
                              ▲
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td>
                      <strong>{total.toFixed(2)}</strong>
                    </td>
                  </tr>

                  {/* Ahora renderizamos filas extras (una por mes expandido).
                      Cada fila montará el subcomponente GroupBreakdownRow
                      si isExpanded es true. */}
                  {months.map((_, monthIndex) => {
                    const cellId = makeCellId(category, monthIndex);
                    const isExpanded = !!expandedCells[cellId];
                    // Retorna la "sub-fila" (TR) o null
                    return (
                      <GroupBreakdownRow
                        key={`${cellId}-breakdown`}
                        category={category}
                        categoryId={category_id}
                        monthIndex={monthIndex}
                        year={year}
                        isExpanded={isExpanded}
                        colSpan={14}
                      />
                    );
                  })}
                </>
              ))
            ) : (
              <tr>
                <td colSpan={14} style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
