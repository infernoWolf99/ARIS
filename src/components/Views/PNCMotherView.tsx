import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';

export const PNCMotherView: React.FC = () => {
  const { activePatient, pncVisits, addPNCVisit, showToast } = useApp();

  const [timingCategory, setTimingCategory] = useState<'24-48 Hours' | '6-7 Days' | '6 Weeks'>(
    '24-48 Hours'
  );

  // PNC Form State
  const [sysBP, setSysBP] = useState<number>(118);
  const [diaBP, setDiaBP] = useState<number>(78);
  const [temperatureC, setTemperatureC] = useState<number>(36.8);
  const [fundalHeightStatus, setFundalHeightStatus] = useState('Well contracted, below umbilicus');
  const [breastCondition, setBreastCondition] = useState('Soft, lactating normally, no cracks');
  const [lochia, setLochia] = useState('Rubra, normal quantity, no foul odor');
  const [woundCondition, setWoundCondition] = useState('Intact, clean, healing well');
  const [depressionScreening, setDepressionScreening] = useState<
    'Normal, no concerns' | 'Signs of Baby Blues' | 'Risk of PPD (Referral Needed)'
  >('Normal, no concerns');
  const [postnatalHb, setPostnatalHb] = useState<number>(11.5);
  const [hivRetesting, setHivRetesting] = useState('Non-Reactive (NR)');
  const [familyPlanningCounseling, setFamilyPlanningCounseling] = useState(
    'Counseling Provided & Method Accepted'
  );
  const [acceptedMethodName, setAcceptedMethodName] = useState('Implanon NXT');

  const existingVisitForTab = pncVisits.find(
    (v) => v.patientId === activePatient.id && v.timingCategory === timingCategory
  );

  const handleSavePNC = (e: React.FormEvent) => {
    e.preventDefault();

    addPNCVisit({
      patientId: activePatient.id,
      timingCategory,
      sysBP,
      diaBP,
      temperatureC,
      fundalHeightStatus,
      breastCondition,
      lochia,
      woundCondition,
      depressionScreening,
      postnatalHb,
      hivRetesting,
      familyPlanningCounseling,
      acceptedMethodName,
    });

    showToast(`Saved PNC ${timingCategory} visit for ${activePatient.name}`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Timing Tabs */}
      <div className="flex gap-2 border-b border-[#bdc9c8]/40 pb-2">
        {(['24-48 Hours', '6-7 Days', '6 Weeks'] as const).map((tab) => {
          const isActive = timingCategory === tab;
          const isDone = pncVisits.some(
            (v) => v.patientId === activePatient.id && v.timingCategory === tab
          );

          return (
            <button
              key={tab}
              onClick={() => setTimingCategory(tab)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#a5374a] text-white shadow-xs'
                  : 'bg-white text-[#3e4948] hover:bg-[#f0f3ff] border border-[#bdc9c8]/30'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isDone ? 'check_circle' : 'schedule'}
              </span>
              PNC Contact: {tab}
              {isDone && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Saved</span>}
            </button>
          );
        })}
      </div>

      {/* PNC Form Card */}
      <form onSubmit={handleSavePNC} className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a5374a] text-2xl">
              female
            </span>
            <h2 className="text-base font-bold text-[#111c2d]">
              Maternal Examination ({timingCategory})
            </h2>
          </div>
          {existingVisitForTab && (
            <span className="text-xs font-bold text-[#005f5e] bg-[#abfffc]/40 px-2.5 py-1 rounded-full">
              Record Existing
            </span>
          )}
        </div>

        {/* Section 1: Vitals */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#a5374a] uppercase tracking-wider">
            1. Vitals & Physical Signs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Systolic BP (mmHg)</label>
              <input
                type="number"
                value={sysBP}
                onChange={(e) => setSysBP(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Diastolic BP (mmHg)</label>
              <input
                type="number"
                value={diaBP}
                onChange={(e) => setDiaBP(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Exams */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#a5374a] uppercase tracking-wider">
            2. Reproductive & Systemic Examinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Involution of Uterus</label>
              <input
                type="text"
                value={fundalHeightStatus}
                onChange={(e) => setFundalHeightStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Breast & Nipple Condition</label>
              <input
                type="text"
                value={breastCondition}
                onChange={(e) => setBreastCondition(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Lochia Character</label>
              <input
                type="text"
                value={lochia}
                onChange={(e) => setLochia(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Perineal Wound / CS Scar</label>
              <input
                type="text"
                value={woundCondition}
                onChange={(e) => setWoundCondition(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-[#111c2d]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Postnatal Screening & Mental Health */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs text-[#a5374a] uppercase tracking-wider">
            3. Mental Health & Lab Checks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">PPD Mental Health Screening</label>
              <select
                value={depressionScreening}
                onChange={(e) => setDepressionScreening(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              >
                <option value="Normal, no concerns">Normal, no concerns</option>
                <option value="Signs of Baby Blues">Signs of Baby Blues</option>
                <option value="Risk of PPD (Referral Needed)">Risk of PPD (Referral Needed)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Postnatal Hb (g/dL)</label>
              <input
                type="number"
                step="0.1"
                value={postnatalHb}
                onChange={(e) => setPostnatalHb(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Postnatal HIV Status</label>
              <input
                type="text"
                value={hivRetesting}
                onChange={(e) => setHivRetesting(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Family Planning */}
        <div className="space-y-3 pt-2 border-t border-[#bdc9c8]/30">
          <h3 className="font-bold text-xs text-[#a5374a] uppercase tracking-wider">
            4. Postpartum Family Planning (PPFP)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Counseling Status</label>
              <select
                value={familyPlanningCounseling}
                onChange={(e) => setFamilyPlanningCounseling(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-[#111c2d]"
              >
                <option>Counseling Provided & Method Accepted</option>
                <option>Counseling Provided & Undecided</option>
                <option>Declined Counseling</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#3e4948] mb-1">Accepted Method</label>
              <select
                value={acceptedMethodName}
                onChange={(e) => setAcceptedMethodName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#005f5e]"
              >
                <option>Implanon NXT</option>
                <option>Jadelle</option>
                <option>Depo-Provera (Injectable)</option>
                <option>Postpartum IUD</option>
                <option>Progestin-Only Pills (POP)</option>
                <option>Lactational Amenorrhea (LAM)</option>
                <option>Male / Female Condoms</option>
                <option>Bilateral Tubal Ligation (BTL)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#bdc9c8]/30">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#a5374a] text-white font-bold text-sm rounded-xl hover:bg-[#730f28] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Save PNC {timingCategory} Visit
          </button>
        </div>
      </form>
    </div>
  );
};
