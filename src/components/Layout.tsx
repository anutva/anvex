// src/components/Layout.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // The route where we want a custom, full-screen layout
  const isAnvexRoute = location.pathname === '/anvex';

  // If it's the special chat route, render only the page content.
  // The page itself (ChatInterface) will be responsible for its own layout.
  if (isAnvexRoute) {
    return <>{children}</>;
  }

  // For all other routes, render the default layout with Navbar and Footer.
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};