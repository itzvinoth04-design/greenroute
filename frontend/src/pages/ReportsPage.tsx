import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  Bot,
  Calendar,
  CheckCircle2,
  TrendingDown,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Report } from '../types';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.reports.getReports();
      if (res.data?.success) {
        setReports(res.data.reports);
        if (res.data.reports.length > 0 && !selectedReport) {
          setSelectedReport(res.data.reports[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const res = await api.reports.generate(currentMonth);
      if (res.data?.success) {
        await fetchReports();
        setSelectedReport(res.data.report);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate monthly report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadCSV = (reportId?: string) => {
    const url = api.reports.getCSVUrl(reportId);
    window.open(url, '_blank');
  };

  const handleDownloadPDF = (reportId?: string) => {
    const url = api.reports.getPDFUrl(reportId);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>AI Monthly Sustainability Reports</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
              Audit Ready
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official carbon offset statements and personalized transit improvement recommendations generated with IBM Granite AI.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>{generating ? 'Generating with Granite...' : 'Generate New Monthly Report'}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Report List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Monthly Statements
          </h3>

          {loading ? (
            <p className="text-xs text-slate-400">Loading statements...</p>
          ) : reports.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No monthly reports found yet.</p>
              <button
                onClick={handleGenerateReport}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Generate your first report &rarr;
              </button>
            </div>
          ) : (
            reports.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-4 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {r.month}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                      +{r.emissionsSaved} kg Saved
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{r.totalTrips} logged trips</span>
                    <span>•</span>
                    <span>Avg Score: {r.avgScore}/100</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Report Viewer & Export Actions (8 cols) */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    GreenRoute Verified Statement
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedReport.month} Sustainability Audit
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Compiled on {new Date(selectedReport.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadPDF(selectedReport.id)}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCSV(selectedReport.id)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Total Trips</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedReport.totalTrips}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">CO₂ Saved</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {selectedReport.emissionsSaved} kg
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Avg Score</span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedReport.avgScore}/100
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Top Mode</span>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {selectedReport.topTransport}
                  </div>
                </div>
              </div>

              {/* IBM Granite AI Summary & Recommendations */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-600" />
                    <span>IBM Granite AI Assessment & Recommendations</span>
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    ibm/granite-13b-chat-v2
                  </span>
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line prose dark:prose-invert">
                  {selectedReport.aiSummary}
                </div>
              </div>

              {/* Compliance & Standards Note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>
                  Carbon calculations verified in accordance with UN SDG 11 & SDG 13 Urban Transit Methodologies.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Select a report from the list or generate a new one to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
