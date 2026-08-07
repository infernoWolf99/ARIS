export type ViewMode =
  | 'dashboard'
  | 'facility'
  | 'registration'
  | 'obstetric'
  | 'anc'
  | 'delivery'
  | 'pnc'
  | 'child'
  | 'coc';

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  contact: string;
  status: 'Active' | 'Inactive';
  colorClass?: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Patient {
  id: string;
  serialNo: string;
  regNo: string;
  nhisNo: string;
  name: string;
  age: number;
  gestationWeeks: number;
  edd: string;
  gravida: number;
  para: number;
  abortions: number;
  livingChildren: number;
  bloodGroup: string;
  riskStatus: 'High Risk' | 'Normal' | 'Overdue';
  riskFactors: RiskFactor[];
  photoUrl?: string;
  partnerName?: string;
  partnerPhone?: string;
  emergencyContact?: string;
  surgicalNotes?: string;
  infantFeedingIntention?: string;
  currentStage: 'ANC' | 'Delivery' | 'PNC' | 'CWC';
}

export interface ANCVisitRecord {
  id: string;
  patientId: string;
  visitNumber: number;
  date: string;
  gestationalAge: number;
  weightKg: number;
  sysBP: number;
  diaBP: number;
  fundalHeightCm: number;
  fetalHeartRateBpm: number;
  presentation: 'Cephalic' | 'Breech' | 'Transverse' | 'N/A (< 28wks)';
  edemaPresent: boolean;
  pallorChecked: boolean;
  hemoglobin: number;
  urineProtein: string;
  urineSugar: string;
  hivTest: 'NR' | 'R' | 'N/D';
  syphilisTest: 'NR' | 'R' | 'N/D';
  hepBTest: 'NR' | 'R' | 'N/D';
  iptpMalaria: string;
  tdVaccine: string;
  itnIssued: boolean;
  dewormingGiven: boolean;
  counselingTopics: string[];
  remarks: string;
  nextAppointmentDate?: string;
}

export interface DeliveryRecordData {
  id: string;
  patientId: string;
  dateOfDelivery: string;
  timeOfDelivery: string;
  gestationalAgeWeeks: number;
  attendantName: string;
  deliveryType: 'Single' | 'Multiple';
  modeOfDelivery: 'SVD (Vaginal)' | 'Caesarean Section (CS)' | 'Assisted (Vacuum/Forceps)';
  complications: string[];
  otherComplications?: string;
  maternalStatus: 'Alive & Discharged' | 'Referred to Higher Level' | 'Deceased';
  facilityDeliveredAt: string;
}

export interface PNCVisitRecord {
  id: string;
  patientId: string;
  timingCategory: '24-48 Hours' | '6-7 Days' | '6 Weeks';
  sysBP: number;
  diaBP: number;
  temperatureC: number;
  fundalHeightStatus: string;
  breastCondition: string;
  lochia: string;
  woundCondition: string;
  depressionScreening: 'Normal, no concerns' | 'Signs of Baby Blues' | 'Risk of PPD (Referral Needed)';
  postnatalHb: number;
  hivRetesting: string;
  familyPlanningCounseling: string;
  acceptedMethodName?: string;
}

export interface ChildRecord {
  id: string;
  motherPatientId: string;
  name: string;
  gender: 'Male' | 'Female';
  dob: string;
  cwcSerialNo: string;
  regNo: string;
  birthWeightKg: number;
  birthLengthCm: number;
  gaAtBirthWeeks: number;
  sickleCellStatus: 'Negative' | 'Positive' | 'Pending';
  milestones: {
    smiles6w: boolean;
    headControl3m: boolean;
    sitsWithoutSupport6m: boolean;
  };
  immunizations: {
    bcgDate?: string;
    opv0Date?: string;
    penta1Date?: string;
    pcv1Date?: string;
  };
  growthEntries: {
    milestone: string;
    weightKg: number | null;
    heightCm: number | null;
    muacCm: number | null;
    sdRating: string;
    signs: string;
  }[];
}

export interface FacilityProfile {
  name: string;
  type: string;
  region: string;
  district: string;
  subDistrict: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'alert';
  read: boolean;
}
