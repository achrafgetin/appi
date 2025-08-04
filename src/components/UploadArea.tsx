// Path: src/components/UploadArea.tsx
// This is the complete and corrected version.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useNotifications from '../hooks/useNotifications';

interface AnalysisResult {
  filename: string;
  status: string;
  confidence: number;
}

interface AnalysisResponse {
  results_by_image: AnalysisResult[];
}

const UploadArea: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const { showNotification } = useNotifications();

  useEffect(() => {
    if (analysisResult && analysisResult.results_by_image && analysisResult.results_by_image.length > 0) {
      const results = analysisResult.results_by_image;
      const title = 'Analysis Complete!';
      const body = `Processed ${results.length} images. The primary activity detected is "${results[0].status}".`;
      const options = {
        body: body,
        icon: '/favicon.ico',
      };
      showNotification(title, options);
    }
  }, [analysisResult, showNotification]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setAnalysisResult(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post<AnalysisResponse>('http://localhost:5000/upload', formData);
      setUploadProgress(100);
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. See console for details.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload and Analyze
      </button>

      {uploadProgress === 100 && !analysisResult && (
        <div style={{ marginTop: '10px' }}>
          <p>Upload complete. Analyzing...</p>
        </div>
      )}

      {analysisResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Résultats par image</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {analysisResult.results_by_image.map((result, index) => (
              <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ minWidth: '100px' }}>{result.filename} - {result.status}</span>
                <div style={{ width: '200px', backgroundColor: '#e0e0e0', borderRadius: '5px', margin: '0 10px' }}>
                  <div
                    style={{
                      width: `${result.confidence}%`,
                      backgroundColor: '#4caf50',
                      height: '20px',
                      borderRadius: '5px',
                      textAlign: 'right',
                      color: 'white',
                      paddingRight: '5px',
                    }}
                  >
                    {result.confidence.toFixed(2)}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// This is the corrected last line.
export default UploadArea;