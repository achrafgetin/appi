import React from "react";

interface Props {
  activeTab: "upload" | "results" | "history";
  setActiveTab: (tab: "upload" | "results" | "history") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: Props) {
  const tabStyle = (isActive: boolean) => ({
    flex: 1,
    textAlign: "center" as const,
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: isActive ? "#fff" : "#000",
    fontWeight: isActive ? "bold" : "normal",
    cursor: "pointer",
    boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
    border: isActive ? "none" : "1px solid #ddd",
  });

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <div style={tabStyle(activeTab === "upload")} onClick={() => setActiveTab("upload")}>
        📤 Upload
      </div>
      <div style={tabStyle(activeTab === "results")} onClick={() => setActiveTab("results")}>
        📊 Résultat
      </div>
      <div style={tabStyle(activeTab === "history")} onClick={() => setActiveTab("history")}>
        🕓 Historique
      </div>
    </div>
  );
}
