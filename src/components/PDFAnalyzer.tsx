import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Upload, FileText, Brain, HelpCircle, CreditCard, Eye } from 'lucide-react';

const PDFAnalyzer = () => {
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Biology Textbook Chapter 3.pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'analyzed',
      hasSummary: true,
      hasQuiz: true,
      hasFlashcards: true
    },
    {
      id: 2,
      name: 'Physics Notes.pdf', 
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'processing',
      hasSummary: false,
      hasQuiz: false,
      hasFlashcards: false
    }
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload logic here
  };

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">PDF Analyzer</h1>
              <p className="text-gray-400">Upload PDFs and transform them into summaries, quizzes, and flashcards using Gemini AI</p>
            </div>

            {/* Upload Area */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-teal-500 bg-teal-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload your PDF</h3>
                <p className="text-gray-400 mb-6">
                  Drag and drop your PDF file here, or click to browse
                </p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Browse Files
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  Supported format: PDF • Max size: 25MB
                </p>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Your Documents</h2>
              
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.uploadDate}</span>
                            <span>•</span>
                            <span className={`${
                              doc.status === 'analyzed' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {doc.status === 'analyzed' ? 'Analyzed' : 'Processing...'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="text-gray-400 hover:text-white">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {doc.status === 'analyzed' && (
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          <Brain className="w-4 h-4" />
                          <span>Summary</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          <HelpCircle className="w-4 h-4" />
                          <span>Quiz</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          <CreditCard className="w-4 h-4" />
                          <span>Flashcards</span>
                        </button>
                      </div>
                    )}
                    
                    {doc.status === 'processing' && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-400"></div>
                        <span className="text-gray-400 text-sm">AI is analyzing your document...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFAnalyzer;