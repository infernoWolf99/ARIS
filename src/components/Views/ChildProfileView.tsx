import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';

export const ChildProfileView: React.FC = () => {
  const { childRecords, addChildGrowthEntry, activePatient, showToast } = useApp();

  const activeChild =
    childRecords.find((c) => c.motherPatientId === activePatient.id) || childRecords[0];

  const [milestone, setMilestone] = useState('10w');
  const [weightKg, setWeightKg] = useState<number>(5.2);
  const [heightCm, setHeightCm] = useState<number>(58);
  const [muacCm, setMuacCm] = useState<number>(13.2);
  const [sdRating, setSdRating] = useState('Normal (Green)');

  const handleAddGrowth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChild) return;

    addChildGrowthEntry(activeChild.id, {
      milestone,
      weightKg,
      heightCm,
      muacCm,
      sdRating,
      signs: 'None',
    });

    showToast(`Added growth record entry for ${activeChild.name}`);
  };

  if (!activeChild) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-3">
        <span className="material-symbols-outlined text-[#0051b0] text-4xl">
          child_care
        </span>
        <h2 className="text-lg font-bold text-[#111c2d]">No Registered Child Found</h2>
        <p className="text-xs text-[#6e7978]">
          No newborn record associated with mother {activePatient.name} ({activePatient.id}).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Child Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#bdc9c8]/40 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0051b0]/10 text-[#0051b0] font-black text-2xl flex items-center justify-center shrink-0">
            {activeChild.gender === 'Male' ? '👦' : '👧'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#111c2d]">{activeChild.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0051b0]/10 text-[#0051b0]">
                {activeChild.cwcSerialNo}
              </span>
            </div>
            <p className="text-xs text-[#6e7978] mt-1">
              Mother: <strong className="text-[#005f5e]">{activePatient.name}</strong> • DOB:{' '}
              <strong className="text-[#111c2d]">{activeChild.dob}</strong> • Gender:{' '}
              <strong className="text-[#111c2d]">{activeChild.gender}</strong>
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-xs">
          <div className="bg-[#f0f3ff] p-3 rounded-xl border border-[#bdc9c8]/30 text-center">
            <span className="text-[10px] text-[#6e7978] block">Birth Weight</span>
            <span className="font-bold text-[#0051b0] text-sm">{activeChild.birthWeightKg} kg</span>
          </div>
          <div className="bg-[#f0f3ff] p-3 rounded-xl border border-[#bdc9c8]/30 text-center">
            <span className="text-[10px] text-[#6e7978] block">Sickle Cell Screen</span>
            <span className="font-bold text-[#005f5e] text-sm">{activeChild.sickleCellStatus}</span>
          </div>
        </div>
      </div>

      {/* Grid: Immunizations + Developmental Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Immunizations */}
        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs space-y-3">
          <h2 className="font-bold text-sm text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051b0]">vaccines</span>
            EPI Immunization Status
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">BCG (At Birth)</span>
              <span className="font-bold text-[#005f5e] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Given ({activeChild.immunizations.bcgDate})
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">OPV 0 (At Birth)</span>
              <span className="font-bold text-[#005f5e] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Given ({activeChild.immunizations.opv0Date})
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">Penta 1 + PCV 1 + Rota 1 (6 Wks)</span>
              <span className="font-semibold text-[#0051b0]">Scheduled Next Contact</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs space-y-3">
          <h2 className="font-bold text-sm text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051b0]">extension</span>
            Child Developmental Milestones
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">Smiles Responsively (6 Weeks)</span>
              <span className="font-bold text-[#005f5e]">Achieved ✓</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">Head Control (3 Months)</span>
              <span className="text-[#6e7978]">Pending Assessment</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
              <span className="font-medium text-[#111c2d]">Sits Without Support (6 Months)</span>
              <span className="text-[#6e7978]">Pending Assessment</span>
            </div>
          </div>
        </div>
      </div>

      {/* PNC Child Growth & Nutrition Table */}
      <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#bdc9c8]/30">
          <h2 className="text-base font-bold text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051b0]">show_chart</span>
            PNC Child Growth Monitoring & MUAC
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#bdc9c8]/40 text-xs font-bold text-[#6e7978] bg-[#f8fafc]">
                <th className="py-3 px-3">Contact Milestone</th>
                <th className="py-3 px-3">Weight (kg)</th>
                <th className="py-3 px-3">Length (cm)</th>
                <th className="py-3 px-3">MUAC (cm)</th>
                <th className="py-3 px-3">SD Curve Rating</th>
                <th className="py-3 px-3">Clinical Signs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {activeChild.growthEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-[#f0f3ff]/50">
                  <td className="py-3 px-3 font-bold text-[#111c2d]">{entry.milestone}</td>
                  <td className="py-3 px-3 font-semibold text-[#0051b0]">
                    {entry.weightKg ? `${entry.weightKg} kg` : '-'}
                  </td>
                  <td className="py-3 px-3 text-[#3e4948]">
                    {entry.heightCm ? `${entry.heightCm} cm` : '-'}
                  </td>
                  <td className="py-3 px-3 text-[#3e4948]">
                    {entry.muacCm ? `${entry.muacCm} cm` : '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#abfffc]/40 text-[#005f5e]">
                      {entry.sdRating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#6e7978]">{entry.signs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Growth Entry Form */}
        <form onSubmit={handleAddGrowth} className="mt-4 pt-4 border-t border-[#bdc9c8]/30 space-y-3">
          <h3 className="font-bold text-xs text-[#111c2d]">Log New Growth Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[#6e7978] mb-1">Contact</label>
              <select
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full px-2.5 py-1.5 border rounded-lg"
              >
                <option>6w</option>
                <option>10w</option>
                <option>14w</option>
                <option>6m</option>
              </select>
            </div>
            <div>
              <label className="block text-[#6e7978] mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-[#6e7978] mb-1">Length (cm)</label>
              <input
                type="number"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border rounded-lg font-bold"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-[#0051b0] text-white font-bold text-xs rounded-lg hover:bg-[#0f69dc] cursor-pointer"
              >
                + Save Growth
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
