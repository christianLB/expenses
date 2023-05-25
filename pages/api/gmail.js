import { google } from "googleapis";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

export default async function handler(req, res) {
  console.log(`GMAIL_CLIENT_ID: ${process.env.GMAIL_CLIENT_ID}`);
  console.log(`GMAIL_CLIENT_SECRET: ${process.env.GMAIL_CLIENT_SECRET}`);
  console.log(`GMAIL_REDIRECT_URI: ${process.env.GMAIL_REDIRECT_URI}`);
  console.log(`GMAIL_REFRESH_TOKEN: ${process.env.GMAIL_REFRESH_TOKEN}`);
  console.log(`PROD_URL: ${process.env.PROD_URL}`);

  const prodUrl = process.env.PROD_URL;
  const localUrl = process.env.LOCAL_URL;
  const baseUrl = process.env.NODE_ENV === "development" ? localUrl : prodUrl;

  if (req.method === "POST") {
    const label = req.body.label; // Assume that the label is in the body of the POST request

    try {
      const messages = await listMessages(
        oAuth2Client,
        `label:${label} is:unread`
      );
      const outMessages = [];
      for (let msg of messages) {
        const message = await getMessage(oAuth2Client, msg.id);
        const attachments = await getAttachments(oAuth2Client, msg.id);
        message.attachments = attachments;

        // Parse the expense from the message
        const expense = message.attachments[0].text;
        //Insert the expense into the database
        const response = await fetch("http://localhost:3001/api/addExpense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense),
        });

        // Check if the request was successful
        if (response.ok) {
          // Mark the message as read
          //await markAsRead(oAuth2Client, msg.id);
          outMessages.push(expense);
        } else {
          console.error(
            "Failed to insert expense into database:",
            await response.text()
          );
        }
      }

      res.status(200).send(outMessages);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing messages");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}

async function markAsRead(auth, messageId) {
  const gmail = google.gmail({ version: "v1", auth });

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      removeLabelIds: ["UNREAD"],
    },
  });
}

async function listMessages(auth, query) {
  return new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: "v1", auth });

    gmail.users.messages.list(
      {
        userId: "me",
        q: query,
      },
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        if (!res.data.messages) {
          resolve([]);
          return;
        }

        resolve(res.data.messages);
      }
    );
  });
}

async function getMessage(auth, messageId) {
  return new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: "v1", auth });

    gmail.users.messages.get(
      {
        userId: "me",
        id: messageId,
      },
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.data);
      }
    );
  });
}

async function getAttachmentData(auth, messageId, attachmentId) {
  return new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: "v1", auth });

    gmail.users.messages.attachments.get(
      {
        userId: "me",
        messageId: messageId,
        id: attachmentId,
      },
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res.data.data);
      }
    );
  });
}

async function getAttachments(auth, messageId) {
  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
  });

  const parts = res.data.payload.parts;

  const attachmentsPromises = parts.map(async (part) => {
    if (part.filename && part.filename.length > 0) {
      if (part.body.attachmentId) {
        const attachmentData = await getAttachmentData(
          auth,
          messageId,
          part.body.attachmentId
        );
        const attachment = {
          filename: part.filename,
          mimeType: part.mimeType,
          size: part.body.size,
          data: attachmentData,
        };

        // If the attachment is a PDF, extract the text
        if (part.mimeType === "application/base64") {
          const params = new URLSearchParams();
          params.append("pdfData", attachmentData);
          params.append("password", "72298830D");

          const response = await fetch("http://localhost:3001/api/pdf2json", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          });
          const data = await response.json();
          attachment.text = data.text;
        }

        return attachment;
      }
    }
  });

  const attachments = await Promise.all(attachmentsPromises);

  // Filter out any undefined values (attachments without an attachmentId)
  return attachments.filter(Boolean);
}
