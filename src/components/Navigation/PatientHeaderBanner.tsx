import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KhayaVoiceDictationModal } from '../KhayaAI/KhayaVoiceDictationModal';
import { KhayaPatientAlertModal } from '../KhayaAI/KhayaPatientAlertModal';

export const PatientHeaderBanner: React.FC = () => {
  const { activePatient, patients, setActivePatient, setActiveView, activeView } = useApp();
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [dictationOpen, setDictationOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPatientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHighRisk = activePatient.riskStatus === 'High Risk';

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#bdc9c8]/40 shadow-xs relative space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Left: Active Client Information */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-xs ${
              isHighRisk
                ? 'bg-[#a5374a] text-white'
                : 'bg-[#005f5e] text-white'
            }`}
          >
            {activePatient.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-[#111c2d] tracking-tight">
                {activePatient.name}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isHighRisk
                    ? 'bg-[#a5374a]/10 text-[#a5374a] border border-[#a5374a]/30'
                    : 'bg-[#abfffc]/40 text-[#005f5e] border border-[#005f5e]/20'
                }`}
              >
                {activePatient.riskStatus}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f0f3ff] text-[#3e4948] border border-[#bdc9c8]/30">
                {activePatient.currentStage}
              </span>
            </div>

            <p className="text-xs text-[#6e7978] mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Reg No: <strong className="text-[#111c2d]">{activePatient.regNo}</strong>
              </span>
              <span>•</span>
              <span>
                NHIS: <strong className="text-[#111c2d]">{activePatient.nhisNo}</strong>
              </span>
              <span>•</span>
              <span>
                Age: <strong className="text-[#111c2d]">{activePatient.age} yrs</strong>
              </span>
              <span>•</span>
              <span>
                Gestational Age:{' '}
                <strong className="text-[#005f5e]">{activePatient.gestationWeeks} Wks</strong>
              </span>
            </p>
          </div>
        </div>

        {/* Right: Quick Patient Switcher, EDD & Khaya AI Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#bdc9c8]/30">
          <div className="text-left lg:text-right pr-2 border-r border-[#bdc9c8]/30">
            <span className="text-[10px] font-bold text-[#6e7978] uppercase tracking-wider block">
              Estimated Delivery
            </span>
            <span className="text-xs sm:text-sm font-black text-[#111c2d]">
              {activePatient.edd}
            </span>
          </div>

          {/* Khaya Voice Dictate Button */}
          <button
            onClick={() => setDictationOpen(true)}
            className="px-3 py-1.5 bg-[#005f5e] hover:bg-[#007a78] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Dictate Clinical Notes in Dagbani / Twi"
          >
            <span className="material-symbols-outlined text-sm text-[#abfffc]">mic</span>
            <span>Khaya Dictation</span>
          </button>

          {/* Khaya Local Audio / SMS Alert Button */}
          <button
            onClick={() => setAlertModalOpen(true)}
            className="px-3 py-1.5 bg-[#a5374a]/10 hover:bg-[#a5374a]/20 text-[#a5374a] border border-[#a5374a]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Generate Localized Audio/SMS Alert in Dagbani"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            <span>Dagbani Alert</span>
          </button>

          {/* Switch Active Client Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
              className="px-3 py-1.5 bg-[#f0f3ff] hover:bg-[#dee8ff] border border-[#bdc9c8]/50 rounded-xl text-xs font-semibold text-[#005f5e] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">switch_account</span>
              <span>Switch Client</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>

            {patientDropdownOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white border border-[#bdc9c8] rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                <div className="px-3 py-2 text-[11px] font-bold text-[#6e7978] bg-[#f8fafc] border-b border-[#e2e8f0]">
                  Select Active Client Record ({patients.length})
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[#e2e8f0]">
                  {patients.map((p) => {
                    const isSelected = p.id === activePatient.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePatient(p);
                          setPatientDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left text-xs hover:bg-[#f0f3ff] transition-colors flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-[#abfffc]/20' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[#111c2d]">{p.name}</div>
                          <div className="text-[10px] text-[#6e7978]">
                            ID: {p.id} • {p.gestationWeeks} Wks
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.riskStatus === 'High Risk'
                              ? 'bg-[#a5374a]/10 text-[#a5374a]'
                              : 'bg-[#005f5e]/10 text-[#005f5e]'
                          }`}
                        >
                          {p.riskStatus}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Record Navigation Quick Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#bdc9c8]/30 text-xs">
        {[
          { id: 'anc', label: 'ANC Visits', icon: 'event_note' },
          { id: 'obstetric', label: 'Obstetric History', icon: 'history_edu' },
          { id: 'delivery', label: 'Delivery Records', icon: 'child_care' },
          { id: 'pnc', label: 'PNC Mother', icon: 'female' },
          { id: 'child', label: 'Child Profile', icon: 'child_friendly' },
          { id: 'coc', label: 'CoC Roadmap', icon: 'timeline' },
        ].map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#005f5e] text-white shadow-2xs'
                  : 'bg-[#f0f3ff] text-[#3e4948] hover:bg-[#dee8ff] hover:text-[#111c2d]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {/* Khaya Modals */}
      <KhayaVoiceDictationModal
        isOpen={dictationOpen}
        onClose={() => setDictationOpen(false)}
        defaultLanguage="Dagbani"
      />

      <KhayaPatientAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultLanguage="Dagbani"
      />
    </div>
  );
};
