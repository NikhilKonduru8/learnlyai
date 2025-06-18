import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  FileText, 
  Brain, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Send,
  Loader,
  Globe,
  Save,
  X
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { assemblyService } from '../services/assemblyService';
import { wikipediaService } from '../services/wikipediaService';

interface StudySessionProps {
  sessionId?: string;
  onSave: (session: any) => void;
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Flashcard {
  front: string;
  back: string;
}

const StudySession: React.FC<StudySessionProps> = ({ sessionId, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState('original');
  const [sessionName, setSessionName] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flippedCard, setFlippedCard] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(5);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wikipediaUrl, setWikipediaUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      setOriginalContent(text);
      await processContent(text);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      const audioUrl = await assemblyService.uploadAudio(audioFile);
      const transcript = await assemblyService.transcribeAudio(audioUrl);
      setOriginalContent(transcript);
      await processContent(transcript);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWikipediaSubmit = async () => {
    if (!wikipediaUrl || !wikipediaService.isValidWikipediaUrl(wikipediaUrl)) {
      alert('Please enter a valid Wikipedia URL');
      return;
    }

    setIsProcessing(true);
    try {
      const content = await wikipediaService.extractContent(wikipediaUrl);
      setOriginalContent(content);
      await processContent(content);
    } catch (error) {
      console.error('Error processing Wikipedia content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processContent = async (content: string) => {
    try {
      // Generate summary
      const summaryText = await geminiService.summarizeContent(content);
      setSummary(summaryText);

      // Generate flashcards
      const flashcardData = await geminiService.generateFlashcards(content);
      setFlashcards(flashcardData);

      // Generate questions
      const questionData = await geminiService.generateQuestions(content, questionCount);
      setQuestions(questionData);
    } catch (error) {
      console.error('Error processing content:', error);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !originalContent) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await geminiService.chatWithContent(originalContent, userMessage);
      setChatMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      console.error('Error in chat:', error);
    }
  };

  const nextFlashcard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
    setFlippedCard(false);
  };

  const prevFlashcard = () => {
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setFlippedCard(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleSaveSession = () => {
    const session = {
      id: sessionId || Date.now().toString(),
      name: sessionName || 'Untitled Session',
      originalContent,
      summary,
      flashcards,
      questions,
      chatMessages,
      createdAt: new Date().toISOString()
    };
    onSave(session);
  };

  const tabs = [
    { id: 'original', label: 'Original Content', icon: FileText },
    { id: 'summary', label: 'AI Summary', icon: Brain },
    { id: 'flashcards', label: 'AI Flashcards', icon: RotateCcw },
    { id: 'quiz', label: 'AI Quizzes', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Session Name"
                className="bg-transparent text-xl font-semibold border-none outline-none placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSaveSession}
              className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-800 bg-gray-900/30">
            <div className="flex space-x-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'original' && (
                <motion.div
                  key="original"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {!originalContent ? (
                    <div className="space-y-8">
                      {/* File Upload */}
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                        <h3 className="text-xl font-semibold mb-4">Upload PDF</h3>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-600 hover:border-primary-500 rounded-xl p-12 text-center cursor-pointer transition-colors"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-400">Click to upload a PDF file</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Audio Recording */}
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                        <h3 className="text-xl font-semibold mb-4">Record Lecture</h3>
                        <div className="text-center">
                          <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing}
                            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                              isRecording
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-primary-500 hover:bg-primary-600'
                            }`}
                          >
                            {isRecording ? (
                              <Square className="w-8 h-8 text-white" />
                            ) : (
                              <Mic className="w-8 h-8 text-white" />
                            )}
                          </button>
                          {isRecording && (
                            <div className="mt-4 text-primary-400 font-mono text-lg">
                              {formatTime(recordingTime)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Wikipedia URL */}
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                        <h3 className="text-xl font-semibold mb-4">Wikipedia Link</h3>
                        <div className="flex space-x-4">
                          <div className="flex-1">
                            <input
                              type="url"
                              value={wikipediaUrl}
                              onChange={(e) => setWikipediaUrl(e.target.value)}
                              placeholder="https://en.wikipedia.org/wiki/..."
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={handleWikipediaSubmit}
                            disabled={isProcessing}
                            className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-lg transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Extract</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                      <h3 className="text-xl font-semibold mb-4">Original Content</h3>
                      <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                          {originalContent}
                        </pre>
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="flex items-center justify-center py-12">
                      <Loader className="w-8 h-8 animate-spin text-primary-500" />
                      <span className="ml-3 text-gray-400">Processing content...</span>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-primary-400">AI Summary</h3>
                  {summary ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {summary}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Upload content to generate a summary</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'flashcards' && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {flashcards.length > 0 ? (
                    <>
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold mb-2 text-primary-400">Flashcards</h3>
                        <p className="text-gray-400">
                          {currentFlashcard + 1} of {flashcards.length}
                        </p>
                      </div>

                      <div className="flex items-center justify-center space-x-6">
                        <button
                          onClick={prevFlashcard}
                          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div
                          onClick={() => setFlippedCard(!flippedCard)}
                          className="w-96 h-64 cursor-pointer perspective-1000"
                        >
                          <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                            flippedCard ? 'rotate-y-180' : ''
                          }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl p-8 flex items-center justify-center backface-hidden">
                              <p className="text-white text-lg text-center font-medium">
                                {flashcards[currentFlashcard]?.front}
                              </p>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 flex items-center justify-center backface-hidden rotate-y-180">
                              <p className="text-white text-lg text-center">
                                {flashcards[currentFlashcard]?.back}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={nextFlashcard}
                          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Click the card to flip</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400 text-center">Upload content to generate flashcards</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {questions.length > 0 ? (
                    <>
                      {currentQuestion < questions.length ? (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-primary-400 font-medium">
                              Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <button
                              onClick={resetQuiz}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              Reset
                            </button>
                          </div>

                          <h3 className="text-xl font-semibold mb-6 text-white">
                            {questions[currentQuestion]?.question}
                          </h3>

                          <div className="space-y-3">
                            {questions[currentQuestion]?.options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={showResult}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${
                                  showResult
                                    ? index === questions[currentQuestion].correctAnswer
                                      ? 'bg-green-500/20 border-green-500 text-green-400'
                                      : index === selectedAnswer
                                      ? 'bg-red-500/20 border-red-500 text-red-400'
                                      : 'bg-gray-800 border-gray-700 text-gray-400'
                                    : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                                }`}
                              >
                                <span className="font-medium mr-3">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
                          <h3 className="text-2xl font-semibold mb-4 text-primary-400">Quiz Complete!</h3>
                          <p className="text-xl mb-6">
                            Your Score: {score} / {questions.length}
                          </p>
                          <button
                            onClick={resetQuiz}
                            className="bg-primary-500 hover:bg-primary-600 px-6 py-3 rounded-lg transition-colors"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                      <h3 className="text-xl font-semibold mb-4">Generate Quiz</h3>
                      <div className="flex items-center space-x-4 mb-6">
                        <label className="text-gray-300">Number of questions:</label>
                        <select
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Number(e.target.value))}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                      <p className="text-gray-400">Upload content to generate quiz questions</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI Chat Sidebar */}
        <div className="w-96 border-l border-gray-800 bg-gray-900/30 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-primary-400">AI Tutor</h3>
            <p className="text-sm text-gray-400">Ask questions about your content</p>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-500/20 text-primary-100 ml-4'
                    : 'bg-gray-800 text-gray-100 mr-4'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask AI assistant..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || !originalContent}
                className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudySession;