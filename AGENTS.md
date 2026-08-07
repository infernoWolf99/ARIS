# Google AI Studio Agent Instructions - ARIS GHS Antenatal Care Platform

## Project Overview
**ARIS (Antenatal Records & Information System)** is a clinical care tracking platform built for Ghana Health Service (GHS) ANC facilities. It features local Ghanaian language support powered by **Khaya AI** for voice dictation, localized audio feedback, patient SMS/audio alerts (in Dagbani and Twi), and high-risk maternal health tracking.

## Key Rules & Guidelines
- **Framework**: React 18 with Vite, Express backend server, Tailwind CSS.
- **Iconography**: Material Symbols Outlined (`<span className="material-symbols-outlined">...</span>`).
- **Khaya AI Capabilities**:
  - Voice dictation for routine ANC visit logging in Dagbani & Twi.
  - Text-to-Speech audio playback for translations and patient instructions.
  - Localized alert broadcast generator for community health extension workers.
- **Server Port**: Port 3000 on host `0.0.0.0`.
- **System Instructions File**: `AGENTS.md` and `GEMINI.md` at project root automatically inject rules into Google AI Studio agent context.
