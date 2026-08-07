import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';

export const ObstetricHistoryView: React.FC = () => {
  const { activePatient, patients, setActivePatient, updatePatient, showToast } = useApp();

  const [priorPregnancies, setPriorPregnancies] = useState([
    {
      id: 'p-1',
      year: '2021',
      outcome: 'Live Birth (Single)',
      ga: '38 Wks',
      mode: 'Caesarean Section (CS)',
      sex: 'Male',
      weight: '3.4 kg',
      complications: 'Fetal Distress',
      facility: 'Korle-Bu Teaching Hospital',
    },
    {
      id: 'p-2',
      year: '2019',
      outcome: 'Live Birth (Single)',
      ga: '39 Wks',
      mode: 'SVD (Vaginal)',
      sex: 'Female',
      weight: '3.1 kg',
      complications: 'None',
      facility: 'Accra Polyclinic',
    },
    {
      id: 'p-3',
      year: '2020',
      outcome: 'Spontaneous Abortion',
      ga: '10 Wks',
      mode: 'Evacuation (MVA)',
      sex: '-',
      weight: '-',
      complications: 'Heavy Bleeding',
      facility: 'Accra Polyclinic',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newYear, setNewYear] = useState('2018');
  const [newOutcome, setNewOutcome] = useState('Live Birth (Single)');
  const [newMode, setNewMode] = useState('SVD (Vaginal)');
  const [newComplications, setNewComplications] = useState('None');

  const handleAddPrior = (e: React.FormEvent) => {
    e.preventDefault();
    setPriorPregnancies([
      ...priorPregnancies,
      {
        id: `p-${Date.now()}`,
        year: newYear,
        outcome: newOutcome,
        ga: '39 Wks',
        mode: newMode,
        sex: 'Female',
        weight: '3.2 kg',
        complications: newComplications,
        facility: 'Accra Polyclinic',
      },
    ]);
    setShowAddModal(false);
    showToast('Prior pregnancy history logged');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Baseline Obstetric Formula Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/30 shadow-xs text-center">
          <p className="text-[10px] font-bold text-[#6e7978] uppercase">Gravida (G)</p>
          <p className="text-2xl font-black text-[#005f5e] mt-0.5">{activePatient.gravida}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/30 shadow-xs text-center">
          <p className="text-[10px] font-bold text-[#6e7978] uppercase">Para (P)</p>
          <p className="text-2xl font-black text-[#111c2d] mt-0.5">{activePatient.para}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/30 shadow-xs text-center">
          <p className="text-[10px] font-bold text-[#6e7978] uppercase">Abortions (A)</p>
          <p className="text-2xl font-black text-[#a5374a] mt-0.5">{activePatient.abortions}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/30 shadow-xs text-center">
          <p className="text-[10px] font-bold text-[#6e7978] uppercase">Living (L)</p>
          <p className="text-2xl font-black text-[#0051b0] mt-0.5">{activePatient.livingChildren}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/30 shadow-xs text-center col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-[#6e7978] uppercase">Blood Group</p>
          <p className="text-lg font-black text-[#007a78] mt-1">{activePatient.bloodGroup}</p>
        </div>
      </div>

      {/* Prior Pregnancy History Table */}
      <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e] text-2xl">
              history_edu
            </span>
            <h2 className="text-base font-bold text-[#111c2d]">
              Past Pregnancy Outcomes & Obstetric History
            </h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Log Past Outcome
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#bdc9c8]/40 text-xs font-bold text-[#6e7978] bg-[#f8fafc]">
                <th className="py-3 px-3">Year</th>
                <th className="py-3 px-3">Pregnancy Outcome</th>
                <th className="py-3 px-3">GA at Birth</th>
                <th className="py-3 px-3">Mode of Delivery</th>
                <th className="py-3 px-3">Birth Weight</th>
                <th className="py-3 px-3">Complications Noted</th>
                <th className="py-3 px-3">Facility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {priorPregnancies.map((item) => (
                <tr key={item.id} className="hover:bg-[#f0f3ff]/50">
                  <td className="py-3 px-3 font-bold text-[#111c2d]">{item.year}</td>
                  <td className="py-3 px-3 font-medium text-[#3e4948]">{item.outcome}</td>
                  <td className="py-3 px-3 text-[#3e4948]">{item.ga}</td>
                  <td className="py-3 px-3 font-semibold text-[#005f5e]">{item.mode}</td>
                  <td className="py-3 px-3 text-[#111c2d]">{item.weight}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.complications !== 'None'
                          ? 'bg-[#fd7a8c]/20 text-[#730f28]'
                          : 'bg-[#abfffc]/30 text-[#005f5e]'
                      }`}
                    >
                      {item.complications}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-[#6e7978]">{item.facility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Risk Summary & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a5374a]">medical_services</span>
            Identified Risk Factors for Current Pregnancy
          </h3>
          {activePatient.riskFactors.length > 0 ? (
            <div className="space-y-2">
              {activePatient.riskFactors.map((rf) => (
                <div
                  key={rf.id}
                  className="p-3 bg-[#fd7a8c]/10 border border-[#fd7a8c]/30 rounded-xl flex items-start gap-2 text-xs"
                >
                  <span className="material-symbols-outlined text-[#a5374a] text-base shrink-0">
                    warning
                  </span>
                  <div>
                    <p className="font-bold text-[#730f28]">{rf.name}</p>
                    <p className="text-[#3e4948] mt-0.5">{rf.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6e7978]">No critical high-risk factors flagged.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#111c2d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e]">notes</span>
            Surgical & Clinical Baseline Notes
          </h3>
          <p className="text-xs text-[#3e4948] leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-[#e2e8f0]">
            {activePatient.surgicalNotes || 'No prior surgical complications recorded.'}
          </p>
          <div className="text-xs text-[#6e7978]">
            Infant Feeding Intention:{' '}
            <strong className="text-[#005f5e]">
              {activePatient.infantFeedingIntention || 'Exclusive Breastfeeding'}
            </strong>
          </div>
        </div>
      </div>

      {/* Modal for adding prior pregnancy */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#bdc9c8]/40 z-10">
            <h3 className="font-bold text-base text-[#111c2d] mb-4">Log Past Pregnancy Outcome</h3>
            <form onSubmit={handleAddPrior} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Year of Delivery</label>
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Outcome</label>
                <select
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>Live Birth (Single)</option>
                  <option>Live Birth (Twins)</option>
                  <option>Stillbirth</option>
                  <option>Spontaneous Abortion</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Mode of Delivery</label>
                <select
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option>SVD (Vaginal)</option>
                  <option>Caesarean Section (CS)</option>
                  <option>Assisted Delivery</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Complications</label>
                <input
                  type="text"
                  value={newComplications}
                  onChange={(e) => setNewComplications(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-[#3e4948]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#005f5e] text-white rounded-lg font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
