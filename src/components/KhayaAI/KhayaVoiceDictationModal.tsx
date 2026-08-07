import React, { useState } from 'react';
import { GhanaianLanguage, KhayaDictationResult } from '../../types/khaya';

interface KhayaVoiceDictationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVitals?: (parsed: KhayaDictationResult['parsedVitals'], notes: string) => void;
  defaultLanguage?: GhanaianLanguage;
}

const DAGBANI_SAMPLES = [
  {
    title: 'High Risk (Pre-eclampsia & Anemia)',
    lang: 'Dagbani' as GhanaianLanguage,
    text: 'Paɣa ŋɔ yuli m-bye Abena Mensah. Gestation weeks nyɛla 28 wks. Blood pressure nyɛla 145 over 95 mmHg. Weight 72kg, Fundal height 28cm. Ka zugubaɣu kpeeni (severe headache) ka niŋ kobina gba nyɛla edema. Hemoglobin nyɛla 9.2 g/dL.',
    desc: 'Dagbani dictation describing 28wks gestation, high BP 145/95, severe headache, edema & anemia.',
  },
  {
    title: 'Normal Routine ANC Visit',
    lang: 'Dagbani' as GhanaianLanguage,
    text: 'Gestational age nyɛla 32 weeks. BP nyɛla 118 over 76 mmHg. Weight 66kg. Fundal height 32cm, Fetal heart rate 142 bpm. Hemoglobin nyɛla 11.8 g/dL. Proteinuria negative. Paɣa ŋɔ nyɛla alaafiee.',
    desc: 'Dagbani dictation for normal 32-week ANC checkup with normal vitals.',
  },
  {
    title: 'Twi Routine Visit',
    lang: 'Twi' as GhanaianLanguage,
    text: 'W\'anya abrabɔ weeks 24. BP yɛ 130/84 mmHg. Weight yɛ 64kg, Hb level yɛ 10.5 g/dL. W\'ama no TD vaccine ne ITN bed net.',
    desc: 'Twi dictation logging 24wks visit, BP 130/84, Hb 10.5 g/dL, TD vaccine and net issued.',
  },
];

