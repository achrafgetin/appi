// Path: src/components/ResultsDisplay.tsx
import React, { useState } from 'react';
import type { AnalysisResponse, VisualFrame } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import CsiHeatmap from './CsiHeatmap'; // <-- IMPORT THE NEW COMPONENT

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
);

const ImagePanel: React.FC<{ title: string; src: string }> = ({ title, src }) => {
    return (
        <div style={{ border: '1px solid #ddd', padding: '5px', textAlign: 'center', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '14px' }}>{title}</p>
            <img src={src} alt={title} style={{ width: '100%', height: '200px', objectFit: 'contain' }} 
                 onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/250x200?text=Image+Not+Found"; }}
            />
        </div>
    );
};

const ResultsDisplay: React.FC<{ results: AnalysisResponse | null }> = ({ results }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  if (!results || !results.visual_frames || results.visual_frames.length === 0) {
    return <p>No results to display.</p>;
  }
  
  const frameData: VisualFrame = results.visual_frames[currentFrame];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'CSI Time-Series' },
    },
    scales: { x: { ticks: { display: false } }, y: { ticks: { display: false } } },
  };
  const chartData = {
    labels: results.csi_signal.map((_, index) => index),
    datasets: [
      {
        label: 'CSI Signal',
        data: results.csi_signal,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
      },
    ],
  };

  const getImageUrl = (path: string) => {
      const filename = path.split('/').pop();
      if (path.startsWith('runs/')) return `http://localhost:5000/generated/yolo/${filename}`;
      if (path.startsWith('skeleton_images/image_with_skeleton')) return `http://localhost:5000/generated/skel_on_img/${filename}`;
      if (path.startsWith('skeleton_images/opImg')) return `http://localhost:5000/generated/skel_only/${filename}`;
      return '';
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: '#eaf5ff', borderRadius: '8px' }}>
        <h2 style={{ margin: 0, color: '#0d6efd' }}>Detected Activity:</h2>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0 0 0', textTransform: 'capitalize' }}>
          {results.overall_activity}
        </p>
      </div>

      <h3 style={{ fontWeight: 600, borderTop: '1px solid #eee', paddingTop: '20px' }}>Frame by Frame Visuals</h3>
      
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="frame-slider" style={{ display: 'block', marginBottom: '10px' }}>
          Visual Frame: <strong>{currentFrame + 1}</strong> / {results.visual_frames.length} ({frameData.original_filename})
        </label>
        <input
          type="range" id="frame-slider" min="0" max={results.visual_frames.length - 1}
          value={currentFrame} onChange={(e) => setCurrentFrame(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* --- REPLACE THE PLACEHOLDER --- */}
        <div style={{ border: '1px solid #ddd', padding: '5px', borderRadius: '8px' }}>
            <CsiHeatmap data={results.csi_signal} />
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '5px', borderRadius: '8px' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
        
        <ImagePanel title="Original Image" src={`http://localhost:5000/uploads/images/${frameData.original_filename}`} />
        <ImagePanel title="YOLO Prediction" src={getImageUrl(frameData.yolo_img_path)} />
        <ImagePanel title="Skeleton on Image" src={getImageUrl(frameData.skel_on_img_path)} />
        <ImagePanel title="Skeleton Only" src={getImageUrl(frameData.skel_only_path)} />
      </div>
    </div>
  );
};

export default ResultsDisplay;