import { CMS_URL, headers } from "./cms";
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data'; // Asegúrate de importar FormData cuando lo uses.

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: 'tmp/',
  filename: (req, file, cb) => {
    // Usa solo un nombre temporal aquí.
    const ext = path.extname(file.originalname);
    const tempFilename = `temp-${Date.now()}${ext}`;
    cb(null, tempFilename);
  },
});

const upload = multer({ storage }).single("file");

async function uploadMedia(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError || err) {
        console.log("Multer error:", err.message);
        reject(err.message);
      } else {
        try {
          // Acceder a req.body.label después de que Multer haya procesado el archivo
          const originalPath = req.file.path;
          console.log("Archivo subido a la ruta temporal:", originalPath);

          const ext = path.extname(req.file.originalname);

          // Sanear el campo `req.body.label`
          const sanitizedLabel = req.body.label.replace(/[^a-zA-Z0-9_-]/g, "-");
          console.log("Label saneado:", sanitizedLabel);

          const newFilename = `${sanitizedLabel}-${Date.now()}${ext}`;
          const newPath = path.join('tmp/', newFilename);
          console.log("Renombrando archivo a:", newPath);

          // Renombrar el archivo a su nombre final
          fs.rename(originalPath, newPath, async (error) => {
            if (error) {
              console.log("Error al renombrar el archivo:", error.message);
              return;
            }

            console.log("Archivo renombrado exitosamente a:", newPath);

            const formData = new FormData();
            formData.append("file", fs.createReadStream(newPath));
            formData.append("mimeType", req.file.mimetype);
            formData.append("size", req.file.size);

            console.log("Enviando archivo al CMS...");

            const response = await axios.post(`${CMS_URL}/media`, formData, {
              headers: {
                ...formData.getHeaders(),
                'Authorization': headers.Authorization,
              },
            });

            console.log("Archivo enviado al CMS, ID:", response.data.id);

            // Limpieza: eliminar el archivo renombrado después de cargarlo
            fs.unlink(newPath, (unlinkErr) => {
              if (unlinkErr) {
                console.log("Error eliminando el archivo:", unlinkErr.message);
                return;
              }
              console.log("Archivo eliminado exitosamente:", newPath);
              resolve(response.data);
            });
          });
        } catch (error) {
          console.log("Error durante el proceso:", error.message);

          // Limpieza: asegurarse de eliminar el archivo temporal en caso de error
          if (req.file && req.file.path) {
            fs.unlink(req.file.path, (unlinkErr) => {
              if (unlinkErr) {
                console.log("Error eliminando el archivo temporal:", unlinkErr.message);
              }
              reject(error);
            });
          } else {
            reject(error);
          }
        }
      }
    });
  });
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const doc = await uploadMedia(req, res);
    console.log(doc.id, 'subido correctamente.');
    return res.status(200).json(doc);
  } catch (error) {
    console.log('upload handler error:', error.message);
    return res.status(500).json({ message: error.message });
  }
}
