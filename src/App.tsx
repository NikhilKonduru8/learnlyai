import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LectureRecorder from './components/LectureRecorder';
import PDFAnalyzer from './components/PDFAnalyzer';
import DrillMode from './components/DrillMode';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lecture-recorder" element={<LectureRecorder />} />
          <Route path="/pdf-analyzer" element={<PDFAnalyzer />} />
          <Route path="/drill-mode" element={<DrillMode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;