import React from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';

export const CoCTrackerView: React.FC = () => {
  const { activePatient, patients, setActivePatient, setActiveView } = useApp();

  const cocStages = [
    {
      id: 'step-1',
      title: '1. First Booking Visit (< 12 Weeks)',
      desc: 'Early ANC registration, baseline lab screenings, and risk triage.',
      status: 'Completed',
      date: '2024-05-10',
      icon: 'how_to_reg',
      viewToOpen: 'registration' as const,
    },
    {
      id: 'step-2',
      title: '2. ANC 4+ Routine Contact Series',
      desc: 'Minimum 8 contacts recommended. IPTp malaria doses, TD tetanus, iron/folic acid.',
      status: 'Completed',
      date: '2024-08-09 (Visit 4)',
      icon: 'event_repeat',
      viewToOpen: 'anc' as const,
    },
    {
      id: 'step-3',
      title: '3. Facility Skilled Delivery',
      desc: 'Supervised birth by skilled midwife/obstetrician, intrapartum monitoring, newborn resuscitation.',
      status: activePatient.currentStage === 'PNC' || activePatient.currentStage === 'CWC' ? 'Completed' : 'In Progress',
      date: '2024-10-12',
      icon: 'child_care',
      viewToOpen: 'delivery' as const,
    },
    {
      id: 'step-4',
      title: '4. PNC Mother Contacts (24h, 6d, 6w)',
      desc: 'Maternal involution, PPD screening, complication management, lactational support.',
      status: activePatient.currentStage === 'PNC' ? 'In Progress' : 'Pending',
      date: '2024-10-14',
      icon: 'female',
      viewToOpen: 'pnc' as const,
    },
    {
      id: 'step-5',
      title: '5. Child PNC & EPI Immunization',
      desc: 'BCG, OPV, Penta vaccines, developmental milestones & growth monitoring.',
      status: 'Pending',
      date: 'Target: 6 Weeks',
      icon: 'child_friendly',
      viewToOpen: 'child' as const,
    },
    {
      id: 'step-6',
      title: '6. Postpartum Family Planning (PPFP)',
      desc: 'Counseling and method uptake (Implants, IUD, Injectables, Barrier).',
      status: 'In Progress',
      date: 'Accepted Implanon NXT',
      icon: 'family_restroom',
      viewToOpen: 'pnc' as const,
    },
  ];

  const completedCount = cocStages.filter((s) => s.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / cocStages.length) * 100);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Progress Bar Card */}
      <div className="bg-gradient-to-r from-[#005f5e] to-[#007a78] text-white p-6 rounded-2xl shadow-xs space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#abfffc]">route</span>
            Maternal & Child Care Journey Completion
          </span>
          <span className="font-black text-xl text-[#abfffc]">{progressPercent}%</span>
        </div>

        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-[#abfffc] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-xs text-[#abfffc]/90">
          {completedCount} of 6 essential continuum of care milestones fulfilled.
        </p>
      </div>

      {/* Timeline Journey Nodes */}
      <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#111c2d] border-b pb-3 border-[#bdc9c8]/30">
          Life-Course Care Continuum Milestones
        </h2>

        <div className="space-y-4">
          {cocStages.map((stage) => {
            const isDone = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress';

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  isDone
                    ? 'bg-[#abfffc]/10 border-[#005f5e]/30'
                    : isInProgress
                    ? 'bg-[#edf0ff] border-[#0051b0]/30'
                    : 'bg-[#f8fafc] border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-[#005f5e] text-white'
                        : isInProgress
                        ? 'bg-[#0051b0] text-white'
                        : 'bg-[#e2e8f0] text-[#6e7978]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{stage.icon}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#111c2d]">{stage.title}</h3>
                    <p className="text-xs text-[#3e4948] mt-0.5 max-w-xl">{stage.desc}</p>
                    <span className="text-[11px] text-[#6e7978] block mt-1 font-mono">
                      {stage.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isDone
                        ? 'bg-[#abfffc] text-[#005f5e]'
                        : isInProgress
                        ? 'bg-[#0051b0]/20 text-[#0051b0]'
                        : 'bg-[#e2e8f0] text-[#6e7978]'
                    }`}
                  >
                    {stage.status}
                  </span>

                  <button
                    onClick={() => setActiveView(stage.viewToOpen)}
                    className="px-3 py-1.5 bg-white border border-[#bdc9c8] text-[#005f5e] hover:bg-[#f0f3ff] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Open View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
