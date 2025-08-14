// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import { ChatInterface } from './pages/anvexPage';
import { Layout } from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/anvex" element={<ChatInterface />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;