import React, { useState } from 'react';
import { GhanaianLanguage } from '../../types/khaya';

export const KhayaTranslatorWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceLang, setSourceLang] = useState<GhanaianLanguage>('English');
  const [targetLang, setTargetLang] = useState<GhanaianLanguage>('Dagbani');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = async () => {
    if (!translatedText) return;
    setIsPlayingAudio(true);

    try {
      // Call Gemini TTS engine via backend
      const response = await fetch('/api/khaya/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: translatedText,
          voiceName: 'Kore',
        }),
      });

      const res = await response.json();

      if (res.success && res.audioBase64) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });

        const binary = atob(res.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

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
    } catch (err) {
      console.error('TTS audio error:', err);
    }

    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phonetic || translatedText);
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/khaya/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          sourceLang,
          targetLang,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        setTranslatedText(res.data.translatedText);
        setPhonetic(res.data.phoneticHint || '');
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-gradient-to-r from-[#005f5e] to-[#007a78] hover:from-[#004d4c] hover:to-[#006361] text-[#abfffc] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-[#abfffc]/30"
        title="Khaya AI Ghanaian Language Translator"
      >
        <span className="w-5 h-5 rounded-lg bg-[#abfffc]/20 flex items-center justify-center font-black text-[10px]">
          K
        </span>
        <span className="hidden sm:inline">Khaya AI Translate</span>
        <span className="material-symbols-outlined text-sm">translate</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-[#bdc9c8] rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#bdc9c8]/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[#111c2d]">Khaya AI Clinical Translator</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#005f5e]/10 text-[#005f5e]">
                Dagbani Focus
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#f0f3ff] rounded-lg text-[#6e7978]"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div>
              <label className="text-[10px] text-[#6e7978] block">From:</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as GhanaianLanguage)}
                className="w-full p-1.5 bg-[#f0f3ff] border border-[#bdc9c8]/40 rounded-lg text-xs"
              >
                <option value="English">English</option>
                <option value="Dagbani">Dagbani</option>
                <option value="Twi">Twi</option>
                <option value="Ewe">Ewe</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#6e7978] block">To:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as GhanaianLanguage)}
                className="w-full p-1.5 bg-[#f0f3ff] border border-[#bdc9c8]/40 rounded-lg text-xs font-bold text-[#005f5e]"
              >
                <option value="Dagbani">⭐ Dagbani</option>
                <option value="Twi">Twi</option>
                <option value="Ewe">Ewe</option>
                <option value="Ga">Ga</option>
                <option value="Fante">Fante</option>
                <option value="Hausa">Hausa</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
            placeholder="Enter clinical instructions or consent notes to translate..."
            className="w-full p-2.5 bg-[#f0f3ff] border border-[#bdc9c8]/40 rounded-xl text-xs text-[#111c2d] outline-none focus:bg-white resize-none"
          />

          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-2 bg-[#005f5e] hover:bg-[#007a78] text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">g_translate</span>
                <span>Translate with Khaya AI</span>
              </>
            )}
          </button>

          {translatedText && (
            <div className="p-3 bg-[#f0f3ff] rounded-xl border border-[#005f5e]/30 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#005f5e] uppercase tracking-wider block">
                  {targetLang} Translation:
                </span>
                <button
                  onClick={handlePlayAudio}
                  disabled={isPlayingAudio}
                  className="px-2.5 py-1 bg-[#005f5e] hover:bg-[#007a78] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-75"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isPlayingAudio ? 'graphic_eq' : 'volume_up'}
                  </span>
                  <span>{isPlayingAudio ? 'Playing Voice...' : 'Hear Feedback'}</span>
                </button>
              </div>
              <p className="font-semibold text-[#111c2d]">"{translatedText}"</p>
              {phonetic && (
                <p className="text-[10px] text-[#6e7978] italic font-mono pt-0.5">
                  Phonetic: {phonetic}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
