import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-survivor-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-survivor-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12 relative z-10 w-full max-w-2xl">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};
