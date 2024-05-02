import FormData from 'form-data';
import fetch from 'node-fetch';
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { createWithMedia, addMediaToExpense } from './expensesApi'

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

const { API_URL } = process.env


const labels = {
  'BBVA/gastos': { url: `${API_URL}/parseBBVA`, next: createWithMedia },
  'Mercadona': { url: `${API_URL}/parseMercadonga`, next: addMediaToExpense }
}

async function uploadAttachment(attachmentData, label) {
  try {
    const formData = new FormData();

    // Convertir el contenido del adjunto en un stream o buffer adecuado
    const buffer = Buffer.from(attachmentData.content, 'binary');
    formData.append('file', buffer, { filename: `${label}-${attachmentData.filename}` });
    formData.append('label', label);
    // fetch espera una URL completa para el endpoint, ajusta según sea necesario
    const response = await fetch(`${API_URL}/payloadUpload`, { // Ajusta la URL según sea necesario
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // Esto es necesario en Node.js; en el navegador, omitir
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Adjunto enviado correctamente:', responseData.doc);
    return responseData.doc; // Devuelve los datos de respuesta para su uso externo
  } catch (error) {
    console.error('Error al enviar adjunto:', error.message);
    throw error; // Lanzar el error permite manejarlo donde se llame a esta función
  }
}


export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { label } = req.query;
      if (!label) throw "Missing label in query."

      const getEmails = new Promise((resolve, reject) => {
        console.log('getting emails', label)
        const imap = new Imap(imapConfig1);
        //const imap = new Imap(imapConfig2)

        imap.on('error', function (err) {
          console.log('IMAP Error:', err.message);
          reject(err);
        });

        imap.once('ready', function () {
          console.log('ready')
          if (imap.state !== 'authenticated') {
            console.log('Reintentando la conexión...');
            imap.connect();
          }

          imap.openBox(label, false, () => {
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
                        console.log('Error en el parseo:', err.message);
                        reject(err);
                      }

                      // Procesar cada adjunto
                      for (const attachment of parsed.attachments) {
                        const { url, next } = labels[label];

                        const media = await uploadAttachment(attachment, label);
                        console.log('Adjunto procesado:', media);

                        const parsed = await fetch(url, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(media),
                        });
                        const { data } = await parsed.json();
                        console.log(`----PARSED ${label}---`)
                        //console.log(data)
                        console.log(`----PARSED ${label}---`)
                        await next(media.id, data);
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
