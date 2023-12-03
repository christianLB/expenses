import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUploader = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setIsUploading(true);
    setUploadError(false);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    axios
      .post("/api/addExpenseWithMedia", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Archivo cargado:", response.data);
        setSuccessMessage("Archivo cargado con éxito.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Error al cargar archivo:", error);
        setUploadError(true);
        setErrorMessage("Error al cargar el archivo.");
        setIsUploading(false);
      });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${
          uploadError ? "red" : !isDragActive ? "#EAEAEA" : "#0087F7"
        }`,
        padding: "20px",
        textAlign: "center",
        position: "relative",
        height: "100px", // Alto fijo
      }}
      className={"w-1/4"}
    >
      <input {...getInputProps()} />
      {isUploading && <Spinner />}
      {!isUploading && !uploadError && (
        <>
          {isDragActive ? (
            <p>Suelta para agregar.</p>
          ) : (
            <p>Arrastra para agregar.</p>
          )}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </>
      )}
      {uploadError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

const Spinner = () => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <div className="loader">Cargando...</div>
  </div>
);

export default FileUploader;
