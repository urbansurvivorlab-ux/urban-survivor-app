import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-survivor-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Urban Survivor Logo" className="w-9 h-9 object-contain rounded-full shadow-[0_0_10px_rgba(234,179,8,0.4)] group-hover:shadow-[0_0_15px_rgba(234,179,8,0.6)] transition-all duration-300" />
          <h1 className="text-xl font-bold tracking-wider text-survivor-text group-hover:text-survivor-primary transition-colors">
            都市型サバイバー
          </h1>
        </Link>
        
        <div className="text-xs text-survivor-muted font-medium bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          スコアカード BETA
        </div>
      </div>
    </header>
  );
};
