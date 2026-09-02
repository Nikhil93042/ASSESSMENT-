import React from 'react';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPages } from './pages/LegalPages';
import { AcademicProjectPage } from './pages/AcademicProjectPage';

import { IntakeModal } from './components/assessment/IntakeModal';
import { QuestionCard } from './components/assessment/QuestionCard';
import { BasicResultsView } from './components/results/BasicResultsView';
import { UpiPaymentModal } from './components/payment/UpiPaymentModal';
import { DetailedReportView } from './components/report/DetailedReportView';
import { DocumentAnalysisView } from './components/analysis/DocumentAnalysisView';
import { RevenueDashboard } from './components/admin/RevenueDashboard';

const MainContent: React.FC = () => {
  const { activeView } = useAssessment();

  return (
    <main className="min-h-[calc(100vh-80px-300px)]">
      {activeView === 'home' && <HomePage />}
      {activeView === 'about' && <AboutPage />}
      {activeView === 'pricing' && <PricingPage />}
      {activeView === 'how-it-works' && <HowItWorksPage />}
      {activeView === 'faq' && <FaqPage />}
      {activeView === 'contact' && <ContactPage />}
      {activeView === 'privacy' && <LegalPages type="privacy" />}
      {activeView === 'terms' && <LegalPages type="terms" />}
      {activeView === 'disclaimer' && <LegalPages type="disclaimer" />}
      {activeView === 'academic-project' && <AcademicProjectPage />}

      {activeView === 'intake' && <IntakeModal />}
      {activeView === 'assessment' && <QuestionCard />}
      {activeView === 'results' && <BasicResultsView />}
      {activeView === 'payment' && <UpiPaymentModal />}
      {activeView === 'report' && <DetailedReportView />}
      {activeView === 'analysis' && <DocumentAnalysisView />}
      {activeView === 'admin' && <RevenueDashboard />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AssessmentProvider>
      <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AssessmentProvider>
  );
};

export default App;
