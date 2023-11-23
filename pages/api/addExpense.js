import qs from "qs";
import authorizeRequest from "./authorizeRequest";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
const headers = {
  Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
};

const buildQueryString = (query) => {
  if (!query) return "";
  const queryString = qs.stringify({ where: query });
  return `&${queryString}`;
};

export const checkForDuplicateExpense = async (incomingExpense) => {
  try {
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

    const response = await fetch(`${CMS_URL}/expenses?query=${buildQueryString(query)}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching expenses: ${response.statusText}`);
    }

    const matchingExpenses = await response.json();
    return matchingExpenses.totalDocs > 0;
  } catch (error) {
    console.error(error); // Log para el desarrollador
    throw new Error('There was an error checking for duplicate expenses.'); // Mensaje de error para el usuario
  }
};

export const createExpense = async (incomingExpense) => {
  try {
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
    const data = await postResponse.json();
    return data;
  } catch (error) {
    console.error(error); // Log para el desarrollador
    throw new Error('Failed to create the expense record.'); // Mensaje de error para el usuario
  }
};

export default async function handler(req, res) {
  try {
    await authorizeRequest(req);
    const isDuplicate = await checkForDuplicateExpense(incomingExpense);

    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "Duplicate expense record not saved." });
    }

    const data = await createExpense(incomingExpense);
    res.status(200).json({ data });
    // ...tu lógica de la función handler...
  } catch (error) {
    console.error(error); // Log completo para el desarrollador
    // Decide si quieres devolver el mensaje de error completo o uno genérico
    res.status(error.status || 500).json({ error: error.message || 'An internal server error occurred' });
  }
}
