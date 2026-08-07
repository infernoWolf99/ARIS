# ARIS Ghana Health Service (GHS) Antenatal Care Platform
## Complete Backend Developer Specification & API Mapping Guide

This specification provides the complete, production-ready backend specification for building the **ARIS (Antenatal Records & Information System)** backend using **NestJS**, **Prisma ORM**, **PostgreSQL**, and **Khaya AI** local West African language integration.

---

## 1. Stack & System Architecture Summary

| Layer | Selected Technology | Notes |
| :--- | :--- | :--- |
| **Language** | TypeScript (Strict Mode) | Shared typing conventions between React & NestJS |
| **Backend Framework** | NestJS (Express adapter) | Listening on port `3000` with global prefix `/api/v1/*` |
| **Database** | PostgreSQL 15+ | Relational persistence with UUID primary keys |
| **ORM** | Prisma ORM | Schema defined at `prisma/schema.prisma` |
| **Authentication** | NestJS `@nestjs/jwt` + `@nestjs/passport` | JWT Bearer Token authorization with clinician role claims |
| **API Testing** | Postman Collection | Available at `/postman/aris_ghs_nest_api.postman_collection.json` |
| **Language & Medical AI** | Khaya AI + Gemini 2.5 API | West African voice dictation (Dagbani/Twi/Ewe), TTS audio, and risk stratification |

---

## 2. Environment Variables Setup (`.env`)

```env
# Server Runtime
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres_password@localhost:5432/aris_ghs_db?schema=public"

# Authentication Secrets
JWT_SECRET="ghs_tamale_maternal_health_secret_key_2026"
JWT_EXPIRES_IN="7d"

# AI Integrations
GEMINI_API_KEY="your_google_gemini_api_key"
KHAYA_AI_API_KEY="your_khaya_ai_api_key"
```

---

## 3. NestJS Server Entry Point (`main.ts`)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API routing prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend client
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global DTO validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000, '0.0.0.0');
  console.log('ARIS GHS NestJS Backend running on http://localhost:3000/api/v1');
}
bootstrap();
```

---

## 4. Complete Prisma Database Schema (`prisma/schema.prisma`)

Place this file at `prisma/schema.prisma` in your backend project root:

```prisma
// ARIS Ghana Health Service (GHS) Antenatal Care Platform
// Prisma Schema for PostgreSQL Database - 100% Matched with Frontend Models

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model StaffMember {
  id         String   @id @default(uuid())
  name       String
  initials   String
  role       String   // 'Senior Midwife' | 'Obstetrician' | 'CHO Field Officer' | 'Data Clerk'
  contact    String
  status     String   @default("Active") // 'Active' | 'Inactive'
  colorClass String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@map("staff_members")
}

model Patient {
  id                     String   @id @default(uuid())
  serialNo               String   @unique
  regNo                  String   @unique
  nhisNo                 String
  name                   String
  age                    Int
  gestationWeeks         Int
  edd                    String   // YYYY-MM-DD
  gravida                Int      @default(1)
  para                   Int      @default(0)
  abortions              Int      @default(0)
  livingChildren         Int      @default(0)
  bloodGroup             String
  riskStatus             String   @default("Normal") // 'High Risk' | 'Normal' | 'Overdue'
  photoUrl               String?
  partnerName            String?
  partnerPhone           String?
  emergencyContact       String?
  surgicalNotes          String?
  infantFeedingIntention String?
  currentStage           String   @default("ANC") // 'ANC' | 'Delivery' | 'PNC' | 'CWC'
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  riskFactors RiskFactor[]
  ancVisits   ANCVisitRecord[]
  deliveries  DeliveryRecord[]
  pncVisits   PNCVisitRecord[]
  children    ChildRecord[]

  @@map("patients")
}

model RiskFactor {
  id        String   @id @default(uuid())
  patientId String
  patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  name      String
  detail    String
  severity  String   @default("high") // 'high' | 'medium' | 'low'
  createdAt DateTime @default(now())

  @@map("risk_factors")
}

