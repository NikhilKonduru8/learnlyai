import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Zap, Plus, Play, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const DrillMode = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [drillSets, setDrillSets] = useState([
    {
      id: 1,
      name: 'Physics - Mechanics',
      description: 'Newton\'s laws, kinematics, and dynamics',
      questionsCompleted: 45,
      totalQuestions: 'Infinite',
      accuracy: 87,
      lastStudied: '2024-01-15'
    },
    {
      id: 2,
      name: 'Biology - Cell Biology',
      description: 'Cell structure, organelles, and cellular processes',
      questionsCompleted: 32,
      totalQuestions: 'Infinite',
      accuracy: 92,
      lastStudied: '2024-01-14'
    }
  ]);

  const sampleQuestions = [
    {
      question: "What is Newton's First Law of Motion?",
      options: [
        "An object at rest stays at rest unless acted upon by a force",
        "Force equals mass times acceleration",
        "Every action has an equal and opposite reaction",
        "The law of universal gravitation"
      ],
      correct: 0
    }
  ];

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Drill Mode</h1>
                <p className="text-gray-400">Practice with endless AI-generated questions tailored to your topics</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Set</span>
              </button>
            </div>

            {/* Drill Sets */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {drillSets.map((set) => (
                <div key={set.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{set.name}</h3>
                      <p className="text-gray-400 text-sm">{set.description}</p>
                    </div>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors">
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-white">{set.questionsCompleted}</div>
                      <div className="text-xs text-gray-400">Questions Done</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-teal-400">{set.accuracy}%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Last studied {set.lastStudied}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-teal-400" />
                      <span className="text-teal-400">On streak!</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Practice Preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Practice Preview</h2>
              <div className="bg-gray-800 rounded-xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-teal-400 font-medium">Question 1 of ∞</span>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">Streak: 5</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-6">
                    {sampleQuestions[0].question}
                  </h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  {sampleQuestions[0].options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors text-white"
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    Start Practice Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Set Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-6">Create New Drill Set</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Set Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Chemistry - Organic Compounds"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent h-24 resize-none"
                  placeholder="Describe what topics you want to practice..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-colors">
                Create Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillMode;