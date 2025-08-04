// Path: src/components/CsiHeatmap.tsx

import React from 'react';

interface Props {
  data: number[];
}

// This helper function converts a signal value into a color, just like MATLAB's colormap.
// It maps the value's position between min and max to a color between blue and red.
const valueToHslColor = (value: number, min: number, max: number): string => {
  if (max === min) {
    return 'hsl(240, 100%, 50%)'; // Default to blue if all values are the same
  }
  // Normalize the value to a 0-1 range
  const percentage = (value - min) / (max - min);
  
  // Map percentage to a hue value (240=blue, 120=green, 0=red)
  const hue = 240 - (percentage * 240);
  
  return `hsl(${hue}, 100%, 50%)`;
};

const CsiHeatmap: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No CSI data available.</div>;
  }

  // Find the min and max values in the dataset for accurate color mapping
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>
        CSI Heatmap
      </p>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', border: '1px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
        {data.map((value, index) => (
          <div
            key={index}
            title={`Index: ${index}, Value: ${value.toFixed(2)}`}
            style={{
              flex: 1, // Each bar takes up an equal amount of space
              backgroundColor: valueToHslColor(value, minValue, maxValue),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CsiHeatmap;