model ANCVisitRecord {
  id                  String   @id @default(uuid())
  patientId           String
  patient             Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  visitNumber         Int
  date                String   // YYYY-MM-DD
  gestationalAge      Int
  weightKg            Float
  sysBP               Int
  diaBP               Int
  fundalHeightCm      Float
  fetalHeartRateBpm   Int
  presentation        String   @default("Cephalic") // 'Cephalic' | 'Breech' | 'Transverse' | 'N/A (< 28wks)'
  edemaPresent        Boolean  @default(false)
  pallorChecked       Boolean  @default(false)
  hemoglobin          Float
  urineProtein        String   @default("Nil")
  urineSugar          String   @default("Nil")
  hivTest             String   @default("NR") // 'NR' | 'R' | 'N/D'
  syphilisTest        String   @default("NR") // 'NR' | 'R' | 'N/D'
  hepBTest            String   @default("NR") // 'NR' | 'R' | 'N/D'
  iptpMalaria         String   @default("Dose 1 (SP)")
  tdVaccine           String   @default("TD 1")
  itnIssued           Boolean  @default(true)
  dewormingGiven      Boolean  @default(false)
  counselingTopics    String[] @default([])
  remarks             String   @default("")
  nextAppointmentDate String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("anc_visit_records")
}

model DeliveryRecord {
  id                  String   @id @default(uuid())
  patientId           String
  patient             Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  dateOfDelivery      String
  timeOfDelivery      String
  gestationalAgeWeeks Int
  attendantName       String
  deliveryType        String   @default("Single") // 'Single' | 'Multiple'
  modeOfDelivery      String   @default("SVD (Vaginal)") // 'SVD (Vaginal)' | 'Caesarean Section (CS)' | 'Assisted (Vacuum/Forceps)'
  complications       String[] @default([])
  otherComplications  String?
  maternalStatus      String   @default("Alive & Discharged") // 'Alive & Discharged' | 'Referred to Higher Level' | 'Deceased'
  facilityDeliveredAt String   @default("Tamale Central Hospital")
  createdAt           DateTime @default(now())

  @@map("delivery_records")
}

model PNCVisitRecord {
  id                       String   @id @default(uuid())
  patientId                String
  patient                  Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  timingCategory           String   @default("24-48 Hours") // '24-48 Hours' | '6-7 Days' | '6 Weeks'
  sysBP                    Int
  diaBP                    Int
  temperatureC             Float
  fundalHeightStatus       String
  breastCondition          String
  lochia                   String
  woundCondition           String
  depressionScreening      String   @default("Normal, no concerns") // 'Normal, no concerns' | 'Signs of Baby Blues' | 'Risk of PPD (Referral Needed)'
  postnatalHb              Float
  hivRetesting             String   @default("Negative")
  familyPlanningCounseling String
  acceptedMethodName       String?
  createdAt                DateTime @default(now())

  @@map("pnc_visit_records")
}

model ChildRecord {
  id               String   @id @default(uuid())
  motherPatientId  String
  mother           Patient  @relation(fields: [motherPatientId], references: [id], onDelete: Cascade)
  name             String
  gender           String   @default("Female") // 'Male' | 'Female'
  dob              String   // YYYY-MM-DD
  cwcSerialNo      String   @unique
  regNo            String   @unique
  birthWeightKg    Float
  birthLengthCm    Float
  gaAtBirthWeeks   Int
  sickleCellStatus String   @default("Negative") // 'Negative' | 'Positive' | 'Pending'
  milestones       Json     // { smiles6w: boolean, headControl3m: boolean, sitsWithoutSupport6m: boolean }
  immunizations    Json     // { bcgDate?: string, opv0Date?: string, penta1Date?: string, pcv1Date?: string }
  growthEntries    Json     // Array of growth monitoring objects
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@map("child_records")
}

model KhayaTranslationLog {
  id             String   @id @default(uuid())
  sourceText     String
  targetLang     String
  translatedText String
  phonetic       String?
  medicalNotes   String?
  createdAt      DateTime @default(now())

  @@map("khaya_translation_logs")
}

