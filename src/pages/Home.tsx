import { useState } from "react";
import UploadArea from "../components/UploadArea";
import Header from "../components/Header";
import TabNavigation from "../components/TabNavigation";
import "../index.css";

interface ResultEntry {
  image: string;
  activity: string;
  confidence: number;
  skeleton_on_image?: string;
  skeleton_only?: string;
}

interface ScanRecord {
  date: string;
  results: ResultEntry[];
}

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [csiFile, setCsiFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "results" | "history">("upload");
  const [multiResults, setMultiResults] = useState<ResultEntry[]>([]);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (images.length === 0 || !csiFile) return;
    setIsAnalyzing(true);

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));
    formData.append("csi", csiFile);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMultiResults(data);

      const newRecord: ScanRecord = {
        date: new Date().toLocaleString(),
        results: data,
      };
      setHistory((prev) => [newRecord, ...prev]);

      setActiveTab("results");
    } catch (err) {
      console.error("Error during analysis:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* === Upload Section === */}
        {activeTab === "upload" && (
          <>
            <h2>Upload Files</h2>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <h3>📷 Image Folder</h3>
                <UploadArea onFileSelect={setImages} acceptedTypes=".jpg,.jpeg,.png" allowFolder />
                {images.length > 0 && (
                  <p style={{ marginTop: "10px", color: "green" }}>
                    📁 {images[0].webkitRelativePath?.split("/")[0] || "Folder"} ({images.length} files)
                  </p>
                )}
              </div>

              <div style={{ flex: 1, minWidth: "250px" }}>
                <h3>📡 CSI File (.dat)</h3>
                <UploadArea onFileSelect={(files) => setCsiFile(files[0])} acceptedTypes=".dat" />
                {csiFile && (
                  <p style={{ marginTop: "10px", color: "green" }}>
                    📄 {csiFile.name}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <button
                disabled={images.length === 0 || !csiFile || isAnalyzing}
                onClick={handleAnalyze}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  border: "none",
                  background: images.length && csiFile
                    ? "linear-gradient(to right, #2563eb, #22c55e)"
                    : "#ccc",
                  color: images.length && csiFile ? "#fff" : "#888",
                  cursor: images.length && csiFile ? "pointer" : "not-allowed"
                }}
              >
                {isAnalyzing ? "Analyzing..." : "Analyser avec IA"}
              </button>
            </div>
          </>
        )}

        {/* === Results Section === */}
        {activeTab === "results" && (
          <>
            <h2>Résultats par image</h2>
            {multiResults.length === 0 ? (
              <p>Aucun résultat à afficher.</p>
            ) : (
              multiResults.map((res, index) => (
                <div key={index} style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  gap: "30px"
                }}>
                  <div style={{ minWidth: "200px" }}>
                    📷 <strong>{res.image}</strong> — {res.activity}
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    background: "#e5e5e5",
                    height: "18px",
                    width: "200px",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <div
                      style={{
                        width: `${res.confidence}%`,
                        backgroundColor: "#22c55e",
                        height: "100%"
                      }}
                    />
                  </div>
                  <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                    {res.confidence}%
                  </span>

                  {/* Skeleton Image Preview */}
                  {res.skeleton_only && (
                    <div className="image-preview-wrapper">
                    <img
                      src={`http://localhost:5000/${res.skeleton_only}`}
                      alt="skeleton"
                      style={{ width: "85px", borderRadius: "4px", cursor: "zoom-in" }}
                    />
                    <div className="preview-popup">
                      <img
                        src={`http://localhost:5000/${res.skeleton_only}`}
                        alt="preview"
                      />
                    </div>
                  </div>


                  )}
                </div>
              ))
            )}
          </>
        )}

        {/* === History Section === */}
        {activeTab === "history" && (
          <>
            <h2>Historique des Analyses</h2>
            {history.length === 0 ? (
              <p>Aucun historique enregistré.</p>
            ) : (
              history.map((record, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <h4>{record.date}</h4>
                  {record.results.map((res, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <span style={{ minWidth: "250px" }}>
                        📷 {res.image} — <strong>{res.activity}</strong>
                      </span>
                      <div
                        style={{
                          background: "#e5e5e5",
                          height: "14px",
                          width: "180px",
                          borderRadius: "10px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            width: `${res.confidence}%`,
                            backgroundColor: "#22c55e",
                            height: "100%"
                          }}
                        ></div>
                      </div>
                      <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                        {res.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}
