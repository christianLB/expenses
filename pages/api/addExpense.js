import qs from "qs";

export default async function handler(req, res) {
  const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
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
      },
    ],
  };

  const buildQueryString = (query) => {
    if (!query) return "";
    const queryString = qs.stringify({ where: query });
    return `&${queryString}`;
  };
  console.log(`${CMS_URL}/expenses?query=${buildQueryString(query)}`);
  const getResponse = await fetch(
    `${API_URL}/expenses?query=${buildQueryString(query)}`,
    {
      method: "GET",
    }
  );

  const matchingExpenses = await getResponse.json();
  const isDuplicate = matchingExpenses.totalDocs > 0;
  if (isDuplicate) {
    // If any matching expenses are found, it's a duplicate
    res.status(400).json({ message: "Duplicate expense record not saved." });
  } else {
    if (incomingExpense.name && incomingExpense.amount) {
      const postResponse = await fetch(`${CMS_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomingExpense),
      });
      const data = await postResponse.json();
      console.log(data, incomingExpense.date, incomingExpense.valueDate);
      res.status(200).json({ data });
    }
    res.status(200).json({ message: "empty expense" });
  }
}
