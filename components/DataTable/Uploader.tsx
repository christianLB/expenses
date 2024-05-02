import { useState } from "react";
import { FileInput, Button } from "@mantine/core";
import axios from "axios";

function Uploader() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("./api/payloadUpload", {
        method: "POST",
        body: formData,
      });

      console.log("Archivo subido con éxito:", response);
    } catch (error) {
      console.error("Error al subir el archivo:", error.message);
    }
  };

  return (
    <div>
      <FileInput
        placeholder="Sube un archivo"
        label="Archivo"
        onChange={setFile}
        accept="image/png,image/jpeg,application/pdf" // Ajusta esto según los tipos de archivo que desees aceptar
      />
      <Button onClick={handleUpload} disabled={!file}>
        Subir Archivo
      </Button>
    </div>
  );
}

export default Uploader;
