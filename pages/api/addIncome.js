import authorizeRequest from './authorizeRequest';

export default async function handler(req, res) {
  try {
    await authorizeRequest(req);

    const CMS_URL = process.env.NEXT_PUBLIC_CMS_API_URL;
    // The incoming income data
    const incomingIncome = req.body; // Assuming this is coming in the request body

    const isEmpty =
      !incomingIncome.name.length > 0 ||
      !incomingIncome.amount.toString().length > 0;

    if (isEmpty)
      return res.status(400).json({
        message: "name and amount fields are required. record not saved.",
      });

    const postResponse = await fetch(`${CMS_URL}/incomes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}` },
      body: JSON.stringify(incomingIncome),
    });
    const data = await postResponse.json();
    console.log(data, incomingIncome.date, incomingIncome.valueDate);
    return res.status(200).json({ data });
  }
  catch (error) {
    return res.status(401).json({ error: error.message });
  }
}
