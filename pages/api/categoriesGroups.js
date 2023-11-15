// Main
export default async function handler(req, res) {
  const session = await getSession({ req });
  const apiKeyHeader = req.headers["x-api-key"];

  if (!(session || apiKeyHeader === process.env.UI_API_KEY)) {
    // Si no hay sesión y el API Key es inválido, devuelve un error de autenticación
    return res.status(401).json({ error: "No autorizado" });
  }

  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;

  try {
    // Preparar las URLs para cada petición
    const groupsUrl = `${CMS_URL}/expense-group?limit=0`;
    const categoriesUrl = `${CMS_URL}/expense-category?limit=0`;

    // Realizar todas las peticiones en paralelo
    const headers = {
      Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
    };
    const [groups, categories] = await Promise.all([
      fetch(groupsUrl, { method: "GET", headers }).then((r) => r.json()),
      fetch(categoriesUrl, { method: "GET", headers }).then((r) => r.json()),
    ]);

    return res.status(200).json({ categories, groups });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
