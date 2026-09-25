import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PresentationGuideBanner } from './components/PresentationGuideBanner';
import { LoginPage } from './pages/LoginPage';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { MyDutiesPage } from './pages/MyDutiesPage';
import { DutySchedulePage } from './pages/DutySchedulePage';
import { SwapRequestsPage } from './pages/SwapRequestsPage';
import { SwapHistoryPage } from './pages/SwapHistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminFacultyPage } from './pages/AdminFacultyPage';
import { AdminDutiesPage } from './pages/AdminDutiesPage';
import { AdminSwapRequestsPage } from './pages/AdminSwapRequestsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

function AppContent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { config } = useData();

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return isAdmin ? 'admin/dashboard' : 'faculty/dashboard';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync default page on login/role change
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin && !currentPage.startsWith('admin') && currentPage !== 'profile') {
        setCurrentPage('admin/dashboard');
      } else if (!isAdmin && currentPage.startsWith('admin')) {
        setCurrentPage('faculty/dashboard');
      }
    }
  }, [isAdmin, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(role) => {
          setCurrentPage(role === 'ADMIN' ? 'admin/dashboard' : 'faculty/dashboard');
        }}
      />
    );
  }

  // Determine current page title
  const getPageMeta = (page: string) => {
    switch (page) {
      case 'faculty/dashboard':
        return { title: 'Faculty Dashboard', subtitle: 'Academic supervision and swap overview' };
      case 'faculty/duties':
        return { title: 'My Duties', subtitle: 'Manage your individual duty schedule' };
      case 'faculty/schedule':
        return { title: 'Duty Schedule', subtitle: 'Institutional calendar & event roster' };
      case 'faculty/swap-requests':
        return { title: 'Swap Requests', subtitle: 'Review and propose duty exchanges' };
      case 'faculty/swap-history':
        return { title: 'Swap History', subtitle: 'Audit log of completed duty exchanges' };
      case 'faculty/notifications':
        return { title: 'Notifications', subtitle: 'Alerts, swap confirmations, and updates' };
      case 'profile':
        return { title: 'User Profile', subtitle: 'Faculty directory details' };
      case 'admin/dashboard':
        return { title: 'Administration Dashboard', subtitle: 'College-wide faculty duty metrics' };
      case 'admin/faculty':
        return { title: 'Faculty Directory', subtitle: 'Academic staff management' };
      case 'admin/duties':
        return { title: 'Institutional Duties', subtitle: 'Master duty schedule editor' };
      case 'admin/schedule':
        return { title: 'Institutional Schedule', subtitle: 'College-wide calendar and roster' };
      case 'admin/swap-requests':
        return { title: 'Institutional Swap Requests', subtitle: 'Administrative swap transaction monitoring' };
      case 'admin/swap-history':
        return { title: 'Institutional Swap History', subtitle: 'College-wide swap audit records' };
      case 'admin/reports':
        return { title: 'Reports & Analytics', subtitle: 'Compliance reporting and CSV exports' };
      case 'admin/notifications':
        return { title: 'Admin Notifications', subtitle: 'Institutional activity alerts' };
      case 'admin/settings':
        return { title: 'Portal Settings', subtitle: 'College identity and database configuration' };
      default:
        return { title: 'Faculty Duty Swap', subtitle: config.collegeName };
    }
  };

  const { title, subtitle } = getPageMeta(currentPage);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Evaluator Presentation Guide Banner */}
      <PresentationGuideBanner onNavigate={setCurrentPage} />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Top Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            title={title}
            subtitle={subtitle}
            onNavigate={setCurrentPage}
            currentPage={currentPage}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* Faculty Pages */}
            {currentPage === 'faculty/dashboard' && (
              <FacultyDashboard onNavigate={setCurrentPage} />
            )}
            {currentPage === 'faculty/duties' && <MyDutiesPage />}
            {currentPage === 'faculty/schedule' && <DutySchedulePage />}
            {currentPage === 'faculty/swap-requests' && <SwapRequestsPage />}
            {currentPage === 'faculty/swap-history' && <SwapHistoryPage />}
            {currentPage === 'faculty/notifications' && (
              <NotificationsPage onNavigate={setCurrentPage} />
            )}

            {/* Profile Page */}
            {currentPage === 'profile' && <ProfilePage />}

            {/* Admin Pages (Protected) */}
            {currentPage === 'admin/dashboard' && (
              <AdminDashboard onNavigate={setCurrentPage} />
            )}
            {currentPage === 'admin/faculty' && <AdminFacultyPage />}
            {currentPage === 'admin/duties' && <AdminDutiesPage />}
            {currentPage === 'admin/schedule' && <DutySchedulePage />}
            {currentPage === 'admin/swap-requests' && <AdminSwapRequestsPage />}
            {currentPage === 'admin/swap-history' && <SwapHistoryPage />}
            {currentPage === 'admin/reports' && <AdminReportsPage />}
            {currentPage === 'admin/notifications' && (
              <NotificationsPage onNavigate={setCurrentPage} />
            )}
            {currentPage === 'admin/settings' && <AdminSettingsPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
