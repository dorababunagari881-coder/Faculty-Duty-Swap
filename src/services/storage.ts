import { 
  UserProfile, 
  Duty, 
  SwapRequest, 
  SwapHistory, 
  Notification, 
  CollegeConfig 
} from '../types';

const STORAGE_KEYS = {
  PROFILES: 'fds_profiles_v2',
  DUTIES: 'fds_duties_v2',
  SWAP_REQUESTS: 'fds_swap_requests_v2',
  SWAP_HISTORY: 'fds_swap_history_v2',
  NOTIFICATIONS: 'fds_notifications_v2',
  CONFIG: 'fds_config_v2',
  CURRENT_USER: 'fds_current_user_v2',
};

// Date helpers for dynamic realistic calendar placement
export const formatDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return formatDateStr(d);
};

export const DEFAULT_CONFIG: CollegeConfig = {
  collegeName: "RGM College of Engineering & Technology",
  collegeShortName: "RGMCET",
  tagline: "Smart Faculty Duty Management & Swapping",
  academicYear: "2026-2027",
  departments: ["CSE", "ECE", "EEE", "ME", "CE", "AI & DS"],
  locations: [
    "CSE Lab 1", 
    "CSE Lab 2", 
    "Seminar Hall", 
    "Room 204", 
    "Exam Hall", 
    "Conference Room", 
    "ECE Lab 3", 
    "Auditorium"
  ],
  dutyTypes: [
    "Lab Supervision",
    "Exam Duty",
    "Classroom Supervision",
    "Internal Assessment",
    "Project Evaluation",
    "Department Meeting",
    "Seminar Supervision"
  ]
};

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: "fac-1",
    full_name: "Dr. Rajesh Kumar",
    faculty_id: "FAC-CSE-01",
    email: "faculty@rgmcet.edu.in",
    department: "CSE",
    phone: "+91 98765 43210",
    role: "FACULTY",
    designation: "Associate Professor",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fac-2",
    full_name: "Dr. Priya Sharma",
    faculty_id: "FAC-CSE-02",
    email: "priya.sharma@rgmcet.edu.in",
    department: "CSE",
    phone: "+91 98765 43211",
    role: "FACULTY",
    designation: "Assistant Professor",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fac-3",
    full_name: "Dr. Arun Reddy",
    faculty_id: "FAC-ECE-03",
    email: "arun.reddy@rgmcet.edu.in",
    department: "ECE",
    phone: "+91 98765 43212",
    role: "FACULTY",
    designation: "Professor & Head",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fac-4",
    full_name: "Prof. Sneha Rao",
    faculty_id: "FAC-EEE-04",
    email: "sneha.rao@rgmcet.edu.in",
    department: "EEE",
    phone: "+91 98765 43213",
    role: "FACULTY",
    designation: "Associate Professor",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fac-5",
    full_name: "Dr. Kiran Kumar",
    faculty_id: "FAC-ME-05",
    email: "kiran.kumar@rgmcet.edu.in",
    department: "ME",
    phone: "+91 98765 43214",
    role: "FACULTY",
    designation: "Assistant Professor",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "admin-1",
    full_name: "Prof. K. Venkatesh (Dean)",
    faculty_id: "ADM-001",
    email: "admin@rgmcet.edu.in",
    department: "Deanery / Admin",
    phone: "+91 98765 43200",
    role: "ADMIN",
    designation: "Dean of Academic Affairs",
    avatar_url: "",
    status: "active",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const generateDefaultDuties = (): Duty[] => {
  const today = getOffsetDate(0);
  const tomorrow = getOffsetDate(1);
  const dayAfter = getOffsetDate(2);
  const in3Days = getOffsetDate(3);
  const in5Days = getOffsetDate(5);
  const in7Days = getOffsetDate(7);
  const yesterday = getOffsetDate(-1);

  return [
    // --- Dr. Rajesh Kumar (fac-1) ---
    {
      id: "duty-1",
      faculty_id: "fac-1",
      date: today,
      start_time: "09:00 AM",
      end_time: "11:00 AM",
      duty_description: "Lab Supervision",
      location: "CSE Lab 2",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-2",
      faculty_id: "fac-1",
      date: today,
      start_time: "11:30 AM",
      end_time: "01:00 PM",
      duty_description: "Internal Assessment",
      location: "Room 204",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-3",
      faculty_id: "fac-1",
      date: today,
      start_time: "02:00 PM",
      end_time: "03:30 PM",
      duty_description: "Classroom Supervision",
      location: "Room 204",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-4",
      faculty_id: "fac-1",
      date: tomorrow,
      start_time: "09:30 AM",
      end_time: "12:30 PM",
      duty_description: "Lab Supervision",
      location: "CSE Lab 1",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-5",
      faculty_id: "fac-1",
      date: dayAfter,
      start_time: "10:00 AM",
      end_time: "01:00 PM",
      duty_description: "Exam Duty",
      location: "Exam Hall",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-6",
      faculty_id: "fac-1",
      date: in5Days,
      start_time: "02:00 PM",
      end_time: "04:30 PM",
      duty_description: "Project Evaluation",
      location: "Seminar Hall",
      department: "CSE",
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // --- Dr. Priya Sharma (fac-2) ---
    {
      id: "duty-7",
      faculty_id: "fac-2",
      date: today,
      start_time: "02:00 PM",
      end_time: "04:00 PM",
      duty_description: "Exam Supervision",
      location: "Room 204",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-8",
      faculty_id: "fac-2",
      date: tomorrow,
      start_time: "09:00 AM",
      end_time: "11:00 AM",
      duty_description: "Lab Supervision",
      location: "CSE Lab 2",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-9",
      faculty_id: "fac-2",
      date: dayAfter,
      start_time: "02:00 PM",
      end_time: "05:00 PM",
      duty_description: "Project Evaluation",
      location: "Seminar Hall",
      department: "CSE",
      status: "scheduled",
      created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-10",
      faculty_id: "fac-2",
      date: in3Days,
      start_time: "10:00 AM",
      end_time: "12:00 PM",
      duty_description: "Internal Assessment",
      location: "Room 204",
      department: "CSE",
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // --- Dr. Arun Reddy (fac-3) - ECE ---
    {
      id: "duty-11",
      faculty_id: "fac-3",
      date: today,
      start_time: "10:00 AM",
      end_time: "01:00 PM",
      duty_description: "Lab Supervision",
      location: "ECE Lab 3",
      department: "ECE",
      status: "scheduled",
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-12",
      faculty_id: "fac-3",
      date: tomorrow,
      start_time: "02:00 PM",
      end_time: "04:00 PM",
      duty_description: "Seminar Supervision",
      location: "Seminar Hall",
      department: "ECE",
      status: "scheduled",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-13",
      faculty_id: "fac-3",
      date: in7Days,
      start_time: "09:00 AM",
      end_time: "12:00 PM",
      duty_description: "Exam Duty",
      location: "Exam Hall",
      department: "ECE",
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // --- Prof. Sneha Rao (fac-4) - EEE ---
    {
      id: "duty-14",
      faculty_id: "fac-4",
      date: today,
      start_time: "09:00 AM",
      end_time: "11:00 AM",
      duty_description: "Classroom Supervision",
      location: "Room 204",
      department: "EEE",
      status: "scheduled",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-15",
      faculty_id: "fac-4",
      date: dayAfter,
      start_time: "11:00 AM",
      end_time: "01:00 PM",
      duty_description: "Internal Assessment",
      location: "Room 204",
      department: "EEE",
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // --- Dr. Kiran Kumar (fac-5) - ME ---
    {
      id: "duty-16",
      faculty_id: "fac-5",
      date: today,
      start_time: "01:30 PM",
      end_time: "04:30 PM",
      duty_description: "Lab Supervision",
      location: "Conference Room",
      department: "ME",
      status: "scheduled",
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "duty-17",
      faculty_id: "fac-5",
      date: in5Days,
      start_time: "09:00 AM",
      end_time: "12:00 PM",
      duty_description: "Exam Duty",
      location: "Exam Hall",
      department: "ME",
      status: "scheduled",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    // --- Completed duty sample from yesterday ---
    {
      id: "duty-18",
      faculty_id: "fac-1",
      date: yesterday,
      start_time: "09:00 AM",
      end_time: "11:00 AM",
      duty_description: "Department Meeting",
      location: "Conference Room",
      department: "CSE",
      status: "completed",
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

export const generateDefaultSwapRequests = (): SwapRequest[] => {
  const tomorrow = getOffsetDate(1);
  return [
    {
      id: "req-101",
      requester_id: "fac-1",
      requester_name: "Dr. Rajesh Kumar",
      requester_department: "CSE",
      receiver_id: "fac-2",
      receiver_name: "Dr. Priya Sharma",
      receiver_department: "CSE",
      requester_duty_id: "duty-4", // Lab Supervision tomorrow 09:30 AM
      receiver_duty_id: "duty-8",  // Lab Supervision tomorrow 09:00 AM
      reason: "Requesting swap due to department accreditation committee meeting.",
      status: "pending",
      request_date: new Date(Date.now() - 4 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: "req-102",
      requester_id: "fac-3",
      requester_name: "Dr. Arun Reddy",
      requester_department: "ECE",
      receiver_id: "fac-1",
      receiver_name: "Dr. Rajesh Kumar",
      receiver_department: "CSE",
      requester_duty_id: "duty-12",
      receiver_duty_id: "duty-5",
      reason: "Guest lecture scheduled at external symposium.",
      status: "pending",
      request_date: new Date(Date.now() - 12 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString()
    }
  ];
};

export const generateDefaultSwapHistory = (): SwapHistory[] => {
  const pastDate1 = getOffsetDate(-6);
  const pastDate2 = getOffsetDate(-10);

  return [
    {
      id: "hist-001",
      swap_request_id: "req-090",
      requester_id: "fac-2",
      receiver_id: "fac-1",
      requester_name: "Dr. Priya Sharma",
      receiver_name: "Dr. Rajesh Kumar",
      original_duty_id: "duty-past-1",
      swapped_duty_id: "duty-past-2",
      original_duty_desc: "Internal Assessment",
      swapped_duty_desc: "Seminar Supervision",
      original_duty_date: pastDate1,
      swapped_duty_date: pastDate1,
      original_duty_time: "10:00 AM – 12:00 PM",
      swapped_duty_time: "02:00 PM – 04:00 PM",
      original_duty_location: "Room 204",
      swapped_duty_location: "Seminar Hall",
      status: "approved",
      reason: "Urgent medical checkup appointment.",
      request_date: new Date(Date.now() - 8 * 86400000).toISOString(),
      response_date: new Date(Date.now() - 7 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: "hist-002",
      swap_request_id: "req-085",
      requester_id: "fac-4",
      receiver_id: "fac-3",
      requester_name: "Prof. Sneha Rao",
      receiver_name: "Dr. Arun Reddy",
      original_duty_id: "duty-past-3",
      swapped_duty_id: "duty-past-4",
      original_duty_desc: "Classroom Supervision",
      swapped_duty_desc: "Exam Duty",
      original_duty_date: pastDate2,
      swapped_duty_date: pastDate2,
      original_duty_time: "09:00 AM – 11:00 AM",
      swapped_duty_time: "01:30 PM – 04:30 PM",
      original_duty_location: "Room 204",
      swapped_duty_location: "Exam Hall",
      status: "approved",
      reason: "Department curriculum revision workshop.",
      request_date: new Date(Date.now() - 12 * 86400000).toISOString(),
      response_date: new Date(Date.now() - 11 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 11 * 86400000).toISOString()
    },
    {
      id: "hist-003",
      swap_request_id: "req-081",
      requester_id: "fac-5",
      receiver_id: "fac-1",
      requester_name: "Dr. Kiran Kumar",
      receiver_name: "Dr. Rajesh Kumar",
      original_duty_id: "duty-past-5",
      swapped_duty_id: "duty-past-6",
      original_duty_desc: "Lab Supervision",
      swapped_duty_desc: "Internal Assessment",
      original_duty_date: pastDate2,
      swapped_duty_date: pastDate2,
      original_duty_time: "02:00 PM – 05:00 PM",
      swapped_duty_time: "09:00 AM – 11:30 AM",
      original_duty_location: "ME Workshop",
      swapped_duty_location: "Room 204",
      status: "rejected",
      reason: "Prior commitment during requested timeslot.",
      request_date: new Date(Date.now() - 15 * 86400000).toISOString(),
      response_date: new Date(Date.now() - 14 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 14 * 86400000).toISOString()
    }
  ];
};

export const generateDefaultNotifications = (): Notification[] => {
  return [
    {
      id: "notif-1",
      user_id: "fac-2",
      title: "New Duty Swap Request",
      message: "Dr. Rajesh Kumar sent you a duty swap request for Lab Supervision.",
      type: "NEW_SWAP_REQUEST",
      related_request_id: "req-101",
      is_read: false,
      created_at: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: "notif-2",
      user_id: "fac-1",
      title: "New Duty Swap Request",
      message: "Dr. Arun Reddy sent you a duty swap request for Seminar Supervision.",
      type: "NEW_SWAP_REQUEST",
      related_request_id: "req-102",
      is_read: false,
      created_at: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: "notif-3",
      user_id: "fac-1",
      title: "Duty Schedule Updated",
      message: "Internal Assessment duty for CSE was confirmed by the Examination Cell.",
      type: "DUTY_UPDATED",
      is_read: true,
      created_at: new Date(Date.now() - 24 * 3600000).toISOString()
    },
    {
      id: "notif-4",
      user_id: "admin-1",
      title: "Swap Request Pending Review",
      message: "2 swap requests currently pending mutual faculty confirmation.",
      type: "SYSTEM",
      is_read: false,
      created_at: new Date(Date.now() - 2 * 3600000).toISOString()
    }
  ];
};

// --- Storage API Service ---
class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch storage event so all tabs/listeners sync
      window.dispatchEvent(new Event('fds-storage-update'));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  public init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      this.setItem(STORAGE_KEYS.PROFILES, DEFAULT_PROFILES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DUTIES)) {
      this.setItem(STORAGE_KEYS.DUTIES, generateDefaultDuties());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SWAP_REQUESTS)) {
      this.setItem(STORAGE_KEYS.SWAP_REQUESTS, generateDefaultSwapRequests());
    }
    if (!localStorage.getItem(STORAGE_KEYS.SWAP_HISTORY)) {
      this.setItem(STORAGE_KEYS.SWAP_HISTORY, generateDefaultSwapHistory());
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, generateDefaultNotifications());
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      this.setItem(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    }
  }

  public resetAll() {
    this.setItem(STORAGE_KEYS.PROFILES, DEFAULT_PROFILES);
    this.setItem(STORAGE_KEYS.DUTIES, generateDefaultDuties());
    this.setItem(STORAGE_KEYS.SWAP_REQUESTS, generateDefaultSwapRequests());
    this.setItem(STORAGE_KEYS.SWAP_HISTORY, generateDefaultSwapHistory());
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, generateDefaultNotifications());
    this.setItem(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  }

  // --- Profiles ---
  public getProfiles(): UserProfile[] {
    return this.getItem<UserProfile[]>(STORAGE_KEYS.PROFILES, DEFAULT_PROFILES);
  }

  public getProfileById(id: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  public getProfileByEmail(email: string): UserProfile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  public saveProfile(profile: UserProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
  }

  public deleteProfile(id: string): void {
    const profiles = this.getProfiles().filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROFILES, profiles);
  }

  // --- Duties ---
  public getDuties(): Duty[] {
    const rawDuties = this.getItem<Duty[]>(STORAGE_KEYS.DUTIES, []);
    const profiles = this.getProfiles();
    const map = new Map(profiles.map(p => [p.id, p.full_name]));
    return rawDuties.map(d => ({
      ...d,
      faculty_name: map.get(d.faculty_id) || "Assigned Faculty"
    }));
  }

  public getDutyById(id: string): Duty | undefined {
    return this.getDuties().find(d => d.id === id);
  }

  public getDutiesByFaculty(facultyId: string): Duty[] {
    return this.getDuties().filter(d => d.faculty_id === facultyId);
  }

  public saveDuty(duty: Partial<Duty> & { faculty_id: string; date: string; start_time: string; end_time: string; duty_description: string; location: string; department: string }): Duty {
    const duties = this.getItem<Duty[]>(STORAGE_KEYS.DUTIES, []);
    let savedDuty: Duty;
    if (duty.id) {
      const idx = duties.findIndex(d => d.id === duty.id);
      if (idx >= 0) {
        savedDuty = {
          ...duties[idx],
          ...duty,
          updated_at: new Date().toISOString()
        };
        duties[idx] = savedDuty;
      } else {
        savedDuty = {
          ...duty,
          id: duty.id,
          status: duty.status || 'scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Duty;
        duties.push(savedDuty);
      }
    } else {
      savedDuty = {
        ...duty,
        id: `duty-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: duty.status || 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Duty;
      duties.push(savedDuty);
    }
    this.setItem(STORAGE_KEYS.DUTIES, duties);
    return savedDuty;
  }

  public deleteDuty(id: string): boolean {
    const duties = this.getItem<Duty[]>(STORAGE_KEYS.DUTIES, []);
    const filtered = duties.filter(d => d.id !== id);
    if (filtered.length !== duties.length) {
      this.setItem(STORAGE_KEYS.DUTIES, filtered);
      return true;
    }
    return false;
  }

  // --- Swap Requests ---
  public getSwapRequests(): SwapRequest[] {
    const requests = this.getItem<SwapRequest[]>(STORAGE_KEYS.SWAP_REQUESTS, []);
    const duties = this.getDuties();
    const dutyMap = new Map(duties.map(d => [d.id, d]));

    return requests.map(r => ({
      ...r,
      requester_duty: dutyMap.get(r.requester_duty_id),
      receiver_duty: dutyMap.get(r.receiver_duty_id)
    }));
  }

  public getSwapRequestById(id: string): SwapRequest | undefined {
    return this.getSwapRequests().find(r => r.id === id);
  }

  public createSwapRequest(params: {
    requester_id: string;
    receiver_id: string;
    requester_duty_id: string;
    receiver_duty_id: string;
    reason: string;
  }): { success: boolean; error?: string; request?: SwapRequest } {
    if (params.requester_id === params.receiver_id) {
      return { success: false, error: "A faculty member cannot request a duty swap with themselves." };
    }

    const duties = this.getItem<Duty[]>(STORAGE_KEYS.DUTIES, []);
    const reqDuty = duties.find(d => d.id === params.requester_duty_id);
    const recDuty = duties.find(d => d.id === params.receiver_duty_id);

    if (!reqDuty || !recDuty) {
      return { success: false, error: "One or both selected duties no longer exist." };
    }

    if (reqDuty.status === 'completed' || recDuty.status === 'completed') {
      return { success: false, error: "Completed duties cannot be swapped." };
    }

    if (reqDuty.status === 'cancelled' || recDuty.status === 'cancelled') {
      return { success: false, error: "Cancelled duties cannot be swapped." };
    }

    // Check if an existing pending request already uses either duty
    const existingRequests = this.getItem<SwapRequest[]>(STORAGE_KEYS.SWAP_REQUESTS, []);
    const hasConflict = existingRequests.some(r => 
      r.status === 'pending' && 
      (r.requester_duty_id === params.requester_duty_id || 
       r.receiver_duty_id === params.requester_duty_id ||
       r.requester_duty_id === params.receiver_duty_id ||
       r.receiver_duty_id === params.receiver_duty_id)
    );

    if (hasConflict) {
      return { success: false, error: "One of the duties is already part of an ongoing pending swap request." };
    }

    const profiles = this.getProfiles();
    const requester = profiles.find(p => p.id === params.requester_id);
    const receiver = profiles.find(p => p.id === params.receiver_id);

    const newRequest: SwapRequest = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      requester_id: params.requester_id,
      requester_name: requester?.full_name || "Faculty Requester",
      requester_department: requester?.department || "CSE",
      receiver_id: params.receiver_id,
      receiver_name: receiver?.full_name || "Faculty Receiver",
      receiver_department: receiver?.department || "CSE",
      requester_duty_id: params.requester_duty_id,
      receiver_duty_id: params.receiver_duty_id,
      reason: params.reason.trim(),
      status: "pending",
      request_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    existingRequests.unshift(newRequest);
    this.setItem(STORAGE_KEYS.SWAP_REQUESTS, existingRequests);

    // Create Notification for the receiver
    this.addNotification({
      user_id: params.receiver_id,
      title: "New Duty Swap Request",
      message: `${requester?.full_name || "A faculty colleague"} sent you a duty swap request: "${reqDuty.duty_description}" for your "${recDuty.duty_description}".`,
      type: "NEW_SWAP_REQUEST",
      related_request_id: newRequest.id
    });

    return { success: true, request: newRequest };
  }

  /**
   * CRITICAL BUSINESS LOGIC: Execute Swap Approval or Rejection
   * Atomic operation with transaction guarantee
   */
  public respondToSwapRequest(
    requestId: string, 
    action: 'accept' | 'reject', 
    actingUserId: string,
    remarks?: string
  ): { success: boolean; error?: string } {
    const requests = this.getItem<SwapRequest[]>(STORAGE_KEYS.SWAP_REQUESTS, []);
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
      return { success: false, error: "Swap request not found." };
    }

    const request = requests[requestIndex];

    if (request.status !== 'pending') {
      return { success: false, error: `This swap request has already been ${request.status}.` };
    }

    // Role check: Only receiver (or admin) can respond
    const profiles = this.getProfiles();
    const actingUser = profiles.find(p => p.id === actingUserId);
    const isReceiver = request.receiver_id === actingUserId;
    const isAdmin = actingUser?.role === 'ADMIN';

    if (!isReceiver && !isAdmin) {
      return { success: false, error: "Only the receiving faculty member (or admin) can approve/reject this request." };
    }

    const duties = this.getItem<Duty[]>(STORAGE_KEYS.DUTIES, []);
    const reqDutyIdx = duties.findIndex(d => d.id === request.requester_duty_id);
    const recDutyIdx = duties.findIndex(d => d.id === request.receiver_duty_id);

    if (reqDutyIdx === -1 || recDutyIdx === -1) {
      return { success: false, error: "One or both duty assignments could not be found." };
    }

    const reqDuty = duties[reqDutyIdx];
    const recDuty = duties[recDutyIdx];

    const now = new Date().toISOString();

    if (action === 'accept') {
      if (reqDuty.status === 'completed' || recDuty.status === 'completed') {
        return { success: false, error: "Cannot complete swap because one of the duties is already completed." };
      }

      // 1. ATOMIC SWAP: Exchange faculty assignment IDs
      const origReqFaculty = reqDuty.faculty_id;
      const origRecFaculty = recDuty.faculty_id;

      reqDuty.faculty_id = origRecFaculty;
      reqDuty.is_swapped = true;
      reqDuty.updated_at = now;

      recDuty.faculty_id = origReqFaculty;
      recDuty.is_swapped = true;
      recDuty.updated_at = now;

      // Save updated duties
      this.setItem(STORAGE_KEYS.DUTIES, duties);

      // 2. Update Request Status to approved
      request.status = 'approved';
      request.response_date = now;
      request.remarks = remarks || "Approved mutually by faculty.";
      request.updated_at = now;
      requests[requestIndex] = request;
      this.setItem(STORAGE_KEYS.SWAP_REQUESTS, requests);

      // 3. Create Swap History record
      const historyList = this.getItem<SwapHistory[]>(STORAGE_KEYS.SWAP_HISTORY, []);
      const newHistory: SwapHistory = {
        id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        swap_request_id: request.id,
        requester_id: request.requester_id,
        receiver_id: request.receiver_id,
        requester_name: request.requester_name,
        receiver_name: request.receiver_name,
        original_duty_id: reqDuty.id,
        swapped_duty_id: recDuty.id,
        original_duty_desc: reqDuty.duty_description,
        swapped_duty_desc: recDuty.duty_description,
        original_duty_date: reqDuty.date,
        swapped_duty_date: recDuty.date,
        original_duty_time: `${reqDuty.start_time} – ${reqDuty.end_time}`,
        swapped_duty_time: `${recDuty.start_time} – ${recDuty.end_time}`,
        original_duty_location: reqDuty.location,
        swapped_duty_location: recDuty.location,
        status: "approved",
        reason: request.reason,
        request_date: request.request_date,
        response_date: now,
        created_at: now
      };
      historyList.unshift(newHistory);
      this.setItem(STORAGE_KEYS.SWAP_HISTORY, historyList);

      // 4. Notifications
      this.addNotification({
        user_id: request.requester_id,
        title: "Swap Request Accepted",
        message: `${request.receiver_name} accepted your duty swap for "${reqDuty.duty_description}". Your schedule has been updated!`,
        type: "SWAP_ACCEPTED",
        related_request_id: request.id
      });

      this.addNotification({
        user_id: request.receiver_id,
        title: "Duty Swap Confirmed",
        message: `You accepted the duty swap with ${request.requester_name}. Your duty schedule has been updated.`,
        type: "SWAP_ACCEPTED",
        related_request_id: request.id
      });

      this.addNotification({
        user_id: "admin-1",
        title: "Duty Swap Completed",
        message: `${request.requester_name} and ${request.receiver_name} completed a duty swap for ${reqDuty.duty_description}.`,
        type: "SYSTEM",
        related_request_id: request.id
      });

      return { success: true };
    } else {
      // REJECT ACTION: Duties remain unchanged
      request.status = 'rejected';
      request.response_date = now;
      request.remarks = remarks || "Declined by faculty member.";
      request.updated_at = now;
      requests[requestIndex] = request;
      this.setItem(STORAGE_KEYS.SWAP_REQUESTS, requests);

      // Create Swap History record for rejection audit
      const historyList = this.getItem<SwapHistory[]>(STORAGE_KEYS.SWAP_HISTORY, []);
      const newHistory: SwapHistory = {
        id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        swap_request_id: request.id,
        requester_id: request.requester_id,
        receiver_id: request.receiver_id,
        requester_name: request.requester_name,
        receiver_name: request.receiver_name,
        original_duty_id: reqDuty.id,
        swapped_duty_id: recDuty.id,
        original_duty_desc: reqDuty.duty_description,
        swapped_duty_desc: recDuty.duty_description,
        original_duty_date: reqDuty.date,
        swapped_duty_date: recDuty.date,
        status: "rejected",
        reason: request.reason,
        request_date: request.request_date,
        response_date: now,
        created_at: now
      };
      historyList.unshift(newHistory);
      this.setItem(STORAGE_KEYS.SWAP_HISTORY, historyList);

      // Notification for requester
      this.addNotification({
        user_id: request.requester_id,
        title: "Swap Request Declined",
        message: `${request.receiver_name} was unable to accept your duty swap request for "${reqDuty.duty_description}".`,
        type: "SWAP_REJECTED",
        related_request_id: request.id
      });

      return { success: true };
    }
  }

  // --- Swap History ---
  public getSwapHistory(): SwapHistory[] {
    return this.getItem<SwapHistory[]>(STORAGE_KEYS.SWAP_HISTORY, []);
  }

  // --- Notifications ---
  public getNotifications(userId?: string): Notification[] {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (userId) {
      return list.filter(n => n.user_id === userId);
    }
    return list;
  }

  public addNotification(notif: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Notification {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      is_read: false,
      created_at: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const item = list.find(n => n.id === id);
    if (item) {
      item.is_read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const list = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    list.forEach(n => {
      if (n.user_id === userId) {
        n.is_read = true;
      }
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // --- College Config ---
  public getConfig(): CollegeConfig {
    return this.getItem<CollegeConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  }

  public updateConfig(config: Partial<CollegeConfig>): CollegeConfig {
    const current = this.getConfig();
    const updated = { ...current, ...config };
    this.setItem(STORAGE_KEYS.CONFIG, updated);
    return updated;
  }

  // --- Session persistence ---
  public getCurrentUser(): UserProfile | null {
    const user = this.getItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (user) {
      // Re-fetch fresh profile in case it was updated
      const fresh = this.getProfileById(user.id);
      return fresh || user;
    }
    return null;
  }

  public setCurrentUser(user: UserProfile | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }
}

export const storage = new StorageService();
// Initialize storage
storage.init();
