import React, { useState } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Brain, BarChart3, PlayCircle, FileSearch, Menu, X, Sparkles, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, reportData, paymentRecord } = useAssessment();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'analysis', label: 'Product B: AI Analysis', icon: Sparkles },
    { id: 'academic-project', label: 'HRM301 Standards', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-sky-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white">
                  Persona<span className="text-sky-400">Insight</span>
                </span>
                <span className="text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  HRM301
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Industrial Psychology & Document AI</p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveView(link.id as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeView === link.id
                      ? 'text-white bg-slate-800/90 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-sky-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}

            {reportData && (
              <button
                onClick={() => setActiveView(paymentRecord?.status === 'VERIFIED' ? 'report' : 'results')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === 'results' || activeView === 'report'
                    ? 'text-purple-300 bg-purple-950/50 border border-purple-500/30'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/30'
                }`}
              >
                My Profile & Report
              </button>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Link */}
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activeView === 'admin'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                  : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Take Assessment */}
            <button
              onClick={() => setActiveView('intake')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-purple-600/25 transition-all hover:scale-102"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Take Assessment</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800/80"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { setActiveView(link.id as any); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeView === link.id ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setActiveView('faq'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/50"
          >
            FAQ
          </button>
          <button
            onClick={() => { setActiveView('contact'); setMobileMenuOpen(false); }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/50"
          >
            Contact Support
          </button>
        </div>
      )}
    </header>
  );
};
