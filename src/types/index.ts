export type UserRole = 'FACULTY' | 'ADMIN';

export type DutyStatus = 'scheduled' | 'completed' | 'swapped' | 'cancelled';

export type SwapRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type NotificationType = 
  | 'NEW_SWAP_REQUEST' 
  | 'SWAP_ACCEPTED' 
  | 'SWAP_REJECTED' 
  | 'DUTY_UPDATED' 
  | 'SYSTEM';

export interface UserProfile {
  id: string;
  full_name: string;
  faculty_id: string;
  email: string;
  department: string;
  phone: string;
  role: UserRole;
  designation: string;
  avatar_url?: string;
  status: 'active' | 'on_leave' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Duty {
  id: string;
  faculty_id: string;
  faculty_name?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // e.g. "09:00 AM"
  end_time: string; // e.g. "11:00 AM"
  duty_description: string;
  location: string;
  department: string;
  status: DutyStatus;
  is_swapped?: boolean;
  original_faculty_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SwapRequest {
  id: string;
  requester_id: string;
  requester_name: string;
  requester_department: string;
  receiver_id: string;
  receiver_name: string;
  receiver_department: string;
  requester_duty_id: string;
  receiver_duty_id: string;
  requester_duty?: Duty;
  receiver_duty?: Duty;
  reason: string;
  status: SwapRequestStatus;
  request_date: string;
  response_date?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface SwapHistory {
  id: string;
  swap_request_id: string;
  requester_id: string;
  receiver_id: string;
  requester_name: string;
  receiver_name: string;
  original_duty_id: string;
  swapped_duty_id: string;
  original_duty_desc: string;
  swapped_duty_desc: string;
  original_duty_date: string;
  swapped_duty_date: string;
  original_duty_time?: string;
  swapped_duty_time?: string;
  original_duty_location?: string;
  swapped_duty_location?: string;
  status: 'approved' | 'rejected';
  reason: string;
  request_date: string;
  response_date: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_request_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface CollegeConfig {
  collegeName: string;
  collegeShortName: string;
  tagline: string;
  academicYear: string;
  departments: string[];
  locations: string[];
  dutyTypes: string[];
}
