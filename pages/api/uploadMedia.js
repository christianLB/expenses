import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

// Configuración de Multer para manejo de archivos
const upload = multer({ dest: "tmp/" }).single("file");

export default function handler(req, res) {
  if (req.method === "POST") {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Multer parsea el archivo y lo coloca en req.file
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path));
      formData.append("filename", file.originalname); // 'originalname' es proporcionado por multer

      // Endpoint de Payload CMS
      const CMS_URL = `${process.env.NEXT_PUBLIC_CMS_API_URL}/media`;

      // Realizar la petición POST a Payload CMS
      axios
        .post(CMS_URL, formData, {
          headers: {
            ...formData.getHeaders(),
            Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
          },
        })
        .then((payloadResponse) => {
          // Eliminar el archivo temporalmente almacenado
          fs.unlinkSync(file.path);

          // Devolver la respuesta de Payload CMS al cliente
          res.status(200).json(payloadResponse.data);
        })
        .catch((error) => {
          // Eliminar el archivo temporalmente almacenado
          fs.unlinkSync(file.path);

          res.status(500).json({
            error:
              error.response?.data ||
              "An error occurred during the file upload.",
          });
        });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
