export type GhanaianLanguage = 'Dagbani' | 'Twi' | 'Ewe' | 'Ga' | 'Fante' | 'Hausa' | 'English';

export interface KhayaDictationResult {
  originalSpokenText: string;
  englishTranslation: string;
  detectedLanguage: GhanaianLanguage;
  parsedVitals: {
    sysBP?: number | null;
    diaBP?: number | null;
    weightKg?: number | null;
    gestationalAgeWeeks?: number | null;
    hemoglobin?: number | null;
    fundalHeightCm?: number | null;
    fetalHeartRateBpm?: number | null;
    urineProtein?: string | null;
    dangerSigns?: string[];
  };
  clinicalNotes: string;
  recommendedAction: string;
}

export interface KhayaTranslationResult {
  translatedText: string;
  language: GhanaianLanguage;
  phoneticHint?: string;
  medicalExplanation?: string;
}

export interface KhayaAlertResult {
  language: GhanaianLanguage;
  nativeText: string;
  phoneticScript: string;
  englishSummary: string;
  smsDraft: string;
  audioCue: string;
}
