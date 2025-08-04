// Path: src/components/FileInput.tsx

import React, { useRef } from 'react';

interface FileInputProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes: string;
  allowFolder?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect, acceptedTypes, allowFolder }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFileSelect(Array.from(event.target.files));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptedTypes}
        style={{ display: 'none' }}
        // These two lines are for folder selection
        {...(allowFolder ? { webkitdirectory: "true", directory: "true" } : {})}
      />
      <button onClick={handleClick} className="btn">
        Choose {allowFolder ? 'Folder' : 'File'}
      </button>
    </div>
  );
};

export default FileInput;