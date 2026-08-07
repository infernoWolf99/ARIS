import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GhanaianLanguage, KhayaAlertResult } from '../../types/khaya';

interface KhayaPatientAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLanguage?: GhanaianLanguage;
}

export const KhayaPatientAlertModal: React.FC<KhayaPatientAlertModalProps> = ({
  isOpen,
  onClose,
  defaultLanguage = 'Dagbani',
}) => {
  const { activePatient, showToast } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<GhanaianLanguage>(defaultLanguage);
  const [alertType, setAlertType] = useState<'High Risk Emergency' | 'ANC Appointment Reminder' | 'Birth Preparedness Plan'>('High Risk Emergency');
  const [isLoading, setIsLoading] = useState(false);
  const [alertData, setAlertData] = useState<KhayaAlertResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (isOpen && activePatient) {
      generateAlert();
    }
  }, [isOpen, activePatient, selectedLanguage, alertType]);

  if (!isOpen) return null;

  const generateAlert = async () => {
    setIsLoading(true);
    setAlertData(null);

    try {
      const response = await fetch('/api/khaya/patient-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: activePatient.name,
          gestationWeeks: activePatient.gestationWeeks,
          edd: activePatient.edd,
          riskStatus: activePatient.riskStatus,
          riskFactors: activePatient.riskFactors.map((r) => r.name),
          language: selectedLanguage,
          alertType,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setAlertData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!alertData) return;
    setIsPlayingAudio(true);

    try {
      // First try Gemini TTS endpoint
      const response = await fetch('/api/khaya/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: alertData.nativeText,
          voiceName: 'Kore',
        }),
      });

      const res = await response.json();

      if (res.success && res.audioBase64) {
        // Play PCM audio or base64 audio
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });

        const binary = atob(res.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        // 16-bit PCM buffer to Float32
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0;
        }

        const buffer = audioCtx.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);

        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.onended = () => setIsPlayingAudio(false);
        source.start();
        return;
      }
    } catch {
      // Fallback to browser SpeechSynthesis
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(alertData.phoneticScript || alertData.nativeText);
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleSendSMS = () => {
    showToast(`Dispatched Khaya AI Localized SMS to ${activePatient.name}'s phone (${activePatient.emergencyContact || 'Ghana Mobile Number'})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#bdc9c8]/50 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#bdc9c8]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a5374a] to-[#d32f2f] text-white flex items-center justify-center font-black text-xl shadow-xs">
              <span className="material-symbols-outlined text-2xl">campaign</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111c2d]">Khaya AI Localized Voice & SMS Advisory</h3>
              <p className="text-xs text-[#6e7978]">
                Target Client: <strong className="text-[#005f5e]">{activePatient.name}</strong> ({activePatient.riskStatus})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f0f3ff] text-[#6e7978] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Language & Alert Type Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111c2d]">Target Dialect:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as GhanaianLanguage)}
              className="w-full p-2.5 bg-[#f0f3ff] border border-[#bdc9c8]/50 rounded-xl text-xs font-bold text-[#005f5e] outline-none"
            >
              <option value="Dagbani">⭐ Dagbani (Northern Region)</option>
              <option value="Twi">Twi (Ashanti/Eastern)</option>
              <option value="Ewe">Ewe (Volta Region)</option>
              <option value="Ga">Ga (Greater Accra)</option>
              <option value="Fante">Fante (Central Region)</option>
              <option value="Hausa">Hausa (Northern/Zongo)</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111c2d]">Alert Category:</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as any)}
              className="w-full p-2.5 bg-[#f0f3ff] border border-[#bdc9c8]/50 rounded-xl text-xs font-bold text-[#111c2d] outline-none"
            >
              <option value="High Risk Emergency">⚠️ High Risk Emergency Warning</option>
              <option value="ANC Appointment Reminder">📅 ANC Visit Reminder</option>
              <option value="Birth Preparedness Plan">👶 Birth Preparedness Counseling</option>
            </select>
          </div>
        </div>

        {/* Content Display */}
        {isLoading ? (
          <div className="p-8 text-center space-y-3 bg-[#f8fafc] rounded-2xl border border-[#bdc9c8]/30">
            <span className="material-symbols-outlined text-3xl text-[#005f5e] animate-spin">
              sync
            </span>
            <p className="text-xs font-bold text-[#005f5e]">
              Translating & Synthesizing Khaya AI Message in {selectedLanguage}...
            </p>
          </div>
        ) : alertData ? (
          <div className="space-y-4 bg-[#f0f3ff]/60 p-4 rounded-2xl border border-[#005f5e]/20">
            {/* Native Text */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#005f5e] flex items-center justify-between">
                <span>{selectedLanguage} Spoken / Audio Advisory:</span>
                <span className="text-[10px] text-[#6e7978]">Dialect: {alertData.language}</span>
              </span>
              <p className="text-sm font-semibold text-[#111c2d] bg-white p-3 rounded-xl border border-[#bdc9c8]/40 leading-relaxed">
                "{alertData.nativeText}"
              </p>
            </div>

            {/* Phonetic & English Verification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c8]/30">
                <span className="text-[10px] font-bold text-[#6e7978] block">Phonetic Reading Script</span>
                <p className="text-[#111c2d] font-mono text-[11px]">{alertData.phoneticScript}</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#bdc9c8]/30">
                <span className="text-[10px] font-bold text-[#6e7978] block">English Clinical Meaning</span>
                <p className="text-[#111c2d] text-[11px] line-clamp-3">{alertData.englishSummary}</p>
              </div>
            </div>

            {/* SMS Preview */}
            <div className="p-2.5 bg-white rounded-xl border border-[#bdc9c8]/30 space-y-1">
              <span className="text-[10px] font-bold text-[#a5374a] uppercase tracking-wider block">
                📲 Dispatch SMS Draft ({alertData.smsDraft.length} Chars):
              </span>
              <p className="text-xs text-[#3e4948] font-mono bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0]">
                {alertData.smsDraft}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handlePlayAudio}
                disabled={isPlayingAudio}
                className="flex-1 py-2.5 bg-[#005f5e] hover:bg-[#007a78] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {isPlayingAudio ? 'volume_up' : 'play_arrow'}
                </span>
                <span>{isPlayingAudio ? 'Playing Audio...' : `Play Audio in ${selectedLanguage}`}</span>
              </button>

              <button
                onClick={handleSendSMS}
                className="flex-1 py-2.5 bg-[#a5374a] hover:bg-[#822837] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Send Localized SMS Alert</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
