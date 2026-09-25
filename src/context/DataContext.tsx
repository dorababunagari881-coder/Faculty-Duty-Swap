import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Duty, 
  SwapRequest, 
  SwapHistory, 
  Notification, 
  UserProfile, 
  CollegeConfig 
} from '../types';
import { storage } from '../services/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface DataContextType {
  duties: Duty[];
  swapRequests: SwapRequest[];
  swapHistory: SwapHistory[];
  notifications: Notification[];
  profiles: UserProfile[];
  config: CollegeConfig;
  unreadCount: number;
  
  // CRUD & Operations
  createDuty: (duty: Omit<Duty, 'id' | 'created_at' | 'updated_at'>) => Duty;
  updateDuty: (duty: Partial<Duty> & { id: string }) => Duty;
  deleteDuty: (id: string) => boolean;
  
  createSwapRequest: (params: {
    receiver_id: string;
    requester_duty_id: string;
    receiver_duty_id: string;
    reason: string;
  }) => { success: boolean; error?: string; request?: SwapRequest };
  
  respondSwapRequest: (
    requestId: string, 
    action: 'accept' | 'reject', 
    remarks?: string
  ) => { success: boolean; error?: string };
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  saveFacultyProfile: (profile: UserProfile) => void;
  deleteFacultyProfile: (id: string) => void;
  updateConfig: (newConfig: Partial<CollegeConfig>) => void;
  resetDemoData: () => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [duties, setDuties] = useState<Duty[]>(() => storage.getDuties());
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(() => storage.getSwapRequests());
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>(() => storage.getSwapHistory());
  const [notifications, setNotifications] = useState<Notification[]>(() => storage.getNotifications());
  const [profiles, setProfiles] = useState<UserProfile[]>(() => storage.getProfiles());
  const [config, setConfig] = useState<CollegeConfig>(() => storage.getConfig());

  const refreshData = useCallback(() => {
    setDuties(storage.getDuties());
    setSwapRequests(storage.getSwapRequests());
    setSwapHistory(storage.getSwapHistory());
    setNotifications(storage.getNotifications());
    setProfiles(storage.getProfiles());
    setConfig(storage.getConfig());
  }, []);

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };
    window.addEventListener('fds-storage-update', handleStorageUpdate);
    return () => {
      window.removeEventListener('fds-storage-update', handleStorageUpdate);
    };
  }, [refreshData]);

  // Filter unread notifications for current user
  const unreadCount = user 
    ? notifications.filter(n => n.user_id === user.id && !n.is_read).length 
    : 0;

  // --- Duty actions ---
  const createDuty = (dutyData: Omit<Duty, 'id' | 'created_at' | 'updated_at'>) => {
    const saved = storage.saveDuty(dutyData);
    refreshData();
    showToast("Duty created successfully.", "success");
    return saved;
  };

  const updateDuty = (dutyData: Partial<Duty> & { id: string }) => {
    const existing = storage.getDutyById(dutyData.id);
    if (!existing) throw new Error("Duty not found");
    const merged = { ...existing, ...dutyData };
    const saved = storage.saveDuty(merged);
    refreshData();
    showToast("Duty updated successfully.", "success");
    return saved;
  };

  const deleteDuty = (id: string) => {
    const res = storage.deleteDuty(id);
    if (res) {
      refreshData();
      showToast("Duty removed from schedule.", "info");
      return true;
    }
    return false;
  };

  // --- Swap Request actions ---
  const createSwapRequest = (params: {
    receiver_id: string;
    requester_duty_id: string;
    receiver_duty_id: string;
    reason: string;
  }) => {
    if (!user) {
      return { success: false, error: "You must be signed in to request a swap." };
    }

    const res = storage.createSwapRequest({
      requester_id: user.id,
      receiver_id: params.receiver_id,
      requester_duty_id: params.requester_duty_id,
      receiver_duty_id: params.receiver_duty_id,
      reason: params.reason
    });

    if (res.success) {
      refreshData();
      showToast("Swap request sent successfully.", "success");
    } else {
      showToast(res.error || "Unable to submit the swap request. Please try again.", "error");
    }

    return res;
  };

  const respondSwapRequest = (
    requestId: string, 
    action: 'accept' | 'reject', 
    remarks?: string
  ) => {
    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const res = storage.respondToSwapRequest(requestId, action, user.id, remarks);

    if (res.success) {
      refreshData();
      if (action === 'accept') {
        showToast("Swap request accepted. Duties exchanged & schedule updated!", "success");
      } else {
        showToast("Swap request rejected.", "info");
      }
    } else {
      showToast(res.error || "Failed to process swap request.", "error");
    }

    return res;
  };

  // --- Notifications ---
  const markNotificationRead = (id: string) => {
    storage.markNotificationAsRead(id);
    refreshData();
    showToast("Notification marked as read.", "info");
  };

  const markAllNotificationsRead = () => {
    if (user) {
      storage.markAllNotificationsAsRead(user.id);
      refreshData();
      showToast("All notifications marked as read.", "success");
    }
  };

  // --- Profiles & Config ---
  const saveFacultyProfile = (profile: UserProfile) => {
    storage.saveProfile(profile);
    refreshData();
    showToast("Faculty profile saved.", "success");
  };

  const deleteFacultyProfile = (id: string) => {
    storage.deleteProfile(id);
    refreshData();
    showToast("Faculty profile deleted.", "info");
  };

  const updateCollegeConfig = (newConfig: Partial<CollegeConfig>) => {
    const updated = storage.updateConfig(newConfig);
    setConfig(updated);
    refreshData();
    showToast("College configuration updated.", "success");
  };

  const resetDemoData = () => {
    storage.resetAll();
    refreshData();
    showToast("Demo database successfully reset to clean evaluation state!", "success");
  };

  return (
    <DataContext.Provider
      value={{
        duties,
        swapRequests,
        swapHistory,
        notifications,
        profiles,
        config,
        unreadCount,
        createDuty,
        updateDuty,
        deleteDuty,
        createSwapRequest,
        respondSwapRequest,
        markNotificationRead,
        markAllNotificationsRead,
        saveFacultyProfile,
        deleteFacultyProfile,
        updateConfig: updateCollegeConfig,
        resetDemoData,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
