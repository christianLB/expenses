// pages/api/uploadToCMS.js
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

const upload = multer({ dest: "tmp/" }).single("file");

export async function uploadToCMS(req, res, next) {
  upload(req, res, async (err) => {
    console.log('hola')
    if (err instanceof multer.MulterError) {
      console.log('hola 2')
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.log('hola 3', err)
      return res.status(500).json({ error: err.message });
    }
    console.log('hola 4')
    // Aquí la lógica para enviar el archivo a CMS
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("filename", req.file.originalname);

    const CMS_URL = `${process.env.NEXT_PUBLIC_CMS_API_URL}/media`;
    try {
      const response = await axios.post(CMS_URL, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
        },
      });

      unlink(req.file.path);
      req.fileData = response.data; // Guardar datos relevantes en req para su uso posterior
      next(); // Pasar el control al siguiente middleware
    } catch (error) {
      unlink(req.file.path);
      return res.status(500).json({
        error: error.message || "An error occurred during the file upload.",
      });
    }
  });
}

const unlink = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error("Error deleting the file:", err);
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};