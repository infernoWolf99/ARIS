import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ANCVisitRecord } from '../../types';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';
import { KhayaVoiceDictationModal } from '../KhayaAI/KhayaVoiceDictationModal';
import { KhayaDictationResult } from '../../types/khaya';

export const ANCVisitsView: React.FC = () => {
  const { activePatient, ancVisits, addANCVisit, showToast } = useApp();

  const [khayaDictationOpen, setKhayaDictationOpen] = useState(false);

  const patientVisits = ancVisits.filter((v) => v.patientId === activePatient.id);
  const nextVisitNumber = patientVisits.length + 1;

  // New Visit Form State
  const [gestationalAge, setGestationalAge] = useState<number>(activePatient.gestationWeeks);
  const [weightKg, setWeightKg] = useState<number>(68.5);
  const [sysBP, setSysBP] = useState<number>(120);
  const [diaBP, setDiaBP] = useState<number>(80);
  const [fundalHeightCm, setFundalHeightCm] = useState<number>(32);
  const [fetalHeartRateBpm, setFetalHeartRateBpm] = useState<number>(142);
  const [presentation, setPresentation] = useState<ANCVisitRecord['presentation']>('Cephalic');
  const [edemaPresent, setEdemaPresent] = useState(false);
  const [pallorChecked, setPallorChecked] = useState(true);
  const [hemoglobin, setHemoglobin] = useState<number>(10.8);
  const [urineProtein, setUrineProtein] = useState('Negative');
  const [urineSugar, setUrineSugar] = useState('Negative');
  const [hivTest, setHivTest] = useState<'NR' | 'R' | 'N/D'>('NR');
  const [syphilisTest, setSyphilisTest] = useState<'NR' | 'R' | 'N/D'>('NR');
  const [hepBTest, setHepBTest] = useState<'NR' | 'R' | 'N/D'>('NR');
  const [iptpMalaria, setIptpMalaria] = useState('Dose 3');
  const [tdVaccine, setTdVaccine] = useState('Dose 3');
  const [itnIssued, setItnIssued] = useState(true);
  const [dewormingGiven, setDewormingGiven] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [nextAppointmentDate, setNextAppointmentDate] = useState('2024-11-28');

  // Selected counseling checkboxes
  const [counseling, setCounseling] = useState<string[]>([
    'Nutrition',
    'Danger Signs',
    'Birth Preparedness',
  ]);

  const toggleCounseling = (topic: string) => {
    setCounseling((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();

    addANCVisit({
      patientId: activePatient.id,
      visitNumber: nextVisitNumber,
      date: new Date().toISOString().split('T')[0],
      gestationalAge,
      weightKg,
      sysBP,
      diaBP,
      fundalHeightCm,
      fetalHeartRateBpm,
      presentation,
      edemaPresent,
      pallorChecked,
      hemoglobin,
      urineProtein,
      urineSugar,
      hivTest,
      syphilisTest,
      hepBTest,
      iptpMalaria,
      tdVaccine,
      itnIssued,
      dewormingGiven,
      counselingTopics: counseling,
      remarks: remarks || `Routine Visit #${nextVisitNumber} completed. Vitals stable.`,
      nextAppointmentDate,
    });

    setRemarks('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Main Layout: Timeline (1 col) + Bento Form (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ANC Visit Timeline */}
        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs h-fit space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#bdc9c8]/30">
            <h2 className="text-sm font-bold text-[#111c2d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005f5e]">event_repeat</span>
              ANC 8-Contact Timeline
            </h2>
            <span className="text-xs font-bold text-[#005f5e] bg-[#abfffc]/30 px-2 py-0.5 rounded-full">
              {patientVisits.length} Completed
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#bdc9c8]/40">
            {Array.from({ length: 8 }, (_, i) => {
              const visitNum = i + 1;
              const logged = patientVisits.find((v) => v.visitNumber === visitNum);
              const isCurrent = visitNum === nextVisitNumber;

              return (
                <div key={visitNum} className="relative">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                      logged
                        ? 'bg-[#005f5e] border-[#005f5e]'
                        : isCurrent
                        ? 'bg-white border-[#005f5e] ring-4 ring-[#abfffc]'
                        : 'bg-white border-[#bdc9c8]'
                    }`}
                  />

                  <div className="text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#111c2d]">
                        Visit {visitNum}{' '}
                        <span className="font-normal text-[#6e7978]">
                          ({12 + i * 4} Wks)
                        </span>
                      </span>
                      {logged ? (
                        <span className="text-[10px] font-bold text-[#005f5e]">
                          {logged.date}
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[10px] font-bold text-[#0051b0] bg-[#edf0ff] px-1.5 py-0.5 rounded">
                          Active Form
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#6e7978]">Upcoming</span>
                      )}
                    </div>

                    {logged && (
                      <div className="mt-1.5 p-2 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-[11px] text-[#3e4948] space-y-0.5">
                        <p>
                          <strong>BP:</strong> {logged.sysBP}/{logged.diaBP} mmHg •{' '}
                          <strong>Hb:</strong> {logged.hemoglobin} g/dL
                        </p>
                        <p className="truncate text-[#6e7978]">{logged.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Routine Visit Bento Form */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={handleSaveVisit} className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#005f5e] text-white p-4 rounded-2xl shadow-xs gap-3">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#abfffc]">edit_note</span>
                  Log ANC Routine Visit #{nextVisitNumber}
                </h2>
                <p className="text-xs text-[#abfffc]/90">
                  Enter maternal biometrics, preventive treatment doses, and lab tests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setKhayaDictationOpen(true)}
                  className="px-3.5 py-1.5 bg-[#abfffc] hover:bg-white text-[#005f5e] font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-white/40"
                  title="Dictate in Dagbani / Twi"
                >
                  <span className="material-symbols-outlined text-base">mic</span>
                  <span>Khaya Voice Dictate</span>
                </button>

                <div className="text-right text-xs hidden sm:block border-l border-white/20 pl-3">
                  <p className="text-[#abfffc]">Today's Date</p>
                  <p className="font-bold text-sm">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Bento Grid Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Vitals */}
              <div className="bg-white p-4 rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-3">
                <h3 className="font-bold text-xs text-[#005f5e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">monitor_heart</span>
                  1. Maternal Vitals & Biometrics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      GA (Weeks)
                    </label>
                    <input
                      type="number"
                      value={gestationalAge}
                      onChange={(e) => setGestationalAge(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Systolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={sysBP}
                      onChange={(e) => setSysBP(Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-bold ${
                        sysBP >= 140
                          ? 'bg-[#fd7a8c]/20 border-[#a5374a] text-[#730f28]'
                          : 'bg-[#f8fafc] border-[#cbd5e1] text-[#111c2d]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Diastolic BP (mmHg)
                    </label>
                    <input
                      type="number"
                      value={diaBP}
                      onChange={(e) => setDiaBP(Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-bold ${
                        diaBP >= 90
                          ? 'bg-[#fd7a8c]/20 border-[#a5374a] text-[#730f28]'
                          : 'bg-[#f8fafc] border-[#cbd5e1] text-[#111c2d]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Fetal & Obstetric Metrics */}
              <div className="bg-white p-4 rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-3">
                <h3 className="font-bold text-xs text-[#005f5e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">pregnant_woman</span>
                  2. Fetal & Obstetric Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Fundal Height (cm)
                    </label>
                    <input
                      type="number"
                      value={fundalHeightCm}
                      onChange={(e) => setFundalHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      FHR (bpm)
                    </label>
                    <input
                      type="number"
                      value={fetalHeartRateBpm}
                      onChange={(e) => setFetalHeartRateBpm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Fetal Presentation
                    </label>
                    <select
                      value={presentation}
                      onChange={(e) =>
                        setPresentation(e.target.value as ANCVisitRecord['presentation'])
                      }
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                    >
                      <option>Cephalic</option>
                      <option>Breech</option>
                      <option>Transverse</option>
                      <option>N/A (&lt; 28wks)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3: Preventive Interventions */}
              <div className="bg-white p-4 rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-3">
                <h3 className="font-bold text-xs text-[#005f5e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">vaccines</span>
                  3. Preventive Prophylaxis & ITN
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      IPTp Malaria SP Dose
                    </label>
                    <select
                      value={iptpMalaria}
                      onChange={(e) => setIptpMalaria(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-bold"
                    >
                      <option>Dose 1</option>
                      <option>Dose 2</option>
                      <option>Dose 3</option>
                      <option>Dose 4</option>
                      <option>Not Given</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Tetanus TD Vaccine
                    </label>
                    <select
                      value={tdVaccine}
                      onChange={(e) => setTdVaccine(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-bold"
                    >
                      <option>Dose 1</option>
                      <option>Dose 2</option>
                      <option>Dose 3</option>
                      <option>Not Due</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex items-center justify-between pt-1">
                    <label className="font-semibold text-[#3e4948]">ITN Net Issued</label>
                    <button
                      type="button"
                      onClick={() => setItnIssued(!itnIssued)}
                      className={`px-3 py-1 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                        itnIssued
                          ? 'bg-[#abfffc] text-[#005f5e]'
                          : 'bg-[#e2e8f0] text-[#6e7978]'
                      }`}
                    >
                      {itnIssued ? 'Issued Yes' : 'Not Issued'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4: Laboratory Screenings */}
              <div className="bg-white p-4 rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-3">
                <h3 className="font-bold text-xs text-[#005f5e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">biotech</span>
                  4. Mandatory Lab Screenings
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Hemoglobin (g/dL)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={hemoglobin}
                      onChange={(e) => setHemoglobin(Number(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg text-sm font-bold ${
                        hemoglobin < 11.0
                          ? 'bg-[#fd7a8c]/20 border-[#a5374a] text-[#730f28]'
                          : 'bg-[#f8fafc] border-[#cbd5e1] text-[#111c2d]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Urine Protein
                    </label>
                    <select
                      value={urineProtein}
                      onChange={(e) => setUrineProtein(e.target.value)}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-bold"
                    >
                      <option>Negative</option>
                      <option>Trace</option>
                      <option>+1 Positive</option>
                      <option>+2 Positive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">HIV Re-Test</label>
                    <select
                      value={hivTest}
                      onChange={(e) => setHivTest(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-bold"
                    >
                      <option value="NR">Non-Reactive (NR)</option>
                      <option value="R">Reactive (R)</option>
                      <option value="N/D">Not Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#3e4948] mb-1">
                      Syphilis / Hep B
                    </label>
                    <select
                      value={syphilisTest}
                      onChange={(e) => setSyphilisTest(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-xs font-bold"
                    >
                      <option value="NR">Non-Reactive (NR)</option>
                      <option value="R">Reactive (R)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Counseling & Clinical Notes */}
            <div className="bg-white p-5 rounded-2xl border border-[#bdc9c8]/40 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-[#005f5e] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">forum</span>
                5. Counseling, Remarks & Next Appointment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#3e4948] mb-2">
                    Topics Counseled Today
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Nutrition', 'Danger Signs', 'Birth Preparedness', 'Exclusive Breastfeeding'].map(
                      (topic) => {
                        const active = counseling.includes(topic);
                        return (
                          <button
                            type="button"
                            key={topic}
                            onClick={() => toggleCounseling(topic)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                              active
                                ? 'bg-[#005f5e] text-white border-[#005f5e]'
                                : 'bg-[#f8fafc] text-[#3e4948] border-[#cbd5e1]'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3e4948] mb-1">
                    Next Scheduled ANC Visit Date
                  </label>
                  <input
                    type="date"
                    value={nextAppointmentDate}
                    onChange={(e) => setNextAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm font-bold text-[#111c2d]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-[#3e4948] mb-1">
                    Clinical Remarks & Action Items
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter midwife notes or instructions for client..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-[#cbd5e1] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#005f5e] text-white font-bold text-sm rounded-xl hover:bg-[#007a78] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">save</span>
                  Save & Log ANC Visit #{nextVisitNumber}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Khaya Voice Dictation Modal */}
      <KhayaVoiceDictationModal
        isOpen={khayaDictationOpen}
        onClose={() => setKhayaDictationOpen(false)}
        defaultLanguage="Dagbani"
        onApplyVitals={(parsedVitals, notes) => {
          if (parsedVitals.sysBP) setSysBP(parsedVitals.sysBP);
          if (parsedVitals.diaBP) setDiaBP(parsedVitals.diaBP);
          if (parsedVitals.weightKg) setWeightKg(parsedVitals.weightKg);
          if (parsedVitals.gestationalAgeWeeks) setGestationalAge(parsedVitals.gestationalAgeWeeks);
          if (parsedVitals.hemoglobin) setHemoglobin(parsedVitals.hemoglobin);
          if (parsedVitals.fundalHeightCm) setFundalHeightCm(parsedVitals.fundalHeightCm);
          if (parsedVitals.fetalHeartRateBpm) setFetalHeartRateBpm(parsedVitals.fetalHeartRateBpm);
          if (notes) setRemarks((prev) => (prev ? `${prev} | ${notes}` : notes));
          showToast('Successfully populated ANC visit form from Khaya AI voice dictation!');
        }}
      />
    </div>
  );
};
