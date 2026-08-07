import React from 'react';
import { useApp } from '../../context/AppContext';

export const QuickActionModal: React.FC = () => {
  const { quickActionOpen, setQuickActionOpen, setActiveView, setNewStaffModalOpen } = useApp();

  if (!quickActionOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setQuickActionOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-[#bdc9c8]/40 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e] text-2xl">
              bolt
            </span>
            <h3 className="font-headline-sm text-lg font-bold text-[#111c2d]">
              Quick Actions Hub
            </h3>
          </div>
          <button
            onClick={() => setQuickActionOpen(false)}
            className="text-[#6e7978] hover:bg-[#f0f3ff] p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-sm text-[#3e4948] mb-5">
          Select an action below to quickly navigate or log clinical antenatal records.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setActiveView('registration');
              setQuickActionOpen(false);
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f0f3ff] border border-[#bdc9c8]/30 hover:border-[#005f5e] hover:bg-[#dee8ff] transition-all text-center h-28 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#005f5e] text-2xl mb-2 group-hover:scale-110 transition-transform">
              person_add
            </span>
            <span className="font-label-md text-xs sm:text-sm font-semibold text-[#111c2d]">
              Register New Mother
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('anc');
              setQuickActionOpen(false);
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f0f3ff] border border-[#bdc9c8]/30 hover:border-[#005f5e] hover:bg-[#dee8ff] transition-all text-center h-28 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#005f5e] text-2xl mb-2 group-hover:scale-110 transition-transform">
              event_note
            </span>
            <span className="font-label-md text-xs sm:text-sm font-semibold text-[#111c2d]">
              Record ANC Visit
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('delivery');
              setQuickActionOpen(false);
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f0f3ff] border border-[#bdc9c8]/30 hover:border-[#0051b0] hover:bg-[#dee8ff] transition-all text-center h-28 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#0051b0] text-2xl mb-2 group-hover:scale-110 transition-transform">
              child_care
            </span>
            <span className="font-label-md text-xs sm:text-sm font-semibold text-[#111c2d]">
              Record Delivery
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('pnc');
              setQuickActionOpen(false);
            }}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f0f3ff] border border-[#bdc9c8]/30 hover:border-[#a5374a] hover:bg-[#dee8ff] transition-all text-center h-28 cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[#a5374a] text-2xl mb-2 group-hover:scale-110 transition-transform">
              female
            </span>
            <span className="font-label-md text-xs sm:text-sm font-semibold text-[#111c2d]">
              Log PNC Visit
            </span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-[#bdc9c8]/30 flex justify-between items-center">
          <button
            onClick={() => {
              setQuickActionOpen(false);
              setNewStaffModalOpen(true);
            }}
            className="text-xs font-semibold text-[#005f5e] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">group_add</span>
            + Add Healthcare Staff
          </button>

          <button
            onClick={() => setQuickActionOpen(false)}
            className="px-4 py-2 bg-[#f0f3ff] text-[#3e4948] text-xs font-semibold rounded-lg hover:bg-[#dee8ff] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
