import { google } from "googleapis";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const API_URL = process.env.API_URL;

export default async function handler(req, res) {
  console.log(`checking gmail for ${req.body.label}`);
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  if (req.method === "POST") {
    const label = req.body.label; // Assume that the label is in the body of the POST request

    try {
      const messages = await listMessages(
        gmail,
        `label:${label} is:unread`,
        session.user.email
      );
      const outMessages = [];
      for (let msg of messages) {
        const message = await getMessage(gmail, msg.id, session.user.email);
        const attachments = await getAttachments(
          gmail,
          msg.id,
          session.user.email
        );
        message.attachments = attachments;

        // Parse the expense from the message
        const expense = message.attachments[0].text;
        //Insert the expense into the database
        const response = await fetch(`${API_URL}/addExpense`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense),
        });

        // Check if the request was successful
        if (response.ok) {
          // Mark the message as read
          outMessages.push(expense);
          await markAsRead(gmail, msg.id, session.user.email);
        } else {
          const resp = await response.text();
          if (resp.includes("Duplicate expense record not saved")) {
            // If the expense is a duplicate, mark the message as read
            await markAsRead(gmail, msg.id, session.user.email);
          }
          console.error("Failed to insert expense into database:", resp);
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

async function markAsRead(gmail, messageId, sesionEmail) {
  await gmail.users.messages.modify({
    userId: sesionEmail,
    id: messageId,
    requestBody: {
      removeLabelIds: ["UNREAD"],
    },
  });
}

async function listMessages(gmail, query, sesionEmail) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: sesionEmail,
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

async function getMessage(gmail, messageId, sesionEmail) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.get(
      {
        userId: sesionEmail,
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

async function getAttachmentData(gmail, messageId, attachmentId, sesionEmail) {
  return new Promise((resolve, reject) => {
    gmail.users.messages.attachments.get(
      {
        userId: sesionEmail,
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

async function getAttachments(gmail, messageId, sesionEmail) {
  const res = await gmail.users.messages.get({
    userId: sesionEmail,
    id: messageId,
  });
  console.log("sessionEmail", sesionEmail, messageId);

  const parts = res.data.payload.parts;

  const attachmentsPromises = parts.map(async (part) => {
    if (part.filename && part.filename.length > 0) {
      if (part.body.attachmentId) {
        const attachmentData = await getAttachmentData(
          gmail,
          messageId,
          part.body.attachmentId,
          sesionEmail
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

          const response = await fetch(`${API_URL}/pdf2json`, {
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
