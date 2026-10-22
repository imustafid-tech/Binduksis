import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { DashboardView } from './components/DashboardView';
import { StudentListView } from './components/StudentListView';
import { AcademicView } from './components/AcademicView';
import { AchievementView } from './components/AchievementView';
import { GraduationView } from './components/GraduationView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { StudentPortalView } from './components/StudentPortalView';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { PrintBukuInduk } from './components/PrintBukuInduk';
import { PrintRekapModal } from './components/PrintRekapModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { EditCredentialsModal } from './components/EditCredentialsModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentTab, userSession, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-bounce duration-300 bg-white border-slate-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
          <span className="text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* Authentication Check: If not logged in, show Login Screen */}
      {!userSession.isAuthenticated ? (
        <LoginView />
      ) : (
        <>
          {/* Top Header */}
          <Header />

          {/* Body Layout */}
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
            {/* Sidebar only for Admin TU role */}
            {userSession.role === 'admin' && <Sidebar />}

            {/* Dynamic Main View */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
              {userSession.role === 'siswa' ? (
                <StudentPortalView />
              ) : (
                <>
                  {currentTab === 'dashboard' && <DashboardView />}
                  {currentTab === 'siswa' && <StudentListView />}
                  {currentTab === 'akademik' && <AcademicView />}
                  {currentTab === 'prestasi' && <AchievementView />}
                  {currentTab === 'ijazah' && <GraduationView />}
                  {currentTab === 'cetak' && <StudentListView />}
                  {currentTab === 'backup' && <BackupRestoreView />}
                </>
              )}
            </main>
          </div>

          {/* Global Modals */}
          <StudentFormModal />
          <StudentDetailModal />
          <PrintBukuInduk />
          <PrintRekapModal />
          <SchoolSettingsModal />
          <LogoutConfirmModal />
          <EditCredentialsModal />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
