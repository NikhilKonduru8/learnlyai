import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  FileText, 
  Mic, 
  Brain,
  Search,
  Filter,
  MoreVertical,
  Play,
  Trash2
} from 'lucide-react';
import StudySession from './StudySession';

interface Session {
  id: string;
  name: string;
  originalContent: string;
  summary: string;
  flashcards: any[];
  questions: any[];
  chatMessages: any[];
  createdAt: string;
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showStudySession, setShowStudySession] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('learnly-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const saveSession = (session: Session) => {
    const updatedSessions = sessions.some(s => s.id === session.id)
      ? sessions.map(s => s.id === session.id ? session : s)
      : [...sessions, session];
    
    setSessions(updatedSessions);
    localStorage.setItem('learnly-sessions', JSON.stringify(updatedSessions));
    setShowStudySession(false);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('learnly-sessions', JSON.stringify(updatedSessions));
  };

  const openSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setShowStudySession(true);
  };

  const createNewSession = () => {
    setCurrentSessionId(undefined);
    setShowStudySession(true);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'recent' && new Date(session.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesFilter;
  });

  const getSessionType = (session: Session) => {
    if (session.originalContent.includes('http')) return 'wikipedia';
    if (session.originalContent.length > 1000) return 'document';
    return 'recording';
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'wikipedia': return Brain;
      case 'document': return FileText;
      case 'recording': return Mic;
      default: return BookOpen;
    }
  };

  if (showStudySession) {
    return (
      <StudySession
        sessionId={currentSessionId}
        onSave={saveSession}
        onClose={() => setShowStudySession(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage your study sessions and track your progress</p>
            </div>
            <button
              onClick={createNewSession}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Sessions', value: sessions.length, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
            { label: 'This Week', value: sessions.filter(s => new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: Clock, color: 'from-green-500 to-teal-500' },
            { label: 'Flashcards', value: sessions.reduce((acc, s) => acc + s.flashcards.length, 0), icon: Brain, color: 'from-purple-500 to-pink-500' },
            { label: 'Questions', value: sessions.reduce((acc, s) => acc + s.questions.length, 0), icon: TrendingUp, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sessions..."
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Sessions</option>
            <option value="recent">Recent</option>
          </select>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session, index) => {
              const sessionType = getSessionType(session);
              const SessionIcon = getSessionIcon(sessionType);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <SessionIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {session.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openSession(session.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4 text-gray-400 hover:text-white" />
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Flashcards</span>
                      <span className="text-white font-medium">{session.flashcards.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Questions</span>
                      <span className="text-white font-medium">{session.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Chat Messages</span>
                      <span className="text-white font-medium">{session.chatMessages.length}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {session.summary || 'No summary available'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No study sessions yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first study session by uploading content, recording a lecture, or adding a Wikipedia link
            </p>
            <button
              onClick={createNewSession}
              className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              Create Your First Session
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;