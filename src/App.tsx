import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SideNavBar } from './components/Navigation/SideNavBar';
import { TopHeader } from './components/Navigation/TopHeader';
import { QuickActionModal } from './components/Modals/QuickActionModal';
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { NewStaffModal } from './components/Modals/NewStaffModal';
import { DashboardView } from './components/Views/DashboardView';
import { FacilitySetupView } from './components/Views/FacilitySetupView';
import { RegistrationView } from './components/Views/RegistrationView';
import { ObstetricHistoryView } from './components/Views/ObstetricHistoryView';
import { ANCVisitsView } from './components/Views/ANCVisitsView';
import { DeliveryRecordsView } from './components/Views/DeliveryRecordsView';
import { PNCMotherView } from './components/Views/PNCMotherView';
import { ChildProfileView } from './components/Views/ChildProfileView';
import { CoCTrackerView } from './components/Views/CoCTrackerView';

const MainAppContent: React.FC = () => {
  const { activeView, toastMessage } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'facility':
        return <FacilitySetupView />;
      case 'registration':
        return <RegistrationView />;
      case 'obstetric':
        return <ObstetricHistoryView />;
      case 'anc':
        return <ANCVisitsView />;
      case 'delivery':
        return <DeliveryRecordsView />;
      case 'pnc':
        return <PNCMotherView />;
      case 'child':
        return <ChildProfileView />;
      case 'coc':
        return <CoCTrackerView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col font-inter">
      {/* Side Navigation */}
      <SideNavBar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <TopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        {/* View Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-8 border-t border-[#bdc9c8]/30 text-center text-xs text-[#6e7978] bg-white">
          <p>
            ARIS — Antenatal Records & Information System • Ghana Health Service (GHS)
          </p>
        </footer>
      </div>

      {/* Floating Modals */}
      <QuickActionModal />
      <NotificationsModal />
      <NewStaffModal />

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111c2d] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#bdc9c8]/40 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <span className="material-symbols-outlined text-[#abfffc] text-lg">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
