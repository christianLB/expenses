import axios from "axios";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

// Configuración de Multer para manejo de archivos
const upload = multer({ dest: "tmp/" }).single("file");

export const config = {
  api: {
    bodyParser: false,
  },
};

export const uploadToCMS = async (file) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(file.path));
  formData.append("filename", file.originalname);

  const CMS_URL = `${process.env.NEXT_PUBLIC_CMS_API_URL}/media`;

  try {
    const response = await axios.post(CMS_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
      },
    });

    // Eliminar el archivo temporalmente almacenado
    fs.unlinkSync(file.path);

    return response.data;
  } catch (error) {
    // Eliminar el archivo temporalmente almacenado
    fs.unlinkSync(file.path);
    throw error;
  }
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const mediaData = await uploadToCMS(req.file);
        res.status(200).json(mediaData);
      } catch (error) {
        res.status(500).json({
          error:
            error.response?.data || error.message || "An error occurred during the file upload.",
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
