import qs from "qs";

export default async function handler(req, res) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
  const headers = { Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}` }
  // The incoming expense data
  const incomingExpense = req.body; // Assuming this is coming in the request body

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

  const buildQueryString = (query) => {
    if (!query) return "";
    const queryString = qs.stringify({ where: query });
    return `&${queryString}`;
  };
  const getResponse = await fetch(
    `${CMS_URL}/expenses?query=${buildQueryString(query)}`,
    {
      method: "GET",
      headers
    }
  );

  const matchingExpenses = await getResponse.json();
  const isDuplicate = matchingExpenses.totalDocs > 0;
  const isEmpty =
    !incomingExpense.name.length > 0 ||
    !incomingExpense.amount.toString().length > 0;

  if (isDuplicate)
    // If any matching expenses are found, it's a duplicate
    return res
      .status(400)
      .json({ message: "Duplicate expense record not saved." });

  if (isEmpty)
    return res.status(400).json({
      message: "name and amount fields are required. record not saved.",
    });

  const postResponse = await fetch(`${CMS_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: headers.Authorization
    },
    body: JSON.stringify(incomingExpense),
  });
  const data = await postResponse.json();
  console.log(data, incomingExpense.date, incomingExpense.valueDate);
  return res.status(200).json({ data });
}
