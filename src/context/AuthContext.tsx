import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { storage } from '../services/storage';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchUser: (email: string) => void;
  updateCurrentProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => storage.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // If no user is logged in initially, pre-login Dr. Rajesh Kumar for immediate smooth viewing or let them choose
    if (!user) {
      const defaultUser = storage.getProfileByEmail('faculty@rgmcet.edu.in');
      if (defaultUser) {
        setUser(defaultUser);
        storage.setCurrentUser(defaultUser);
      }
    }
  }, []);

  const login = async (email: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate slight natural async verification
    await new Promise(r => setTimeout(r, 250));

    const matchedProfile = storage.getProfileByEmail(email.trim());

    if (!matchedProfile) {
      setIsLoading(false);
      return { success: false, error: "Invalid faculty ID or email address. Use demo accounts provided." };
    }

    if (role && matchedProfile.role !== role) {
      setIsLoading(false);
      return { success: false, error: `Account exists but role is ${matchedProfile.role}, not ${role}.` };
    }

    setUser(matchedProfile);
    storage.setCurrentUser(matchedProfile);
    setIsLoading(false);
    showToast(`Welcome back, ${matchedProfile.full_name}!`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
    showToast("Signed out successfully.", 'info');
  };

  const quickSwitchUser = (email: string) => {
    const target = storage.getProfileByEmail(email);
    if (target) {
      setUser(target);
      storage.setCurrentUser(target);
      showToast(`Switched user context to ${target.full_name} (${target.role})`, 'info');
    }
  };

  const updateCurrentProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updated);
    storage.saveProfile(updated);
    storage.setCurrentUser(updated);
    showToast("Profile updated successfully.", 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        login,
        logout,
        quickSwitchUser,
        updateCurrentProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
