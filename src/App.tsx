// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DocumentsPage from './pages/DocumentsPage';
import { ChatInterface } from './components/ChatInterface';
import { Layout } from './components/layout'; // <-- Import the new Layout component

function App() {
  return (
    <Router>
      <Layout> {/* The Layout component now wraps your routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/anusarth" element={<ChatInterface />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;