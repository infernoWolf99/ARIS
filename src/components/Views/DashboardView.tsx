import React from 'react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const { patients, setActivePatient, setActiveView, setQuickActionOpen } = useApp();

  const [riskFilter, setRiskFilter] = React.useState<'All' | 'High Risk' | 'Normal'>('High Risk');

  const filteredPatients = patients.filter((p) => {
    if (riskFilter === 'High Risk') return p.riskStatus === 'High Risk';
    if (riskFilter === 'Normal') return p.riskStatus === 'Normal';
    return true;
  });

  const highRiskPatients = patients.filter((p) => p.riskStatus === 'High Risk');
  const activeAncCount = patients.filter((p) => p.currentStage === 'ANC').length + 478;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#005f5e] to-[#007a78] text-white p-6 sm:p-8 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-[#abfffc]/20 text-[#abfffc] rounded-full text-xs font-semibold mb-3">
            Ghana Health Service • ARIS Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
            Antenatal Clinical Overview
          </h1>
          <p className="text-sm text-[#abfffc]/90 leading-relaxed">
            Real-time maternal care tracking, high-risk patient surveillance, and continuum of care monitoring for Accra Polyclinic.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('registration')}
              className="bg-white text-[#005f5e] px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#abfffc] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Register New Mother
            </button>
            <button
              onClick={() => setQuickActionOpen(true)}
              className="bg-[#007a78] text-white border border-[#abfffc]/30 px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-[#005f5e] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">bolt</span>
              Quick Record Logging
            </button>
            <button
              onClick={() => setActiveView('anc')}
              className="bg-[#abfffc]/30 text-[#abfffc] border border-[#abfffc]/40 px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:bg-[#abfffc] hover:text-[#005f5e] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              Khaya Voice Dictate (Dagbani)
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#bdc9c8]/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#6e7978] uppercase tracking-wider mb-1">
              Active ANC Clients
            </p>
            <div className="text-2xl font-black text-[#111c2d]">{activeAncCount}</div>
            <p className="text-xs text-[#005f5e] font-semibold mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +12% this month
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#007a78]/10 text-[#005f5e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#bdc9c8]/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#6e7978] uppercase tracking-wider mb-1">
              High Risk Watchlist
            </p>
            <div className="text-2xl font-black text-[#a5374a]">{highRiskPatients.length}</div>
            <p className="text-xs text-[#a5374a] font-semibold mt-1">
              Requires active surveillance
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#a5374a]/10 text-[#a5374a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl icon-fill">warning</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#bdc9c8]/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#6e7978] uppercase tracking-wider mb-1">
              Deliveries This Month
            </p>
            <div className="text-2xl font-black text-[#0051b0]">42</div>
            <p className="text-xs text-[#0051b0] font-semibold mt-1">
              98% SVD • 2 C-Section
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#0051b0]/10 text-[#0051b0] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">child_care</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#bdc9c8]/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#6e7978] uppercase tracking-wider mb-1">
              ANC 4+ Coverage
            </p>
            <div className="text-2xl font-black text-[#005f5e]">88%</div>
            <p className="text-xs text-[#005f5e] font-semibold mt-1">
              Target: &gt;85% achieved
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#005f5e]/10 text-[#005f5e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>
      </div>

      {/* Main Content Split: High Risk Watchlist + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): High Risk Watchlist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a5374a] text-2xl icon-fill">
                e911_emergency
              </span>
              <h2 className="text-lg font-bold text-[#111c2d]">
                Clinical Surveillance Watchlist
              </h2>
            </div>

            {/* Risk Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#f0f3ff] p-1 rounded-xl border border-[#bdc9c8]/40">
              {(['High Risk', 'Normal', 'All'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    riskFilter === filter
                      ? filter === 'High Risk'
                        ? 'bg-[#a5374a] text-white shadow-xs'
                        : 'bg-[#005f5e] text-white shadow-xs'
                      : 'text-[#3e4948] hover:text-[#111c2d]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-xl border border-[#bdc9c8]/40 p-4 shadow-xs hover:border-[#a5374a] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#111c2d]">{patient.name}</h3>
                      <p className="text-xs text-[#6e7978]">
                        ID: {patient.id} • Age: {patient.age}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#a5374a]/10 text-[#a5374a]">
                      High Risk
                    </span>
                  </div>

                  <div className="my-2 p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#6e7978]">Gestational Age:</span>
                      <span className="font-semibold text-[#111c2d]">
                        {patient.gestationWeeks} Weeks
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6e7978]">EDD:</span>
                      <span className="font-semibold text-[#111c2d]">{patient.edd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6e7978]">Obstetric Formula:</span>
                      <span className="font-semibold text-[#111c2d]">
                        G{patient.gravida} P{patient.para} A{patient.abortions} L{patient.livingChildren}
                      </span>
                    </div>
                  </div>

                  {/* Primary Risk Factors */}
                  <div className="space-y-1 my-2">
                    {patient.riskFactors.map((rf) => (
                      <div
                        key={rf.id}
                        className="text-[11px] font-medium text-[#730f28] bg-[#fd7a8c]/15 px-2 py-1 rounded-md flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-xs">warning</span>
                        <span className="truncate">
                          <strong>{rf.name}:</strong> {rf.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-center mt-2">
                  <span className="text-[11px] text-[#6e7978]">
                    Stage: <strong className="text-[#005f5e]">{patient.currentStage}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setActivePatient(patient);
                      setActiveView('anc');
                    }}
                    className="px-3 py-1.5 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors cursor-pointer"
                  >
                    Open Clinical Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clinical Trend Metrics & Quick Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#bdc9c8]/30 shadow-xs">
            <h3 className="font-bold text-sm text-[#111c2d] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005f5e]">bar_chart</span>
              Monthly Registration Trends
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#3e4948]">New ANC Registrations</span>
                  <span className="font-bold text-[#111c2d]">64 / mo</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#005f5e] h-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#3e4948]">PNC 6-Week Completion</span>
                  <span className="font-bold text-[#111c2d]">82%</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0051b0] h-full w-[82%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#3e4948]">Deworming & Malaria IPTp Coverage</span>
                  <span className="font-bold text-[#111c2d]">91%</span>
                </div>
                <div className="w-full bg-[#f0f3ff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#007a78] h-full w-[91%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f3ff] p-5 rounded-xl border border-[#bdc9c8]/40 shadow-xs">
            <h3 className="font-bold text-sm text-[#111c2d] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005f5e]">menu_book</span>
              GHS ANC Standard Protocols
            </h3>
            <p className="text-xs text-[#3e4948] leading-relaxed mb-4">
              All ANC visits require mandatory BP, Hemoglobin, Urine Protein, and HIV re-testing protocols at designated trimesters.
            </p>
            <button
              onClick={() => setActiveView('coc')}
              className="w-full bg-white text-[#005f5e] border border-[#005f5e] hover:bg-[#005f5e] hover:text-white transition-all py-2 rounded-lg font-semibold text-xs cursor-pointer"
            >
              Review Continuum of Care Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
