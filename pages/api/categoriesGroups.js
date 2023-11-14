// Main
export default async function handler(req, res) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;

  try {
    // Preparar las URLs para cada petición
    const groupsUrl = `${CMS_URL}/expense-group?limit=0`;
    const categoriesUrl = `${CMS_URL}/expense-category?limit=0`;

    // Realizar todas las peticiones en paralelo
    const [groups, categories] = await Promise.all([
      fetch(groupsUrl, { method: 'GET' }).then(r => r.json()),
      fetch(categoriesUrl, { method: 'GET' }).then(r => r.json()),
    ]);

    return res.status(200).json({ categories, groups });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

