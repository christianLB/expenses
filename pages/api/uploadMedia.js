import axios from 'axios';
import multer from 'multer';

// Configuración de Multer para manejo de archivos
const upload = multer({ dest: '/tmp' }).single('file');

export default async (req, res) => {
  // Manejar solo solicitudes POST
  if (req.method === 'POST') {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const file = req.file;
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }

      // Preparar el formulario de datos para la carga
      const formData = new FormData();
      formData.append('file', file);

      const headers = { Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}` }

      // Endpoint de Payload CMS
      const CMS_URL = `${process.env.NEXT_PUBLIC_CMS_API_URL}/media`;

      try {
        // Realizar la petición POST a Payload CMS
        const payloadResponse = await axios.post(CMS_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Incluir cualquier otro encabezado requerido, como tokens de autenticación
          },
        });

        // Devolver la respuesta de Payload CMS al cliente
        res.status(200).json(payloadResponse.data);
      } catch (error) {
        res.status(500).json({ error: error.message || 'An error occurred during the file upload.' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
