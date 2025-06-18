import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, Zap, TrendingUp, Clock, BookOpen } from 'lucide-react';

const DashboardContent = () => {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Ready to enhance your learning experience?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link 
            to="/lecture-recorder"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-gray-400">Recordings</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Lecture Recorder</h3>
            <p className="text-gray-400 text-sm">Record and analyze your lectures with AI-powered insights</p>
          </Link>

          <Link 
            to="/pdf-analyzer"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-sm text-gray-400">Documents</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">PDF Analyzer</h3>
            <p className="text-gray-400 text-sm">Transform your PDFs into interactive study materials</p>
          </Link>

          <Link 
            to="/drill-mode"
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-teal-500 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">156</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Drill Mode</h3>
            <p className="text-gray-400 text-sm">Practice with endless AI-generated questions</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Physics Lecture - Chapter 5</div>
                  <div className="text-gray-400 text-sm">Recorded 2 hours ago</div>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Biology Textbook.pdf</div>
                  <div className="text-gray-400 text-sm">Analyzed yesterday</div>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">Math Practice Set</div>
                  <div className="text-gray-400 text-sm">Completed 50 questions</div>
                </div>
                <TrendingUp className="w-4 h-4 text-teal-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Study Progress</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Physics</span>
                  <span className="text-teal-400 font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Biology</span>
                  <span className="text-teal-400 font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Mathematics</span>
                  <span className="text-teal-400 font-medium">91%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;