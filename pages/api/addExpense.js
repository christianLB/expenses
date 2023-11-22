import qs from "qs";
import authorizeRequest from '../../utils/authorizeRequest';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
const headers = { Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}` };

const buildQueryString = (query) => {
  if (!query) return "";
  const queryString = qs.stringify({ where: query });
  return `&${queryString}`;
};

export const checkForDuplicateExpense = async (incomingExpense) => {
  const query = {
    amount: {
      equals: incomingExpense.amount,
    },
    and: [
      {
        name: {
          equals: incomingExpense.name,
        },
        date: {
          equals: incomingExpense.date,
        },
      },
    ],
  };

  const getResponse = await fetch(`${CMS_URL}/expenses?query=${buildQueryString(query)}`, {
    method: "GET",
    headers,
  });

  const matchingExpenses = await getResponse.json();

  return matchingExpenses.totalDocs > 0;
};

export const createExpense = async (incomingExpense) => {
  const isEmpty = !incomingExpense.name || !incomingExpense.amount.toString();

  if (isEmpty) {
    throw new Error("Name and amount fields are required. Record not saved.");
  }

  // Crear el nuevo gasto
  const postResponse = await fetch(`${CMS_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: headers.Authorization,
    },
    body: JSON.stringify(incomingExpense),
  });

  if (!postResponse.ok) {
    throw new Error("Failed to create expense record.");
  }

  const data = await postResponse.json();
  return data;
};

export default async function handler(req, res) {
  const incomingExpense = req.body;
  try {
    await authorizeRequest(req);
    const isDuplicate = await checkForDuplicateExpense(incomingExpense);

    if (isDuplicate) {
      return res.status(400).json({ message: "Duplicate expense record not saved." });
    }

    const data = await createExpense(incomingExpense);
    res.status(200).json({ data });
  }
  catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
