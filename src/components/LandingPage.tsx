import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Users, Star, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-teal-400" />
          <span className="text-xl font-bold">Learnly AI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button className="text-gray-300 hover:text-white transition-colors">Features</button>
          <button className="text-gray-300 hover:text-white transition-colors">Pricing</button>
          <button className="text-gray-300 hover:text-white transition-colors">About</button>
        </div>
        
        <Link
          to="/dashboard"
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-gray-900 border border-gray-700 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-teal-400 mr-2" />
            <span className="text-sm text-gray-300">Powered by Gemini AI & AssemblyAI</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            An AI tutor made for you
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Turns your learning materials into notes, interactive chats, quizzes, and more
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="flex items-center border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-medium transition-colors group">
              See Features
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to="/dashboard"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-black"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full border-2 border-black"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-black"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-gray-300">Loved by students worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Lecture Recording</h3>
            <p className="text-gray-400">Record lectures and get instant transcriptions, summaries, and quizzes</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">PDF Analysis</h3>
            <p className="text-gray-400">Upload PDFs and transform them into study materials and flashcards</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Drill Mode</h3>
            <p className="text-gray-400">Endless practice questions tailored to your learning topics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;