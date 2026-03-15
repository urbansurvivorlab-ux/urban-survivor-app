import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: 'primary' | 'accent' | 'success';
  height?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  color = 'primary', 
  height = 'h-3',
  showLabel = false
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  const colors = {
    primary: 'bg-survivor-primary shadow-yellow-500/50',
    accent: 'bg-survivor-accent shadow-red-500/50',
    success: 'bg-green-500 shadow-green-500/50',
  };

  const activeColor = colors[color];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-sm font-medium">
          <span className="text-survivor-text">Score</span>
          <span className="text-survivor-primary">{safeProgress} / 100</span>
        </div>
      )}
      <div className={`w-full bg-black/40 rounded-full ${height} overflow-hidden border border-white/5`}>
        <div 
          className={`${height} ${activeColor} rounded-full transition-all duration-1000 ease-out shadow-lg`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
};
