import { Table, Loader } from "@mantine/core";
import { useStrapiCollection } from "../../hooks/useStrapiCollection";

/**
 * Muestra una fila (tr) con el breakdown de grupos para la combinación {category, monthIndex, year}.
 * Si no está "expandido", simplemente retorna null para no renderizar nada.
 */
function GroupBreakdownRow({
  category,
  categoryId,
  monthIndex,
  year,
  isExpanded,
  colSpan = 14,
}) {
  // monthIndex (0..11). Convertir a "01", "02", etc.
  const realMonth = String(monthIndex + 1).padStart(2, "0");

  // Llamamos al mismo hook, pero con una colección distinta, p. ej. "expenses/groups"
  // Ajusta el endpoint / la colección según tu ruta en Strapi
  const {
    data: groupData,
    isLoading,
    error,
  } = useStrapiCollection("expenses/groups", {
    // Estos son los "filters" que tu proxy enviará a Strapi
    enabled: isExpanded,
    filters: {
      year,
      month: realMonth,
      category: categoryId, // Ajusta si en tu backend la categoría se filtra por ID en lugar de nombre
    },
  });

  if (!isExpanded) {
    return null; // No renderiza nada si no está expandido
  }

  return (
    <tr>
      <td colSpan={colSpan} style={{ backgroundColor: "#f7f7f7" }}>
        {isLoading && <Loader size="sm" />}
        {error && (
          <div style={{ color: "red" }}>
            Error al cargar grupos: {error.message}
          </div>
        )}
        {!isLoading && !error && groupData && (
          <>
            <strong>
              Breakdown para “{category}” / Mes {monthIndex + 1}
            </strong>
            {groupData.length === 0 ? (
              <div style={{ marginTop: 4 }}>
                <em>No hay grupos</em>
              </div>
            ) : (
              <Table highlightOnHover style={{ marginTop: 8 }}>
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {groupData.map((g: any) => (
                    <tr key={g.group_id}>
                      <td>{g.group_name || "Sin nombre"}</td>
                      <td>{Number(g.total_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        )}
      </td>
    </tr>
  );
}

export default GroupBreakdownRow;
