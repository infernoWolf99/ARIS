import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// -------------------------------------------------------------
// NestJS API Compatibility Layer (/api/v1/*)
// -------------------------------------------------------------
app.get('/api/v1/health', (req, res) => {
  res.json({
    statusCode: 200,
    data: {
      status: 'ok',
      framework: 'NestJS Express Adapter',
      orm: 'Prisma',
      database: 'PostgreSQL',
      version: '1.0.0',
    },
    timestamp: new Date().toISOString(),
  });
});

// Forward NestJS /api/v1/khaya/* endpoints to Khaya AI handlers
app.use((req, res, next) => {
  if (req.url.startsWith('/api/v1/khaya/')) {
    req.url = req.url.replace('/api/v1/khaya/', '/api/khaya/');
  }
  next();
});

// -------------------------------------------------------------
// 1. Khaya AI Translation API Endpoint
// Handles English <-> Dagbani, Twi, Ewe, Ga, Fante, Hausa
// -------------------------------------------------------------
app.post('/api/khaya/translate', async (req, res) => {
  try {
    const { text, sourceLang = 'English', targetLang = 'Dagbani', domain = 'Maternal Healthcare' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required for translation.' });
    }

    const systemInstruction = `You are Khaya AI Translation Engine for Ghanaian Healthcare, specializing in accurate translations for local Ghanaian languages with a strong emphasis on Dagbani (spoken in Northern Region, Tamale, Dagbon), Twi, Ewe, Ga, Fante, and Hausa.
You understand clinical terminology used in Ghana Health Service (GHS) Antenatal Care (ANC), Maternal Health, High-risk danger signs (severe pre-eclampsia, hemorrhage, obstructed labor), and postpartum counseling.

When translating into ${targetLang}:
- Produce clear, culturally sensitive, and medically accurate phrasing in ${targetLang}.
- If translating to Dagbani, use standard Dagbani orthography and respectful maternal terms (e.g., 'Paɣa bia' for pregnancy/child, 'Asho' / 'Ashibiti' for hospital/clinic, 'Nyɛvuli' for health/life).
- Provide both the direct translation and a simple phonetic pronunciation guide if helpful.

Return ONLY a JSON object with this exact structure:
{
  "translatedText": "The translation in ${targetLang}",
  "language": "${targetLang}",
  "phoneticHint": "Phonetic reading guide for community health nurses",
  "medicalExplanation": "Brief note on medical terms translated"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Translate the following ${domain} text from ${sourceLang} to ${targetLang}:\n\n"${text}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const resultText = response.text || '{}';
    const parsed = JSON.parse(resultText);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Khaya AI Translation Error:', error);
    res.status(500).json({
      error: 'Translation failed',
      message: error?.message || 'Failed to process Khaya AI translation',
    });
  }
});

// -------------------------------------------------------------
// 2. Khaya AI Voice Dictation & Clinical Note Parsing API
// Takes dictated speech in Dagbani/Twi/English and extracts vitals & notes
// -------------------------------------------------------------
app.post('/api/khaya/dictate', async (req, res) => {
  try {
    const { spokenText, inputLanguage = 'Dagbani' } = req.body;

    if (!spokenText || typeof spokenText !== 'string') {
      return res.status(400).json({ error: 'spokenText is required.' });
    }

    const systemInstruction = `You are Khaya AI Clinical Dictation Parser for Ghana Health Service (GHS) ANC clinics.
Midwives and Community Health Nurses (CHNs) dictate clinical visit notes or patient observations in local languages—particularly Dagbani, Twi, or English.

Your task:
1. Translate the spoken input from ${inputLanguage} to English.
2. Extract clinical parameters mentioned in the speech (such as Systolic BP, Diastolic BP, Weight kg, Gestational Age wks, Hemoglobin g/dL, Fundal Height cm, Fetal Heart Rate bpm, Proteinuria, Urine Sugar, Danger Signs, or Risk Factors).
3. Generate a structured ANC clinical observation summary and assign risk alert flags if abnormal values exist (e.g. BP >= 140/90, Hb < 11.0, severe headache, edema).

Return a JSON object with this exact structure:
{
  "originalSpokenText": "${spokenText}",
  "englishTranslation": "Complete English translation of what was spoken",
  "detectedLanguage": "${inputLanguage}",
  "parsedVitals": {
    "sysBP": number or null,
    "diaBP": number or null,
    "weightKg": number or null,
    "gestationalAgeWeeks": number or null,
    "hemoglobin": number or null,
    "fundalHeightCm": number or null,
    "fetalHeartRateBpm": number or null,
    "urineProtein": "string or null",
    "dangerSigns": ["array of detected danger signs"]
  },
  "clinicalNotes": "Professional clinical observation summary for the GHS register",
  "recommendedAction": "Action steps for midwife"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Parse and extract clinical data from this midwife dictation in ${inputLanguage}:\n\n"${spokenText}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Khaya AI Dictation Error:', error);
    res.status(500).json({
      error: 'Dictation processing failed',
      message: error?.message || 'Failed to process dictation',
    });
  }
});

// -------------------------------------------------------------
// 3. Khaya AI Localized Patient Voice & Emergency Alert Generator
// Generates audio script & SMS text in Dagbani (and other local languages)
// -------------------------------------------------------------
app.post('/api/khaya/patient-alert', async (req, res) => {
  try {
    const {
      patientName,
      gestationWeeks,
      edd,
      riskStatus,
      riskFactors = [],
      language = 'Dagbani',
      alertType = 'High Risk Emergency Warning',
    } = req.body;

    const systemInstruction = `You are Khaya AI Maternal Health Advisory Engine for Ghana Health Service.
You generate clear, respectful, and urgent voice call scripts and SMS messages in native Ghanaian languages—with primary expertise in Dagbani (Northern Region dialect), Twi, Ewe, and Ga.

When generating alerts in ${language}:
- Create an authoritative yet compassionate message tailored for expectant mothers in Ghana.
- Include key danger signs to watch out for (blurred vision, severe headache, epigastric pain, bleeding, reduced fetal movements).
- Provide clear instructions to visit the nearest GHS Health Center / Regional Hospital.

Return JSON with this structure:
{
  "language": "${language}",
  "nativeText": "The full message written in ${language}",
  "phoneticScript": "Guide for reading out loud in ${language}",
  "englishSummary": "English translation for the health worker's verification",
  "smsDraft": "Short SMS text under 160 chars in ${language}",
  "audioCue": "Description of voice tone (e.g. Calm, Urgent, Reassuring)"
}`;

    const prompt = `Generate a ${alertType} in ${language} for patient ${patientName}, currently at ${gestationWeeks} weeks gestation, EDD ${edd}. Risk Status: ${riskStatus}. Key Risk Factors: ${JSON.stringify(
      riskFactors
    )}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Khaya AI Patient Alert Error:', error);
    res.status(500).json({
      error: 'Alert generation failed',
      message: error?.message || 'Failed to generate Khaya AI patient alert',
    });
  }
});

// -------------------------------------------------------------
// 4. Khaya AI Speech Synthesis (TTS Audio)
// -------------------------------------------------------------
app.post('/api/khaya/tts', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required for TTS.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say clearly in a warm maternal health advisory tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      return res.json({ success: true, audioBase64: base64Audio });
    } else {
      return res.json({ success: false, message: 'No audio generated by TTS model.' });
    }
  } catch (error: any) {
    console.error('Khaya AI TTS Error:', error);
    res.status(500).json({
      error: 'TTS generation failed',
      message: error?.message || 'Failed to process TTS',
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static Files Setup
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARIS Khaya AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
