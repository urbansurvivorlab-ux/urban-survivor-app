import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-white/5 bg-survivor-dark/50">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-2">
        <p className="text-survivor-muted text-sm text-center">
          判断の遅れは命取りだ。<br />
          <span className="text-white/30 text-xs mt-2 block">&copy; {new Date().getFullYear()} 都市型サバイバー</span>
        </p>
      </div>
    </footer>
  );
};
