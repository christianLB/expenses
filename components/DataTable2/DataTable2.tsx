import React, { useMemo } from "react";
import { useTable, useExpanded } from "react-table";

function DataTable({ data }) {
  // La estructura de las columnas incluye una para cada mes y una para el total
  const columns = useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
      },
      ...Array.from({ length: 12 }).map((_, i) => {
        return {
          Header: i,
          accessor: `${i}`,
        };
      }),
      {
        Header: "Total",
        accessor: "total",
      },
    ],
    []
  );

  // Usa useTable y useExpanded para configurar la tabla
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable({ columns, data }, useExpanded); // useExpanded para manejar las expansiones
  console.log(data);
  // Renderiza la tabla con filas expandibles
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th key={column.name} {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            // Renderiza la fila normal
            <React.Fragment key={row.id}>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.name} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
              {/*
                Si la fila está expandida, renderiza otra fila debajo con los detalles.
                Puedes personalizar esto para renderizar cualquier componente o estructura que necesites.
              */}
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>
                    {/* Aquí renderizas el contenido expandido, por ejemplo, una subtabla o detalles adicionales */}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}

export default DataTable;
