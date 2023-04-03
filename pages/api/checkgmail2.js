import { google } from "googleapis";

const serviceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
const userEmail = process.env.USER_EMAIL;

const jwtClient = new google.auth.JWT({
  email: serviceAccountKey.client_email,
  key: serviceAccountKey.private_key,
  scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  subject: userEmail,
});

export default async function handler(req, res) {
  try {
    await jwtClient.authorize();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error authorizing service account" });
    return;
  }

  const gmail = google.gmail({ version: "v1", auth: jwtClient });

  try {
    const { data } = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      maxResults: 10,
    });
    const messages = await Promise.all(
      data.messages.map(async (message) => {
        const messageData = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "metadata",
          metadataHeaders: ["subject", "from", "to", "date"],
        });

        return messageData.data;
      })
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching messages" });
  }
}