model FacilityProfile {
  id          String   @id @default("default")
  name        String   @default("Tamale Central Hospital")
  type        String   @default("Regional Secondary Facility")
  region      String   @default("Northern Region (Tamale)")
  district    String   @default("Tamale Metro")
  subDistrict String   @default("Aboabo Sub-District")
  updatedAt   DateTime @updatedAt

  @@map("facility_profile")
}
```

---

## 5. NestJS API Routes & Controllers Reference

### 5.1. Standard Response Envelope
All API controllers return responses wrapped in this standard payload envelope:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-08-07T13:20:00.000Z"
}
```

---

### 5.2. Auth & Session Controller (`/api/v1/auth`)

Handles GHS clinician authentication and session validation:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Clinician Sign In | `{ "username": "ama.jumah", "pin": "1234", "facilityName": "Accra Polyclinic Maternity Ward", "role": "Senior Midwife" }` |
| `GET` | `/api/v1/auth/me` | Fetch active user session | *Header: Authorization: Bearer <token>* |
| `POST` | `/api/v1/auth/logout` | Invalidate active JWT token | *Header: Authorization: Bearer <token>* |

#### Sample Login Request Payload (`POST /api/v1/auth/login`):
```json
{
  "username": "ama.jumah",
  "pin": "1234",
  "facilityName": "Accra Polyclinic Maternity Ward",
  "role": "Senior Midwife"
}
```

#### Sample Login Response:
```json
{
  "statusCode": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userSession": {
      "username": "ama.jumah",
      "staffMember": {
        "id": "staff-001",
        "name": "Ama Jumah",
        "initials": "AJ",
        "role": "Senior Midwife",
        "contact": "+233 55 123 4567",
        "status": "Active"
      },
      "facilityName": "Accra Polyclinic Maternity Ward",
      "loginTime": "2026-08-07T13:20:00.000Z"
    }
  },
  "message": "Authenticated successfully as Senior Midwife"
}
```

---

### 5.3. Patient Registry Controller (`/api/v1/patients`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/patients` | Retrieve all registered maternal patients |
| `GET` | `/api/v1/patients/:id` | Fetch patient with all relations (`riskFactors`, `ancVisits`, `deliveries`, `pncVisits`, `children`) |
| `POST` | `/api/v1/patients` | Register new maternal health patient |
| `PUT` | `/api/v1/patients/:id` | Update patient record |
| `DELETE` | `/api/v1/patients/:id` | Delete patient record |
| `GET` | `/api/v1/patients/search?q=...` | Search by serialNo, regNo, or patient name |

#### Sample Create Patient Request (`POST /api/v1/patients`):
```json
{
  "serialNo": "ANC-2026-004",
  "regNo": "GHS-TCH-0892",
  "nhisNo": "48201934",
  "name": "Rahinatu Yakubu",
  "age": 26,
  "gestationWeeks": 24,
  "edd": "2026-11-18",
  "gravida": 2,
  "para": 1,
  "abortions": 0,
  "livingChildren": 1,
  "bloodGroup": "O Positive",
  "riskStatus": "High Risk",
  "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  "partnerName": "Musa Yakubu",
  "partnerPhone": "0244123456",
  "emergencyContact": "0244123456 (Husband)",
  "surgicalNotes": "Previous C-Section in 2023",
  "infantFeedingIntention": "Exclusive Breastfeeding for 6 Months",
  "currentStage": "ANC",
  "riskFactors": [
    {
      "name": "Severe Anemia",
      "detail": "Hb level 8.4 g/dL at 24 weeks",
      "severity": "high"
    }
  ]
}
```

---

### 5.4. ANC Visits Controller (`/api/v1/anc-visits`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/anc-visits/patient/:patientId` | List routine ANC visits for a patient |
| `POST` | `/api/v1/anc-visits` | Create new routine ANC visit record |

