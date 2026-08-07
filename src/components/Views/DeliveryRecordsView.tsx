import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientHeaderBanner } from '../Navigation/PatientHeaderBanner';

export const DeliveryRecordsView: React.FC = () => {
  const { activePatient, deliveryRecords, addDeliveryRecord, updatePatient, showToast } = useApp();

  const patientDeliveries = deliveryRecords.filter((d) => d.patientId === activePatient.id);

  // Form fields
  const [dateOfDelivery, setDateOfDelivery] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [timeOfDelivery, setTimeOfDelivery] = useState('14:30');
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState(activePatient.gestationWeeks || 39);
  const [attendantName, setAttendantName] = useState('Dr. Kwame Ofori');
  const [deliveryType, setDeliveryType] = useState<'Single' | 'Multiple'>('Single');
  const [modeOfDelivery, setModeOfDelivery] = useState<
    'SVD (Vaginal)' | 'Caesarean Section (CS)' | 'Assisted (Vacuum/Forceps)'
  >('SVD (Vaginal)');
  const [selectedComplications, setSelectedComplications] = useState<string[]>([]);
  const [otherComplications, setOtherComplications] = useState('');
  const [maternalStatus, setMaternalStatus] = useState<
    'Alive & Discharged' | 'Referred to Higher Level' | 'Deceased'
  >('Alive & Discharged');
  const [facilityDeliveredAt, setFacilityDeliveredAt] = useState('Accra Polyclinic Maternity Ward');

  const possibleComplications = [
    'Postpartum Haemorrhage (PPH)',
    '3rd/4th Degree Perineal Tear',
    'Eclampsia / Severe Preeclampsia',
    'Fetal Distress',
    'Retained Placenta',
    'Uterine Rupture',
  ];

  const toggleComplication = (comp: string) => {
    setSelectedComplications((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();

    addDeliveryRecord({
      patientId: activePatient.id,
      dateOfDelivery,
      timeOfDelivery,
      gestationalAgeWeeks,
      attendantName,
      deliveryType,
      modeOfDelivery,
      complications: selectedComplications,
      otherComplications,
      maternalStatus,
      facilityDeliveredAt,
    });

    // Advance patient currentStage to PNC
    updatePatient({
      ...activePatient,
      currentStage: 'PNC',
    });

    showToast(`Delivery recorded. Mother ${activePatient.name} moved to PNC Care stage.`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Patient Header Banner */}
      <PatientHeaderBanner />

      {/* Main Delivery Form Card */}
      <form onSubmit={handleSaveDelivery} className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0051b0] text-2xl">
              child_care
            </span>
            <h2 className="text-base font-bold text-[#111c2d]">
              Intrapartum Delivery Summary
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#6e7978]">
            Form ID: DEL-{Math.floor(1000 + Math.random() * 9000)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">Date of Delivery</label>
            <input
              type="date"
              required
              value={dateOfDelivery}
              onChange={(e) => setDateOfDelivery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">Time of Delivery</label>
            <input
              type="time"
              required
              value={timeOfDelivery}
              onChange={(e) => setTimeOfDelivery(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">
              GA at Delivery (Weeks)
            </label>
            <input
              type="number"
              value={gestationalAgeWeeks}
              onChange={(e) => setGestationalAgeWeeks(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">Attendant Name / Title</label>
            <input
              type="text"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">Delivery Type</label>
            <select
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            >
              <option value="Single">Single Birth</option>
              <option value="Multiple">Multiple Birth (Twins/Triplets)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">Mode of Delivery</label>
            <select
              value={modeOfDelivery}
              onChange={(e) => setModeOfDelivery(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#005f5e]"
            >
              <option value="SVD (Vaginal)">SVD (Spontaneous Vaginal Delivery)</option>
              <option value="Caesarean Section (CS)">Caesarean Section (CS)</option>
              <option value="Assisted (Vacuum/Forceps)">Assisted (Vacuum / Forceps)</option>
            </select>
          </div>
        </div>

        {/* Complications Checklist */}
        <div>
          <label className="block text-xs font-semibold text-[#3e4948] mb-2">
            Intrapartum Complications Noted
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {possibleComplications.map((comp) => {
              const active = selectedComplications.includes(comp);
              return (
                <button
                  type="button"
                  key={comp}
                  onClick={() => toggleComplication(comp)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#a5374a]/10 border-[#a5374a] text-[#730f28]'
                      : 'bg-[#f8fafc] border-[#cbd5e1] text-[#3e4948]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      {active ? 'check_box' : 'square'}
                    </span>
                    {comp}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status & Facility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">
              Maternal Status at Discharge
            </label>
            <select
              value={maternalStatus}
              onChange={(e) => setMaternalStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            >
              <option value="Alive & Discharged">Alive & Discharged</option>
              <option value="Referred to Higher Level">Referred to Higher Level Facility</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#3e4948] mb-1">
              Facility Delivered At
            </label>
            <input
              type="text"
              value={facilityDeliveredAt}
              onChange={(e) => setFacilityDeliveredAt(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#111c2d]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#bdc9c8]/30">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0051b0] text-white font-bold text-sm rounded-xl hover:bg-[#0f69dc] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Finalize & Save Delivery Record
          </button>
        </div>
      </form>

      {/* Saved Delivery History List */}
      {patientDeliveries.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-[#111c2d]">Recorded Deliveries for Patient</h3>
          <div className="space-y-3">
            {patientDeliveries.map((del) => (
              <div
                key={del.id}
                className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs space-y-1"
              >
                <div className="flex justify-between items-center font-bold text-[#111c2d]">
                  <span>
                    Delivered on {del.dateOfDelivery} at {del.timeOfDelivery}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#0051b0]/10 text-[#0051b0]">
                    {del.modeOfDelivery}
                  </span>
                </div>
                <p className="text-[#3e4948]">
                  <strong>Attendant:</strong> {del.attendantName} • <strong>Facility:</strong>{' '}
                  {del.facilityDeliveredAt}
                </p>
                <p className="text-[#6e7978]">
                  <strong>Complications:</strong>{' '}
                  {del.complications.length > 0 ? del.complications.join(', ') : 'None'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
