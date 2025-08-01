import React, { useRef } from "react";

interface UploadAreaProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string;
  allowFolder?: boolean;
}

export default function UploadArea({ onFileSelect, acceptedTypes, allowFolder = false }: UploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      onFileSelect(fileArray);
    }
  };

  return (
    <div style={{
      padding: "30px",
      border: "2px dashed #3498db",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
      textAlign: "center",
      marginTop: "10px"
    }}>
      <p style={{ marginBottom: "10px", color: "#333" }}>
        {allowFolder
          ? "📂 Glisser un dossier ou cliquer pour sélectionner"
          : "📁 Sélectionner un fichier"}
      </p>
      <input
        type="file"
        onChange={handleChange}
        accept={acceptedTypes}
        multiple={allowFolder} // only allow multiple if folder mode is on
        {...(allowFolder ? { webkitdirectory: "true" as any, directory: "true" as any } : {})}
      />
    </div>
  );
}
