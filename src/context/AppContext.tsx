import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ViewMode,
  Patient,
  StaffMember,
  FacilityProfile,
  AppNotification,
  ANCVisitRecord,
  DeliveryRecordData,
  PNCVisitRecord,
  ChildRecord,
} from '../types';
import {
  initialFacility,
  initialPatients,
  initialStaffList,
  initialANCVisits,
  initialDeliveryRecords,
  initialPNCVisits,
  initialChildRecords,
  initialNotifications,
  availableFacilities,
} from '../data/mockData';

interface AppContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  facility: FacilityProfile;
  setFacility: React.Dispatch<React.SetStateAction<FacilityProfile>>;
  availableFacilitiesList: string[];
  switchFacilityByName: (name: string) => void;
  staffList: StaffMember[];
  addStaffMember: (staff: Omit<StaffMember, 'id'>) => void;
  patients: Patient[];
  activePatient: Patient;
  setActivePatient: (patient: Patient) => void;
  addPatient: (patientData: Omit<Patient, 'id'>) => Patient;
  updatePatient: (patient: Patient) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ancVisits: ANCVisitRecord[];
  addANCVisit: (visit: Omit<ANCVisitRecord, 'id'>) => void;
  deliveryRecords: DeliveryRecordData[];
  addDeliveryRecord: (record: Omit<DeliveryRecordData, 'id'>) => void;
  pncVisits: PNCVisitRecord[];
  addPNCVisit: (visit: Omit<PNCVisitRecord, 'id'>) => void;
  childRecords: ChildRecord[];
  updateChildRecord: (record: ChildRecord) => void;
  addChildGrowthEntry: (childId: string, entry: ChildRecord['growthEntries'][0]) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  quickActionOpen: boolean;
  setQuickActionOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  newStaffModalOpen: boolean;
  setNewStaffModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [facility, setFacility] = useState<FacilityProfile>(() => {
    const saved = localStorage.getItem('aris_facility');
    return saved ? JSON.parse(saved) : initialFacility;
  });

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('aris_staff');
    return saved ? JSON.parse(saved) : initialStaffList;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('aris_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [activePatient, setActivePatientState] = useState<Patient>(() => {
    return patients[3] || patients[0]; // Default to Abena Mensah or first patient
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [ancVisits, setAncVisits] = useState<ANCVisitRecord[]>(() => {
    const saved = localStorage.getItem('aris_anc_visits');
    return saved ? JSON.parse(saved) : initialANCVisits;
  });

  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryRecordData[]>(() => {
    const saved = localStorage.getItem('aris_delivery_records');
    return saved ? JSON.parse(saved) : initialDeliveryRecords;
  });

  const [pncVisits, setPncVisits] = useState<PNCVisitRecord[]>(() => {
    const saved = localStorage.getItem('aris_pnc_visits');
    return saved ? JSON.parse(saved) : initialPNCVisits;
  });

  const [childRecords, setChildRecords] = useState<ChildRecord[]>(() => {
    const saved = localStorage.getItem('aris_child_records');
    return saved ? JSON.parse(saved) : initialChildRecords;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('aris_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('aris_facility', JSON.stringify(facility));
  }, [facility]);

  useEffect(() => {
    localStorage.setItem('aris_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('aris_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('aris_anc_visits', JSON.stringify(ancVisits));
  }, [ancVisits]);

  useEffect(() => {
    localStorage.setItem('aris_delivery_records', JSON.stringify(deliveryRecords));
  }, [deliveryRecords]);

  useEffect(() => {
    localStorage.setItem('aris_pnc_visits', JSON.stringify(pncVisits));
  }, [pncVisits]);

  useEffect(() => {
    localStorage.setItem('aris_child_records', JSON.stringify(childRecords));
  }, [childRecords]);

  useEffect(() => {
    localStorage.setItem('aris_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const setActivePatient = (p: Patient) => {
    setActivePatientState(p);
  };

  const switchFacilityByName = (name: string) => {
    setFacility((prev) => ({ ...prev, name }));
    showToast(`Switched facility to ${name}`);
  };

  const addStaffMember = (staffData: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now()}`,
    };
    setStaffList((prev) => [newStaff, ...prev]);
    showToast(`Added new staff member: ${newStaff.name}`);
  };

  const addPatient = (patientData: Omit<Patient, 'id'>): Patient => {
    const newId = `ARIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newP: Patient = {
      ...patientData,
      id: newId,
    };
    setPatients((prev) => [newP, ...prev]);
    setActivePatientState(newP);
    showToast(`Successfully registered mother: ${newP.name} (ID: ${newId})`);
    return newP;
  };

  const updatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activePatient.id === updated.id) {
      setActivePatientState(updated);
    }
    showToast(`Updated record for ${updated.name}`);
  };

  const addANCVisit = (visitData: Omit<ANCVisitRecord, 'id'>) => {
    const newVisit: ANCVisitRecord = {
      ...visitData,
      id: `visit-${Date.now()}`,
    };
    setAncVisits((prev) => [...prev, newVisit]);
    showToast(`Logged ANC Visit #${newVisit.visitNumber} for patient`);
  };

  const addDeliveryRecord = (delData: Omit<DeliveryRecordData, 'id'>) => {
    const newDel: DeliveryRecordData = {
      ...delData,
      id: `del-${Date.now()}`,
    };
    setDeliveryRecords((prev) => [newDel, ...prev]);
    showToast(`Delivery record finalized for patient`);
  };

  const addPNCVisit = (pncData: Omit<PNCVisitRecord, 'id'>) => {
    const newPnc: PNCVisitRecord = {
      ...pncData,
      id: `pnc-${Date.now()}`,
    };
    setPncVisits((prev) => [newPnc, ...prev]);
    showToast(`Saved PNC ${newPnc.timingCategory} Visit record`);
  };

  const updateChildRecord = (updated: ChildRecord) => {
    setChildRecords((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Child Profile updated for ${updated.name}`);
  };

  const addChildGrowthEntry = (childId: string, entry: ChildRecord['growthEntries'][0]) => {
    setChildRecords((prev) =>
      prev.map((c) => {
        if (c.id === childId) {
          return {
            ...c,
            growthEntries: [...c.growthEntries, entry],
          };
        }
        return c;
      })
    );
    showToast(`Added growth record entry for child`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        facility,
        setFacility,
        availableFacilitiesList: availableFacilities,
        switchFacilityByName,
        staffList,
        addStaffMember,
        patients,
        activePatient,
        setActivePatient,
        addPatient,
        updatePatient,
        searchQuery,
        setSearchQuery,
        ancVisits,
        addANCVisit,
        deliveryRecords,
        addDeliveryRecord,
        pncVisits,
        addPNCVisit,
        childRecords,
        updateChildRecord,
        addChildGrowthEntry,
        notifications,
        markNotificationRead,
        quickActionOpen,
        setQuickActionOpen,
        notificationsOpen,
        setNotificationsOpen,
        newStaffModalOpen,
        setNewStaffModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
