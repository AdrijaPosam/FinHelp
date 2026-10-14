import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/layout/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionManager } from './components/tracker/TransactionManager';
import { PocketMoneyPlanner } from './components/planner/PocketMoneyPlanner';
import { PurchaseRealityCheckView } from './components/ai/PurchaseRealityCheckView';
import { SavingsQuestView } from './components/gamification/SavingsQuestView';
import { AskFinnyView } from './components/ai/AskFinnyDrawer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isLoading, profile } = useFinance();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading && !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-emerald-400 animate-spin flex items-center justify-center text-white font-black text-xl">
              F
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Loading FinHelp...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage onStartOnboarding={() => setIsOnboardingOpen(true)} />
            )}
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'tracker' && <TransactionManager />}
            {activeTab === 'planner' && <PocketMoneyPlanner />}
            {activeTab === 'reality-check' && <PurchaseRealityCheckView />}
            {activeTab === 'quest' && <SavingsQuestView />}
            {activeTab === 'chat' && <AskFinnyView />}
          </>
        )}
      </main>

      <Footer />
      <Toast />

      {/* Onboarding Dialog */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
