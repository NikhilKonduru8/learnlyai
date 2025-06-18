import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Mic, Square, Play, Pause, FileText, Brain, HelpCircle } from 'lucide-react';

const LectureRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'Physics Lecture - Chapter 5',
      duration: '45:32',
      date: '2024-01-15',
      hasTranscript: true,
      hasSummary: true,
      hasQuiz: true
    },
    {
      id: 2,
      title: 'Biology - Cell Structure',
      duration: '38:21',
      date: '2024-01-14',
      hasTranscript: true,
      hasSummary: false,
      hasQuiz: false
    }
  ]);

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Lecture Recorder</h1>
              <p className="text-gray-400">Record lectures and get AI-powered transcriptions, summaries, and quizzes</p>
            </div>

            {/* Recording Controls */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
              <div className="text-center">
                <div className="mb-6">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-teal-500 hover:bg-teal-600'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="w-12 h-12 text-white" />
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isRecording ? 'Recording in progress...' : 'Ready to record'}
                </h3>
                
                {isRecording && (
                  <div className="text-teal-400 font-mono text-lg">00:05:23</div>
                )}
                
                <p className="text-gray-400 mt-4">
                  Click the microphone to start recording your lecture. We'll automatically transcribe it using AssemblyAI and generate study materials with Gemini AI.
                </p>
              </div>
            </div>

            {/* Recordings List */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Your Recordings</h2>
              
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <div key={recording.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{recording.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>{recording.duration}</span>
                          <span>•</span>
                          <span>{recording.date}</span>
                        </div>
                      </div>
                      
                      <button className="text-teal-400 hover:text-teal-300">
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          recording.hasTranscript 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Transcript</span>
                      </button>
                      
                      <button 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          recording.hasSummary 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                        <span>Summary</span>
                      </button>
                      
                      <button 
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          recording.hasQuiz 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                        <span>Quiz</span>
                      </button>
                    </div>
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

export default LectureRecorder;