import authorizeRequest from './authorizeRequest';

// Main
export default async function handler(req, res) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;

  try {
    await authorizeRequest(req);

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
  catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
