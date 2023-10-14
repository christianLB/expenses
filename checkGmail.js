// checkGmail.js
const { google } = require('googleapis');
const fetch = require('node-fetch');  // Asegúrate de tener node-fetch instalado

const API_URL = process.env.API_URL;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;  // Añade tu refresh token aquí

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

async function checkGmail() {
  console.log(`Checking Gmail...`);

  try {
    const label = 'your-label-here';  // Añade tu etiqueta aquí
    const messages = await listMessages(gmail, `label:${label} is:unread`, 'me');
    const outMessages = [];

    for (let msg of messages) {
      const message = await getMessage(gmail, msg.id, 'me');
      const attachments = await getAttachments(gmail, msg.id, 'me');
      message.attachments = attachments;

      const expense = message.attachments[0].text;
      const response = await fetch(`${API_URL}/addExpense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        outMessages.push(expense);
        await markAsRead(gmail, msg.id, 'me');
      } else {
        const resp = await response.text();
        if (resp.includes('Duplicate expense record not saved')) {
          await markAsRead(gmail, msg.id, 'me');
        }
        console.error('Failed to insert expense into database:', resp);
      }
    }

    console.log('Processed messages:', outMessages);

  } catch (error) {
    console.error('Error:', error);
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

// Exporta la función checkGmail para usarla en otro lugar
module.exports = checkGmail;
