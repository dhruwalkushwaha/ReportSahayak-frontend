'use client';

import { useState } from 'react';
import axios from 'axios';
import { Upload, Activity, Heart, Loader2, AlertCircle } from 'lucide-react';

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
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [labName, setLabName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');
    setStep('analyzing');

    const formData = new FormData();
    formData.append('file', file);

    // Get Backend URL from env or fallback to Render URL directly
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://reportsahayak-backend.onrender.com';

    try {
      // 1. Upload & Parse
      const uploadRes = await axios.post(`${API_URL}/upload-report/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const parsedData = uploadRes.data;
      setLabName(parsedData.lab_name);

      // 2. Analyze
      const analyzeRes = await axios.post(`${API_URL}/analyze-report/`, {
        parsed_report: parsedData,
        language: language
      });

      setAnalysis(analyzeRes.data);
      setStep('results');
    } catch (err: any) {
      console.error(err);
      setStep('upload');
      setErrorMsg('Failed to analyze. Please ensure the PDF is readable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white p-2 rounded-lg">
            <Activity size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">REPORTSAHAYAK</span>
        </div>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
          className="bg-stone-100 border-none text-sm font-medium rounded-md px-3 py-2 cursor-pointer hover:bg-stone-200 transition"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </nav>

      <main className="max-w-3xl mx-auto p-6 mt-6">
        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {step === 'upload' && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-10 text-center hover:border-blue-400 transition-colors duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Upload Lab Report</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              We support Dr Lal PathLabs, Apollo, Healthians, and most scanned PDF reports.
            </p>

            <label className="block w-full max-w-xs mx-auto mb-4 cursor-pointer">
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="bg-slate-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2">
                {file ? file.name : "Select PDF File"}
              </div>
            </label>

            {file && (
              <button 
                onClick={handleUpload}
                disabled={loading}
                className="w-full max-w-xs bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Analyze Now"}
              </button>
            )}
          </div>
        )}

        {/* STEP 2: LOADING */}
        {step === 'analyzing' && (
          <div className="text-center py-20">
            <Loader2 size={64} className="text-blue-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800">Analyzing Report...</h2>
            <p className="text-slate-500 mt-2">Reading medical terms & crunching numbers</p>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === 'results' && analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Summary Box */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {language === 'hi' ? 'सारांश' : 'SUMMARY'}
                </h3>
                {labName && <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">Lab: {labName}</span>}
              </div>
              <p className="text-lg leading-relaxed text-slate-700">{analysis.summary}</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 text-amber-800 text-xs p-4 rounded-lg border border-amber-100">
              {analysis.disclaimer}
            </div>

            {/* Details Grid */}
            {Object.entries(analysis.details).map(([category, items]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-6 py-3 border-b border-stone-200">
                  <h3 className="font-bold text-slate-700 capitalize">{category}</h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {items.map((item, i) => (
                    <div key={i} className="p-5 hover:bg-blue-50/30 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900">{item.test_name}</h4>
                          <p className="text-2xl font-bold text-slate-800 mt-1">{item.value}</p>
                        </div>
                        <div className="flex items-start">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${item.status.toLowerCase().includes('normal') ? 'bg-green-100 text-green-700' : 
                              item.status.toLowerCase().includes('high') ? 'bg-red-100 text-red-700' : 
                              'bg-yellow-100 text-yellow-700'}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Analogy & Explanation */}
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                           <Heart size={16} className="text-purple-500 shrink-0 mt-0.5" />
                           <span className="italic">"{item.analogy}"</span>
                        </div>
                        <p className="text-sm text-slate-500 pl-1">{item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={() => { setFile(null); setStep('upload'); }}
              className="w-full py-4 text-slate-500 hover:text-blue-600 font-medium transition"
            >
              ← Analyze another report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}