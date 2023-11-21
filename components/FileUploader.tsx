import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Haz algo con los archivos
    console.log(acceptedFiles);
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
