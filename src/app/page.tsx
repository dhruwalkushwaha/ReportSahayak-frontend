'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Activity, Heart, Loader2, AlertCircle, Globe, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

// --- Configuration ---
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' }
];

// --- Types ---
interface AnalysisItem {
  test_name: string;
  value: string;
  status: string;
  analogy: string;
  explanation: string;
}

interface AnalysisData {
  summary: string;
  details: Record<string, AnalysisItem[]>;
  disclaimer: string;
}

export default function ReportSahayak() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [language, setLanguage] = useState<string>('en');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [labName, setLabName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Theme Hook
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');
    setStep('analyzing');

    const formData = new FormData();
    formData.append('file', file);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reportsahayak-backend.onrender.com';

    try {
      const uploadRes = await axios.post(`${API_URL}/upload-report/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsedData = uploadRes.data;
      setLabName(parsedData.lab_name);

      const analyzeRes = await axios.post(`${API_URL}/analyze-report/`, {
        parsed_report: parsedData,
        language: language, 
      });

      setAnalysis(analyzeRes.data);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      setStep('upload');
      setErrorMsg(err.response?.data?.detail || 'Failed to analyze. Please ensure the PDF is readable.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-red-600 dark:text-red-500" size={24} />
            <span className="font-bangers text-2xl tracking-wide text-slate-800 dark:text-slate-100">
              REPORTSAHAYAK
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-700">
              <Globe size={16} className="text-slate-500 dark:text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                disabled={step === 'analyzing'}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3 text-red-700 dark:text-red-300 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center transition-colors duration-300">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-comic">
              Upload Lab Report
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              We support Dr Lal PathLabs, Apollo, Healthians, and most scanned PDF reports.
            </p>

            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className={`
                border-2 border-dashed rounded-xl p-4 transition-all duration-300
                ${file 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                  : 'border-slate-300 dark:border-slate-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:bg-slate-50 dark:group-hover:bg-slate-800'}
              `}>
                <div className="flex items-center justify-center gap-3 h-12">
                  {file ? (
                    <span className="font-medium text-green-700 dark:text-green-400 truncate max-w-[200px]">
                      {file.name}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Click to select PDF</span>
                  )}
                </div>
              </div>
            </div>

            {file && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-green-200 dark:shadow-none"
              >
                Analyze Now
              </button>
            )}
          </div>
        )}

        {/* Step 2: Loading */}
        {step === 'analyzing' && (
          <div className="text-center py-20">
            <Loader2 size={48} className="animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
              Decoding medical terms...
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">This usually takes about 10-15 seconds</p>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 'results' && analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Summary Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                ✨ Summary
                {labName && <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Lab: {labName}</span>}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.summary}
              </p>
              
              {/* Disclaimer */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 italic">
                  {analysis.disclaimer}
                </p>
              </div>
            </div>

            {/* Detailed Cards */}
            {Object.entries(analysis.details).map(([category, items]) => (
              <div key={category} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg capitalize">
                    {category}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {items.map((item, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{item.test_name}</h4>
                          <span className="text-2xl font-black text-slate-700 dark:text-slate-300 font-comic tracking-tight">
                            {item.value}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${item.status.toLowerCase().includes('normal') 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : item.status.toLowerCase().includes('high') 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                : item.status.toLowerCase().includes('low') 
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Analogy & Explanation */}
                      <div className="mt-4 space-y-3">
                        <div className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100/50 dark:border-blue-800/30">
                           <Heart size={16} className="text-purple-500 dark:text-purple-400 shrink-0 mt-0.5" />
                           <span className="italic font-medium">"{item.analogy}"</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 pl-1 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => { setFile(null); setStep('upload'); }}
              className="w-full py-4 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition flex items-center justify-center gap-2"
            >
              Analyze another report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}