// src/components/Layout.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // The route where we want a custom, full-screen layout
  const isAnusarthRoute = location.pathname === '/anusarth';

  // If it's the special chat route, render only the page content.
  // The page itself (ChatInterface) will be responsible for its own layout.
  if (isAnusarthRoute) {
    return <>{children}</>;
  }

  // For all other routes, render the default layout with Navbar and Footer.
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};