// Path: src/components/TabNavigation.tsx
// This is the new, interactive version.

import React from 'react';

// Define the possible tab names here so we can reuse it
export type TabName = 'upload' | 'results' | 'history';

interface Props {
  activeTab: TabName;
  // This is the new prop that allows the component to report clicks
  onTabChange: (tab: TabName) => void;
}

const TabNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabName; label: string; icon: string }[] = [
    { id: 'upload', label: 'Upload', icon: '⬆️' },
    { id: 'results', label: 'Résultat', icon: '📊' },
    { id: 'history', label: 'Historique', icon: '🕒' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          // This onClick handler makes the button interactive
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px solid',
            borderRadius: '5px',
            borderColor: activeTab === tab.id ? '#1e3a8a' : '#ccc',
            backgroundColor: activeTab === tab.id ? '#1e3a8a' : 'white',
            color: activeTab === tab.id ? 'white' : 'black',
            flex: 1,
            maxWidth: '200px',
          }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;