import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, availableFacilitiesList, facility } = useApp();

  const [username, setUsername] = useState('ama.jumah');
  const [pin, setPin] = useState('1234');
  const [selectedFacility, setSelectedFacility] = useState(facility.name || availableFacilitiesList[0]);
  const [selectedRole, setSelectedRole] = useState('Senior Midwife');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login(username, pin, selectedFacility, selectedRole);
      setIsSubmitting(false);
    }, 600);
  };

  const handleQuickLogin = (demoName: string, demoRole: string, defaultFacility?: string) => {
    setUsername(demoName);
    setPin('1234');
    setSelectedRole(demoRole);
    if (defaultFacility) {
      setSelectedFacility(defaultFacility);
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login(demoName, '1234', defaultFacility || selectedFacility, demoRole);
      setIsSubmitting(false);
    }, 500);
  };

  const playVoiceGuidance = () => {
    if ('speechSynthesis' in window) {
      setAudioPlaying(true);
      window.speechSynthesis.cancel();
      const text = `Welcome to the Ghana Health Service Antenatal Records & Information System. Please select your facility, enter your GHS Staff PIN, and sign in. Desi shɛli ni, Dagbani mini Twi maŋmaŋa ni tum tuma.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setAudioPlaying(false);
      utterance.onerror = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech voice guidance is active in Khaya AI module.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-inter selection:bg-[#007a78] selection:text-white">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#005f5e]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#0f69dc]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Government & Ministry Header */}
      <header className="w-full border-b border-slate-800 bg-slate-950/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007a78] to-[#004f4e] flex items-center justify-center text-white font-bold shadow-md border border-[#abfffc]/30">
            <span className="material-symbols-outlined text-xl">medical_services</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-white uppercase">ARIS GHS Platform</h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#007a78]/30 text-[#abfffc] px-2 py-0.5 rounded-md border border-[#007a78]/50">
                Republic of Ghana
              </span>
            </div>
            <p className="text-xs text-slate-400">Ghana Health Service • Maternal & Child Health Unit</p>
          </div>
        </div>

        {/* Khaya Local Speech Prompt Button */}
        <button
          type="button"
          onClick={playVoiceGuidance}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            audioPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
          title="Play Local Language Audio Voice Guidance (Dagbani/Twi/English)"
        >
          <span className="material-symbols-outlined text-base">
            {audioPlaying ? 'volume_up' : 'record_voice_over'}
          </span>
          <span className="hidden sm:inline">Khaya Voice Assist</span>
        </button>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Left Column: Platform Branding & Mission */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#004f4e] via-[#003837] to-slate-950 p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[160px] text-white">pregnant_woman</span>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#abfffc] text-xs font-semibold backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#00ffc2] animate-ping" />
                Live Health Network • V2.4
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Antenatal Records & Information System
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Centralized electronic maternal health registry empowering midwives across Tamale, Accra, Kumasi, and regional health centers.
                </p>
              </div>

              {/* Core Features Bullets */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-[#007a78] text-white mt-0.5">
                    <span className="material-symbols-outlined text-sm">translate</span>
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Khaya AI Local Language Engine</strong>
                    <span>Voice dictation & audio alerts in Dagbani, Twi, Ewe, and Ga.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-amber-600 text-white mt-0.5">
                    <span className="material-symbols-outlined text-sm">warning</span>
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">High-Risk Stratification</strong>
                    <span>Automated alerts for Preeclampsia, Anemia, and obstructed labor risks.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate-200">
                  <div className="p-1 rounded-md bg-blue-600 text-white mt-0.5">
                    <span className="material-symbols-outlined text-sm">child_care</span>
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Continuity of Care Tracking</strong>
                    <span>Seamless transition from ANC visits to Delivery, PNC, and CWC.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Support Callout */}
            <div className="pt-8 border-t border-white/10 mt-8 relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>GHS Health IT Desk: +233 30 268 0111</span>
              <span className="text-[#abfffc]">GHS Security Standard</span>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Clinician Access Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your GHS Staff PIN or NHIS Practitioner ID to access patient records.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Facility Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Assigned GHS Facility Station</span>
                  <span className="text-[10px] text-[#abfffc]">Active Workstation</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    domain
                  </span>
                  <select
                    value={selectedFacility}
                    onChange={(e) => setSelectedFacility(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#007a78] focus:ring-1 focus:ring-[#007a78] transition-all cursor-pointer"
                  >
                    {availableFacilitiesList.map((fac) => (
                      <option key={fac} value={fac}>
                        {fac}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Quick Switcher Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Practitioner Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Senior Midwife', icon: 'badge' },
                    { label: 'Obstetrician', icon: 'medical_services' },
                    { label: 'CHO Field Officer', icon: 'distance' },
                    { label: 'Data Clerk', icon: 'edit_note' },
                  ].map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => setSelectedRole(r.label)}
                      className={`p-2 rounded-xl text-[11px] font-medium flex flex-col items-center justify-center gap-1 border transition-all ${
                        selectedRole === r.label
                          ? 'bg-[#007a78]/20 border-[#007a78] text-[#abfffc] font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{r.icon}</span>
                      <span className="text-[10px] text-center line-clamp-1">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Username / Staff ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GHS Staff Username / Practitioner ID
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ama.jumah or GHS-MW-8091"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#007a78] focus:ring-1 focus:ring-[#007a78] transition-all"
                  />
                </div>
              </div>

              {/* Password / Security PIN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Security PIN / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] text-[#abfffc] hover:underline"
                  >
                    Reset Security Access?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#007a78] focus:ring-1 focus:ring-[#007a78] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#007a78] hover:bg-[#005f5e] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating GHS Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to ARIS Platform</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Cards */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-amber-400">bolt</span>
                  <span>Clinical Demo Accounts (Instant Fill):</span>
                </span>
                <span className="text-[10px] text-slate-500">GHS Tamale / Accra</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('Ama Jumah', 'Senior Midwife', 'Accra Polyclinic Maternity Ward')}
                  className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-[#abfffc]">Ama Jumah</div>
                  <div className="text-[10px] text-slate-400">Senior Midwife • Accra Poly</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('Dr. Kwame Baah', 'Obstetrician', 'Ridge Regional Hospital')}
                  className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-[#abfffc]">Dr. Kwame Baah</div>
                  <div className="text-[10px] text-slate-400">Obstetrician • Ridge Hosp</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Network Security Badge */}
      <footer className="w-full py-3 px-6 border-t border-slate-800/80 bg-slate-950/80 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>GHS Central Health Network (HIPAA / Ghana Data Protection Act 2012)</span>
        </div>
        <div>
          <span>ARIS ANC System V2.4 • Powered by Khaya AI Voice Core</span>
        </div>
      </footer>

      {/* Reset PIN Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">help</span>
                <span>Reset GHS Security Access</span>
              </h4>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you have lost your clinician security PIN or password, please contact your District Health Information Officer (DHIO) or call the GHS Health IT Support Line.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div><strong>Region:</strong> Greater Accra & Northern Region</div>
              <div><strong>DHIO Hot Desk:</strong> +233 30 268 0111 / +233 24 100 0202</div>
              <div><strong>Emergency Override:</strong> Available for On-Duty Ward Charge</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-[#007a78] text-white text-xs font-semibold rounded-lg hover:bg-[#005f5e]"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
