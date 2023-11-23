import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useExpensesContext } from "../hooks/expensesContext";

const FileUploader = () => {
  const { expensesCollection } = useExpensesContext();

  const onDrop = useCallback((acceptedFiles) => {
    // Crear un FormData para enviar el archivo
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]); // Asumiendo que solo cargas un archivo

    // Realizar la solicitud POST a tu API
    axios
      .post("/api/addExpenseWithMedia", formData, {
        //withCredentials: true, // Ensure this is set
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Archivo cargado:", response.data);
        // Aquí puedes hacer algo con la respuesta, como actualizar tu contexto o estado
      })
      .catch((error) => {
        console.error("Error al cargar archivo:", error);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${!isDragActive ? "#EAEAEA" : "#0087F7"}`,
        padding: "20px",
        textAlign: "center",
      }}
      className={"w-1/4"}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Suelta para agregar</p> : <p>Arrastra para agregar</p>}
    </div>
  );
};

export default FileUploader;
