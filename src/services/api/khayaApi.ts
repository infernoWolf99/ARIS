/**
 * ARIS Khaya AI Service Client
 * Handles Ghanaian Local Language Translation, Voice Dictation & TTS Audio Feedback
 */

import { apiRequest } from './apiClient';

export interface KhayaTranslateDto {
  text: string;
  sourceLang?: string;
  targetLang: string;
  domain?: string;
}

export interface KhayaTranslateResponse {
  translatedText: string;
  language: string;
  phoneticHint?: string;
  medicalExplanation?: string;
}

export interface KhayaDictationDto {
  spokenText: string;
  inputLanguage: string;
}

export interface KhayaDictationResponse {
  originalSpokenText: string;
  englishTranslation: string;
  detectedLanguage: string;
  parsedVitals: {
    sysBP: number | null;
    diaBP: number | null;
    weightKg: number | null;
    gestationalAgeWeeks: number | null;
    hemoglobin: number | null;
    fundalHeightCm: number | null;
    fetalHeartRateBpm: number | null;
    urineProtein: string | null;
    dangerSigns: string[];
  };
  clinicalNotes: string;
  recommendedAction: string;
}

export interface KhayaPatientAlertDto {
  patientName: string;
  gestationWeeks: number;
  edd: string;
  riskStatus: string;
  riskFactors?: any[];
  language?: string;
  alertType?: string;
}

export interface KhayaPatientAlertResponse {
  language: string;
  nativeText: string;
  phoneticScript: string;
  englishSummary: string;
  smsDraft: string;
  audioCue: string;
}

export const khayaApi = {
  /**
   * POST /api/v1/khaya/translate (or /api/khaya/translate)
   */
  async translate(dto: KhayaTranslateDto): Promise<KhayaTranslateResponse> {
    return apiRequest<KhayaTranslateResponse>('/khaya/translate', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * POST /api/v1/khaya/dictate
   */
  async dictate(dto: KhayaDictationDto): Promise<KhayaDictationResponse> {
    return apiRequest<KhayaDictationResponse>('/khaya/dictate', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * POST /api/v1/khaya/patient-alert
   */
  async generatePatientAlert(dto: KhayaPatientAlertDto): Promise<KhayaPatientAlertResponse> {
    return apiRequest<KhayaPatientAlertResponse>('/khaya/patient-alert', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * POST /api/v1/khaya/tts
   */
  async requestTTS(text: string, voiceName: string = 'Kore'): Promise<{ success: boolean; audioBase64?: string }> {
    return apiRequest<{ success: boolean; audioBase64?: string }>('/khaya/tts', {
      method: 'POST',
      body: JSON.stringify({ text, voiceName }),
    });
  },
};
