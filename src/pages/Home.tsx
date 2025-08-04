// Path: src/pages/Home.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import TabNavigation, { TabName } from "../components/TabNavigation";
import FileInput from "../components/FileInput";
import useNotifications from "../hooks/useNotifications";
import ResultsDisplay from "../components/ResultsDisplay";
import type { AnalysisResponse } from "../types";
import "../index.css";

function Home() {
  const [activeTab, setActiveTab] = useState<TabName>("upload");
  const [images, setImages] = useState<File[]>([]);
  const [csiFile, setCsiFile] = useState<File | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotifications();

  useEffect(() => {
    if (results) {
      const title = 'Analysis Complete!';
      const body = `Detected Activity: ${results.overall_activity}.`;
      showNotification(title, { body, icon: '/favicon.ico' });
    }
  }, [results, showNotification]);

  const handleAnalyze = async () => {
    // --- CORRECTED LOGIC: Only the CSI file is required ---
    if (!csiFile) {
      alert("Please select a CSI file to analyze.");
      return;
    }

    setLoading(true);
    setResults(null);
    const formData = new FormData();
    formData.append('csi_file', csiFile);

    // Only append images if they exist
    if (images.length > 0) {
        images.forEach(imageFile => {
            formData.append('images', imageFile);
        });
    }

    try {
      const response = await axios.post<AnalysisResponse>('http://localhost:5000/analyze', formData);
      setResults(response.data);
      setActiveTab("results");
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Analysis failed. Please check the console and ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Analyze CSI Data</h2>
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: 'flex-start' }}>
              {/* CSI File is now primary */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <h3 style={{ fontWeight: 500, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>📡 CSI File (.dat) <span style={{color: 'red'}}>*Required</span></h3>
                <FileInput onFileSelect={(files) => setCsiFile(files[0])} acceptedTypes=".dat" />
                {csiFile && <p style={{ marginTop: "10px", color: "green" }}>📄 {csiFile.name}</p>}
              </div>
              {/* Image Folder is now optional */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <h3 style={{ fontWeight: 500, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>📷 Image Folder (Optional for Visuals)</h3>
                <FileInput onFileSelect={setImages} acceptedTypes=".jpg,.jpeg,.png" allowFolder />
                {images.length > 0 && <p style={{ marginTop: "10px", color: "green" }}>📁 {images.length} files selected for visualization</p>}
              </div>
            </div>
            <button onClick={handleAnalyze} disabled={loading || !csiFile} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
              {loading ? 'Analyzing...' : "Analyze CSI Signal"}
            </button>
          </div>
        );
      case "results":
        if (loading) return <p>Loading analysis...</p>;
        return <ResultsDisplay results={results} />;
      case "history":
        return <div>History of analyses will be shown here.</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div>
      <Header />
      <main style={{ padding: "20px" }}>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default Home;