// pages/api/readmail.js
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';

const imapConfig1 = {
  user: process.env.GMAIL_USER,
  password: process.env.GMAIL_APP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  markSeen: true,
  markRead: true,
  tlsOptions: { rejectUnauthorized: false },
};

// Esta función asume que tu endpoint puede manejar la carga de archivos
const FormData = require('form-data');
const fetch = require('node-fetch'); // Asegúrate de tener node-fetch si no estás en un entorno de navegador

async function sendAttachmentToEndpoint(attachmentData) {
  try {
    const formData = new FormData();

    // Convertir el contenido del adjunto en un stream o buffer adecuado
    const buffer = Buffer.from(attachmentData.content, 'binary');
    formData.append('file', buffer, attachmentData.filename);

    const response = await fetch(`${process.env.API_URL}/addExpenseWithMedia`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders() // Importante para incluir los encabezados correctos del formulario
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Adjunto enviado correctamente:', responseData);
  } catch (error) {
    console.error('Error al enviar adjunto:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const getEmails = new Promise((resolve, reject) => {
        console.log('getting emails')
        const imap = new Imap(imapConfig1);
        //const imap = new Imap(imapConfig2)

        imap.on('error', function (err) {
          console.log('IMAP Error:', err);
          reject(err);
        });

        imap.once('ready', function () {
          console.log('ready')
          if (imap.state !== 'authenticated') {
            console.log('Reintentando la conexión...');
            imap.connect();
          }

          imap.openBox('BBVA/gastos', false, () => {
            imap.search(['UNSEEN', ['SINCE', new Date('2023-01-01')]], (err, results) => {
              if (err) {
                console.log('Error en búsqueda:', err);
                reject(err);
              }
              // Verificar si hay resultados antes de proceder
              if (results.length > 0) {
                const f = imap.fetch(results, { bodies: '', markSeen: true });
                f.on('message', msg => {

                  msg.on('body', stream => {
                    simpleParser(stream, async (err, parsed) => {
                      if (err) {
                        console.log('Error en el parseo:', err);
                        reject(err);
                      }

                      // Procesar cada adjunto
                      for (const attachment of parsed.attachments) {
                        // Aquí procesas cada adjunto y lo preparas para ser enviado
                        // Puedes convertirlo en base64 o manejarlo de la forma que tu endpoint requiere
                        const attachmentData = {
                          filename: attachment.filename,
                          content: attachment.content, // o attachment.content.toString('base64')
                          contentType: attachment.contentType
                        };

                        // Enviar el adjunto a tu endpoint
                        await sendAttachmentToEndpoint(attachmentData);
                      }
                    });
                  });
                });

                f.once('end', () => {
                  resolve(emails);
                  imap.end();
                });
              } else {
                resolve([]);
              }
              const emails = [];

            });
          });
        });

        imap.connect();
      });

      const emails = await getEmails;
      res.status(200).json({ emails });
    } catch (error) {
      console.error('Error general:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