#### Sample ANC Visit Request (`POST /api/v1/anc-visits`):
```json
{
  "patientId": "p-1",
  "visitNumber": 3,
  "date": "2026-08-07",
  "gestationalAge": 28,
  "weightKg": 64.5,
  "sysBP": 132,
  "diaBP": 84,
  "fundalHeightCm": 28,
  "fetalHeartRateBpm": 144,
  "presentation": "Cephalic",
  "edemaPresent": false,
  "pallorChecked": true,
  "hemoglobin": 10.8,
  "urineProtein": "Nil",
  "urineSugar": "Nil",
  "hivTest": "NR",
  "syphilisTest": "NR",
  "hepBTest": "NR",
  "iptpMalaria": "Dose 2 (SP)",
  "tdVaccine": "TD 2",
  "itnIssued": true,
  "dewormingGiven": true,
  "counselingTopics": ["Birth Preparedness", "Nutrition in Pregnancy"],
  "remarks": "Progressing well. Continue IFA tablets.",
  "nextAppointmentDate": "2026-09-04"
}
```

---

### 5.5. Khaya AI Language Controller (`/api/v1/khaya`)

Connects to West African local language services (Dagbani, Twi, Ewe, Fante, Ga):

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/khaya/translate` | Translate text between English and local languages |
| `POST` | `/api/v1/khaya/dictate` | Voice dictation parser extracting vitals & danger signs |
| `POST` | `/api/v1/khaya/patient-alert` | Generate localized SMS broadcast draft & audio voice cue |
| `POST` | `/api/v1/khaya/tts` | Synthesize local language text into audio base64 |

#### Sample Voice Dictation Payload (`POST /api/v1/khaya/dictate`):
```json
{
  "spokenText": "Anya tim BP yɛ 145/95 mmHg. She reports severe headache and blurry vision.",
  "inputLanguage": "Dagbani"
}
```

#### Sample Response:
```json
{
  "statusCode": 200,
  "data": {
    "originalSpokenText": "Anya tim BP yɛ 145/95 mmHg. She reports severe headache and blurry vision.",
    "englishTranslation": "Blood pressure is 145/95 mmHg. Patient reports severe headache and visual disturbances.",
    "detectedLanguage": "Dagbani",
    "parsedVitals": {
      "sysBP": 145,
      "diaBP": 95,
      "weightKg": null,
      "gestationalAgeWeeks": null,
      "hemoglobin": null,
      "fundalHeightCm": null,
      "fetalHeartRateBpm": null,
      "urineProtein": null,
      "dangerSigns": ["Severe Headache", "Visual Disturbances"]
    },
    "clinicalNotes": "Hypertensive episode detected (145/95 mmHg) with symptoms of Preeclampsia.",
    "recommendedAction": "Immediate urine protein dipstick test and physician escalation."
  }
}
```

---

### 5.6. Facilities Controller (`/api/v1/facilities`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/facilities` | List available GHS stations (Tamale Central, Accra Poly, etc.) |
| `GET` | `/api/v1/facilities/profile` | Get current active station profile |
| `PUT` | `/api/v1/facilities/profile` | Update station profile details |

---

### 5.7. Additional Service Endpoints
- **Delivery Outcomes (`/api/v1/deliveries`)**: `GET /patient/:patientId`, `POST /`
- **Postnatal Care (`/api/v1/pnc-visits`)**: `GET /patient/:patientId`, `POST /`
- **Child Welfare Records (`/api/v1/children`)**: `GET /`, `GET /mother/:motherPatientId`, `POST /`
- **Staff Management (`/api/v1/staff`)**: `GET /`, `POST /`

---

## 6. Postman Collection Integration

A ready-to-use Postman collection is included in the project repository:
📁 `/postman/aris_ghs_nest_api.postman_collection.json`

To import into Postman:
1. Open Postman -> Click **Import**.
2. Select `/postman/aris_ghs_nest_api.postman_collection.json`.
3. Set environment variable `baseUrl` = `http://localhost:3000/api/v1`.

---

## 7. Connecting Frontend to NestJS Server

In your frontend `.env` configuration:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_NEST_API=true
```

All React components will route requests directly to your NestJS server endpoints.
