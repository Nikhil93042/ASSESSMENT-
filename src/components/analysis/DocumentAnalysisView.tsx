import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, 
  BarChart2, FileSpreadsheet, Download, RefreshCw, Layers, Sparkles, Clock, Info 
} from 'lucide-react';

interface AnalysisResult {
  analysisId: string;
  fileName: string;
  fileType: 'PDF' | 'XLSX' | 'CSV';
  fileSize: number;
  qualityScore: number;
  scoreBreakdown: {
    completeness: number;
    accuracy: number;
    structure: number;
    clarity: number;
    dataQuality: number;
    formatting: number;
    actionability: number;
  };
  summary: string;
  strengths: string[];
  problems: string[];
  priorityIssues: string[];
  recommendations: Array<{
    area: string;
    currentInsight: string;
    whyItMatters: string;
    specificAction: string;
    suggestedTimeframe: string;
    expectedOutcome: string;
  }>;
  extractedMetadata?: any;
  columnAnalysis?: Array<{
    columnName: string;
    dominantType: string;
    totalCount: number;
    emptyCount: number;
    missingPct: number;
    sampleValues: any[];
  }>;
  createdAt?: string;
}

export const DocumentAnalysisView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/analysis/history`);
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (!['pdf', 'xlsx', 'xls', 'csv'].includes(ext || '')) {
        setError('Unsupported file type. Please upload a PDF, XLSX, or CSV file.');
        setFile(null);
        return;
      }
      setError(null);
      setFile(selected);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/analysis/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.analysis) {
        setResult(data.analysis);
        fetchHistory();
      } else {
        setError(data.message || 'Analysis failed. Please check the uploaded file format.');
      }
    } catch (e: any) {
      setError(e.message || 'Error connecting to analysis engine server.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Product B: Intelligence
            </span>
            <span className="text-slate-400 text-xs font-mono">Universal File Processor</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">AI Document & Data Quality Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">
            Automated PDF structural profiling, XLSX/CSV cell auditing, Quality Score (/100), and personalized recommendations.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'upload' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); fetchHistory(); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'history' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Analysis History ({history.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="space-y-8">
          
          {/* File Upload Box */}
          <div className="bg-slate-900/70 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 transition-colors p-8 text-center relative overflow-hidden">
            <input
              type="file"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            
            <div className="max-w-md mx-auto space-y-4 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                {file?.name.endsWith('.pdf') ? (
                  <FileText className="w-8 h-8" />
                ) : file ? (
                  <FileSpreadsheet className="w-8 h-8" />
                ) : (
                  <Upload className="w-8 h-8" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {file ? file.name : 'Upload PDF, XLSX, or CSV File'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {file ? `${(file.size / 1024).toFixed(1)} KB • Ready for analysis` : 'Drag and drop or click to select your document'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-sky-400" /> PDF Intelligence</span>
                <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> XLSX / CSV Data Profiling</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {file && !loading && (
            <div className="flex justify-end">
              <button
                onClick={handleUploadAndAnalyze}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-102"
              >
                <Sparkles className="w-5 h-5" />
                <span>Execute Deep AI Quality Analysis</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="p-12 bg-slate-900/90 rounded-2xl border border-slate-800 text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div>
                <h4 className="text-lg font-bold text-white">Profiling & Calculating Quality Metrics...</h4>
                <p className="text-xs text-slate-400 mt-1">Inspecting data types, cell completeness, structure, and actionability.</p>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {result && (
            <div className="space-y-8 bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-slate-800">
              
              {/* Quality Score Hero Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-800 pb-8">
                
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                      Analysis ID: {result.analysisId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{result.fileType} Document</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{result.fileName}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                </div>

                {/* Score Dial */}
                <div className={`p-6 rounded-2xl border text-center space-y-1 shadow-xl ${getScoreColor(result.qualityScore)}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider">Document Quality Score</p>
                  <div className="text-5xl font-black">{result.qualityScore}<span className="text-2xl font-normal opacity-70">/100</span></div>
                  <p className="text-xs opacity-90 font-medium">
                    {result.qualityScore >= 80 ? 'Excellent Structure & Integrity' : result.qualityScore >= 60 ? 'Moderate Quality — Action Required' : 'Critical Data Issues Detected'}
                  </p>
                </div>
              </div>

              {/* Quality Score Breakdown Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-400" />
                  Quality Dimension Breakdown
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {[
                    { label: 'Completeness', val: result.scoreBreakdown.completeness },
                    { label: 'Accuracy', val: result.scoreBreakdown.accuracy },
                    { label: 'Structure', val: result.scoreBreakdown.structure },
                    { label: 'Clarity', val: result.scoreBreakdown.clarity },
                    { label: 'Data Quality', val: result.scoreBreakdown.dataQuality },
                    { label: 'Formatting', val: result.scoreBreakdown.formatting },
                    { label: 'Actionability', val: result.scoreBreakdown.actionability },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <p className="text-[11px] text-slate-400">{item.label}</p>
                      <p className="text-lg font-bold text-white">{item.val}%</p>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${item.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Distinctions Box */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Source Data</span>
                  <span className="text-slate-200 font-mono">{result.fileName} ({result.fileType})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Calculated Score</span>
                  <span className="text-emerald-400 font-bold">{result.qualityScore} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">AI Interpretation</span>
                  <span className="text-slate-200">{result.strengths.length} Strengths, {result.problems.length} Issues</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Missing Information</span>
                  <span className="text-amber-400 font-semibold">{result.problems.length > 0 ? `${result.problems.length} Items` : 'None Identified'}</span>
                </div>
              </div>

              {/* Strengths vs Problems */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Top Strengths Identified
                  </h4>
                  <ul className="space-y-2">
                    {result.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Problems */}
                <div className="bg-slate-900/80 p-5 rounded-xl border border-rose-500/20 space-y-3">
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Critical Issues & Missing Data
                  </h4>
                  {result.problems.length === 0 ? (
                    <p className="text-xs text-slate-400">No major issues found in this file.</p>
                  ) : (
                    <ul className="space-y-2">
                      {result.problems.map((pr, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                          <span>{pr}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* Structured Recommendations */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Personalized AI Recommendations
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{rec.area}</span>
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{rec.suggestedTimeframe}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-200">"{rec.currentInsight}"</p>
                      <p className="text-xs text-slate-400"><strong>Why it matters:</strong> {rec.whyItMatters}</p>
                      <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-emerald-300">
                        <strong>Action:</strong> {rec.specificAction}
                      </div>
                      <p className="text-[11px] text-slate-400"><strong>Expected Outcome:</strong> {rec.expectedOutcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column Level Spreadsheet Analysis */}
              {result.columnAnalysis && result.columnAnalysis.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200">Spreadsheet Column Audit</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Column Name</th>
                          <th className="p-3">Data Type</th>
                          <th className="p-3">Total Rows</th>
                          <th className="p-3">Empty Cells</th>
                          <th className="p-3">Missing %</th>
                          <th className="p-3">Sample Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {result.columnAnalysis.map((col, i) => (
                          <tr key={i} className="hover:bg-slate-900/50">
                            <td className="p-3 font-semibold text-white">{col.columnName}</td>
                            <td className="p-3"><span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{col.dominantType}</span></td>
                            <td className="p-3">{col.totalCount}</td>
                            <td className="p-3 text-amber-400">{col.emptyCount}</td>
                            <td className="p-3">{col.missingPct}%</td>
                            <td className="p-3 font-mono text-[11px] text-slate-400">{JSON.stringify(col.sampleValues)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Document Analysis History</h3>
          {history.length === 0 ? (
            <p className="text-slate-400 text-sm">No document analysis records found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => (
                <div 
                  key={item.analysisId}
                  onClick={() => { setResult(item); setActiveTab('upload'); }}
                  className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400">{item.analysisId}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(item.qualityScore)}`}>
                      {item.qualityScore}/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{item.fileName}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.summary}</p>
                  <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
                    <span>{item.fileType}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