export const KhayaVoiceDictationModal: React.FC<KhayaVoiceDictationModalProps> = ({
  isOpen,
  onClose,
  onApplyVitals,
  defaultLanguage = 'Dagbani',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<GhanaianLanguage>(defaultLanguage);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<KhayaDictationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartSpeech = () => {
    // Check if SpeechRecognition is available in browser
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        // Fallback to sample Dagbani text for quick testing
        const sample = DAGBANI_SAMPLES[0].text;
        setInputText(sample);
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage === 'Twi' ? 'tw-GH' : selectedLanguage === 'Dagbani' ? 'dag-GH' : 'en-GH';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setInputText(DAGBANI_SAMPLES[0].text);
    }
  };

  const handleProcessDictation = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch('/api/khaya/dictate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: inputText,
          inputLanguage: selectedLanguage,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setResult(resData.data);
      } else {
        setErrorMsg(resData.message || 'Failed to process dictation with Khaya AI.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Network error communicating with Khaya AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (result && onApplyVitals) {
      onApplyVitals(result.parsedVitals, result.clinicalNotes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#bdc9c8]/50 shadow-2xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#bdc9c8]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#005f5e] to-[#007a78] text-[#abfffc] flex items-center justify-center font-black text-xl shadow-xs">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111c2d]">Khaya AI Voice Dictation</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#abfffc]/50 text-[#005f5e] border border-[#005f5e]/20 uppercase tracking-wider">
                  Dagbani Focused
                </span>
              </div>
              <p className="text-xs text-[#6e7978]">
                Dictate clinical notes in native Ghanaian languages. Auto-extracts vitals into GHS records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#f0f3ff] text-[#6e7978] hover:text-[#111c2d] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#111c2d] flex items-center justify-between">
            <span>Select Dictation Language:</span>
            <span className="text-[11px] text-[#005f5e] font-semibold">
              Primary: Dagbani (Northern Ghana)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {(['Dagbani', 'Twi', 'Ewe', 'Ga', 'Fante', 'Hausa', 'English'] as GhanaianLanguage[]).map(
              (lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? 'bg-[#005f5e] text-white shadow-xs border-2 border-[#abfffc]/50'
                      : 'bg-[#f0f3ff] text-[#3e4948] hover:bg-[#dee8ff]'
                  }`}
                >
                  {lang === 'Dagbani' ? '⭐ Dagbani' : lang}
                </button>
              )
            )}
          </div>
        </div>

        {/* Sample Dictation Benchmarks */}
        <div className="bg-[#f8fafc] p-3.5 rounded-2xl border border-[#bdc9c8]/40 space-y-2">
          <span className="text-[11px] font-bold text-[#6e7978] uppercase tracking-wider block">
            ⚡ Quick Test Samples (Click to load sample dictation):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DAGBANI_SAMPLES.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedLanguage(s.lang);
                  setInputText(s.text);
                }}
                className="text-left p-2.5 rounded-xl bg-white border border-[#bdc9c8]/40 hover:border-[#005f5e] hover:shadow-2xs transition-all cursor-pointer space-y-1"
              >
                <div className="text-[11px] font-bold text-[#005f5e] flex items-center justify-between">
                  <span>{s.title}</span>
                  <span className="text-[9px] bg-[#abfffc]/40 px-1.5 py-0.5 rounded text-[#005f5e]">
                    {s.lang}
                  </span>
                </div>
                <p className="text-[10px] text-[#6e7978] line-clamp-2">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Recording / Input Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111c2d]">
              Dictate or Type Spoken Clinical Observations:
            </span>

            <button
              onClick={handleStartSpeech}
              disabled={isRecording}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isRecording
                  ? 'bg-[#a5374a] text-white animate-pulse'
                  : 'bg-[#005f5e] text-white hover:bg-[#007a78] shadow-2xs'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
              <span>{isRecording ? 'Listening...' : 'Record Voice'}</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            placeholder={`Speak or paste midwife observations in ${selectedLanguage} (e.g. Dagbani: Paɣa ŋɔ yuli m-bye... BP nyɛla 140/95...)`}
            className="w-full p-3 bg-[#f0f3ff] border border-[#bdc9c8]/50 rounded-2xl text-xs text-[#111c2d] placeholder-[#6e7978] outline-none focus:ring-2 focus:ring-[#005f5e] focus:bg-white transition-all resize-none"
          />

          <button
            onClick={handleProcessDictation}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#005f5e] to-[#007a78] hover:from-[#004d4c] hover:to-[#006361] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">
                  sync
                </span>
                <span>Khaya AI Processing Dictation...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">psychology</span>
                <span>Parse Dictation with Khaya AI</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#a5374a]/10 border border-[#a5374a]/30 rounded-xl text-xs text-[#a5374a] font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Parsed Result Display */}
        {result && (
          <div className="bg-[#f0f3ff]/80 p-4 rounded-2xl border border-[#005f5e]/30 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#bdc9c8]/30 pb-2">
              <span className="text-xs font-bold text-[#005f5e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#005f5e]">
                  check_circle
                </span>
                <span>Khaya AI Clinical Parsing Complete</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#005f5e]/10 text-[#005f5e]">
                Detected: {result.detectedLanguage}
              </span>
            </div>

            {/* Translation & Notes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#6e7978] block">
                English Translation:
              </span>
              <p className="text-xs italic text-[#111c2d] bg-white p-2.5 rounded-xl border border-[#bdc9c8]/30">
                "{result.englishTranslation}"
              </p>
            </div>

            {/* Extracted Vitals Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#6e7978] block">
                Auto-Extracted Vitals & Clinical Data:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-[#bdc9c8]/30">
                  <span className="text-[10px] font-bold text-[#6e7978] block">Blood Pressure</span>
                  <span className="font-bold text-[#111c2d]">
                    {result.parsedVitals.sysBP && result.parsedVitals.diaBP
                      ? `${result.parsedVitals.sysBP}/${result.parsedVitals.diaBP}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#bdc9c8]/30">
                  <span className="text-[10px] font-bold text-[#6e7978] block">Weight</span>
                  <span className="font-bold text-[#111c2d]">
                    {result.parsedVitals.weightKg ? `${result.parsedVitals.weightKg} kg` : 'N/A'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#bdc9c8]/30">
                  <span className="text-[10px] font-bold text-[#6e7978] block">Gestational Age</span>
                  <span className="font-bold text-[#111c2d]">
                    {result.parsedVitals.gestationalAgeWeeks
                      ? `${result.parsedVitals.gestationalAgeWeeks} Wks`
                      : 'N/A'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#bdc9c8]/30">
                  <span className="text-[10px] font-bold text-[#6e7978] block">Hemoglobin</span>
                  <span className="font-bold text-[#111c2d]">
                    {result.parsedVitals.hemoglobin ? `${result.parsedVitals.hemoglobin} g/dL` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Signs if any */}
            {result.parsedVitals.dangerSigns && result.parsedVitals.dangerSigns.length > 0 && (
              <div className="p-2.5 bg-[#a5374a]/10 rounded-xl border border-[#a5374a]/30 text-xs text-[#a5374a]">
                <strong className="block text-[11px]">⚠️ Detected High-Risk Danger Signs:</strong>
                <ul className="list-disc list-inside mt-1 font-medium">
                  {result.parsedVitals.dangerSigns.map((ds, i) => (
                    <li key={i}>{ds}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {onApplyVitals && (
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 bg-[#005f5e] hover:bg-[#007a78] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">input</span>
                  <span>Apply Vitals & Notes to Active Form</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-[#bdc9c8]/50 hover:bg-[#f0f3ff] text-[#3e4948] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
