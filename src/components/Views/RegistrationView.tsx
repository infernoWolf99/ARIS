import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RiskFactor } from '../../types';

export const RegistrationView: React.FC = () => {
  const { addPatient, setActiveView, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [serialNo, setSerialNo] = useState(`SN-2024-${Math.floor(100 + Math.random() * 900)}`);
  const [regNo, setRegNo] = useState(`REG-${Math.floor(1000 + Math.random() * 9000)}`);
  const [nhisNo, setNhisNo] = useState('');
  const [gestationWeeks, setGestationWeeks] = useState<number>(14);
  const [edd, setEdd] = useState('2025-03-15');
  const [gravida, setGravida] = useState<number>(2);
  const [para, setPara] = useState<number>(1);
  const [abortions, setAbortions] = useState<number>(0);
  const [livingChildren, setLivingChildren] = useState<number>(1);
  const [bloodGroup, setBloodGroup] = useState('O Positive');
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [surgicalNotes, setSurgicalNotes] = useState('');
  const [infantFeedingIntention, setInfantFeedingIntention] = useState('Exclusive Breastfeeding');

  // Risk Factors selection
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);

  const availableRisksList = [
    { name: 'Severe Anemia', detail: 'Hb < 8.0 g/dL' },
    { name: 'High BP / Preeclampsia Risk', detail: 'Systolic > 140 or Diastolic > 90' },
    { name: 'Previous C-Section', detail: 'History of Caesarean delivery' },
    { name: 'Gestational Diabetes', detail: 'Elevated fasting blood sugar' },
    { name: 'Grand Multipara', detail: 'Para 5 or above' },
  ];

  const toggleRisk = (riskName: string) => {
    setSelectedRisks((prev) =>
      prev.includes(riskName)
        ? prev.filter((r) => r !== riskName)
        : [...prev, riskName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter the mother\'s full name');
      return;
    }

    const riskFactorsList: RiskFactor[] = selectedRisks.map((r, index) => ({
      id: `rf-new-${index}`,
      name: r,
      detail: availableRisksList.find((item) => item.name === r)?.detail || 'Noted at intake',
      severity: r.includes('Severe') || r.includes('C-Section') ? 'high' : 'medium',
    }));

    const riskStatus = riskFactorsList.length > 0 ? 'High Risk' : 'Normal';

    addPatient({
      serialNo,
      regNo,
      nhisNo: nhisNo || '9900112233',
      name,
      age,
      gestationWeeks,
      edd,
      gravida,
      para,
      abortions,
      livingChildren,
      bloodGroup,
      riskStatus,
      riskFactors: riskFactorsList,
      partnerName,
      partnerPhone,
      emergencyContact,
      surgicalNotes,
      infantFeedingIntention,
      currentStage: 'ANC',
    });

    setActiveView('anc');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-black text-[#111c2d] tracking-tight">
          Client Intake Registration
        </h1>
        <p className="text-xs sm:text-sm text-[#3e4948]">
          Complete initial booking and obstetric baseline assessment for pregnant women.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="bg-white p-4 rounded-xl border border-[#bdc9c8]/40 shadow-xs flex items-center justify-between text-xs font-semibold overflow-x-auto">
        <div
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 1 ? 'text-[#005f5e]' : 'text-[#6e7978]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 1 ? 'bg-[#005f5e] text-white' : 'bg-[#e2e8f0] text-[#6e7978]'
            }`}
          >
            1
          </span>
          <span>1. Bio & Demographics</span>
        </div>
        <span className="text-[#bdc9c8]">&gt;</span>

        <div
          onClick={() => setCurrentStep(2)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 2 ? 'text-[#005f5e]' : 'text-[#6e7978]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 2 ? 'bg-[#005f5e] text-white' : 'bg-[#e2e8f0] text-[#6e7978]'
            }`}
          >
            2
          </span>
          <span>2. NHIS & Codes</span>
        </div>
        <span className="text-[#bdc9c8]">&gt;</span>

        <div
          onClick={() => setCurrentStep(3)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 3 ? 'text-[#005f5e]' : 'text-[#6e7978]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 3 ? 'bg-[#005f5e] text-white' : 'bg-[#e2e8f0] text-[#6e7978]'
            }`}
          >
            3
          </span>
          <span>3. Partner & Family</span>
        </div>
        <span className="text-[#bdc9c8]">&gt;</span>

        <div
          onClick={() => setCurrentStep(4)}
          className={`flex items-center gap-2 cursor-pointer transition-colors ${
            currentStep === 4 ? 'text-[#005f5e]' : 'text-[#6e7978]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 4 ? 'bg-[#005f5e] text-white' : 'bg-[#e2e8f0] text-[#6e7978]'
            }`}
          >
            4
          </span>
          <span>4. Clinical Triage</span>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs space-y-6">
        {/* Step 1: Bio */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-[#111c2d] border-b pb-2 border-[#bdc9c8]/30">
              Primary Client Bio & Demographics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ama Serwaa Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  min={14}
                  max={55}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Blood Group & Rh Factor
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                >
                  <option>O Positive</option>
                  <option>A Positive</option>
                  <option>B Positive</option>
                  <option>AB Positive</option>
                  <option>O Negative</option>
                  <option>A Negative</option>
                  <option>B Negative</option>
                  <option>AB Negative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Gestational Age at Booking (Weeks)
                </label>
                <input
                  type="number"
                  min={4}
                  max={42}
                  value={gestationWeeks}
                  onChange={(e) => setGestationWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Estimated Date of Delivery (EDD)
                </label>
                <input
                  type="date"
                  value={edd}
                  onChange={(e) => setEdd(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Infant Feeding Intention
                </label>
                <select
                  value={infantFeedingIntention}
                  onChange={(e) => setInfantFeedingIntention(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                >
                  <option>Exclusive Breastfeeding</option>
                  <option>Replacement Feeding</option>
                  <option>Mixed Feeding</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: NHIS & Identification */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-[#111c2d] border-b pb-2 border-[#bdc9c8]/30">
              NHIS Identification & Facility Codes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Register Number
                </label>
                <input
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  NHIS Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 984521034"
                  value={nhisNo}
                  onChange={(e) => setNhisNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Partner & Emergency */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-[#111c2d] border-b pb-2 border-[#bdc9c8]/30">
              Partner & Emergency Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Partner / Husband Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kojo Mensah"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Partner Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+233 24 111 2222"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Emergency Contact & Next of Kin
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sister: Esi Mensah (+233 55 999 0000)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Clinical Triage & Obstetric Formula */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-[#111c2d] border-b pb-2 border-[#bdc9c8]/30">
              Obstetric Formula & Risk Triage
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">Gravida</label>
                <input
                  type="number"
                  min={1}
                  value={gravida}
                  onChange={(e) => setGravida(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">Para</label>
                <input
                  type="number"
                  min={0}
                  value={para}
                  onChange={(e) => setPara(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">Abortions</label>
                <input
                  type="number"
                  min={0}
                  value={abortions}
                  onChange={(e) => setAbortions(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                  Living Children
                </label>
                <input
                  type="number"
                  min={0}
                  value={livingChildren}
                  onChange={(e) => setLivingChildren(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-2">
                Flag High Risk Factors
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableRisksList.map((risk) => {
                  const isChecked = selectedRisks.includes(risk.name);
                  return (
                    <button
                      type="button"
                      key={risk.name}
                      onClick={() => toggleRisk(risk.name)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#a5374a]/10 border-[#a5374a] text-[#730f28]'
                          : 'bg-[#f8fafc] border-[#cbd5e1] text-[#3e4948]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs">
                        <span className="material-symbols-outlined text-sm">
                          {isChecked ? 'check_box' : 'square'}
                        </span>
                        {risk.name}
                      </div>
                      <div className="text-[10px] text-[#6e7978] mt-0.5 pl-6">{risk.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                Surgical & Medical History Notes
              </label>
              <textarea
                rows={3}
                placeholder="Prior surgeries, allergies, chronic conditions..."
                value={surgicalNotes}
                onChange={(e) => setSurgicalNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-[#bdc9c8]/30">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 border border-[#bdc9c8] text-xs font-semibold rounded-lg text-[#3e4948] hover:bg-[#f0f3ff] transition-colors cursor-pointer"
            >
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="px-5 py-2 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs cursor-pointer"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#005f5e] text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
              Finalize Client Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
