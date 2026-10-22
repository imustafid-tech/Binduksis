import React, { createContext, useContext, useState, useEffect } from 'react';
import { Siswa, ProfilSekolah, UserSession, BackupData } from '../types/student';
import { INITIAL_STUDENTS, INITIAL_PROFIL_SEKOLAH } from '../data/sampleData';

interface AppContextType {
  students: Siswa[];
  profilSekolah: ProfilSekolah;
  userSession: UserSession;
  setUserSession: (session: UserSession) => void;
  switchRole: (role: 'admin' | 'siswa', studentId?: string) => void;

  currentTab: string;
  setCurrentTab: (tab: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  selectedStudent: Siswa | null;
  setSelectedStudent: (s: Siswa | null) => void;

  editingStudent: Siswa | null;
  setEditingStudent: (s: Siswa | null) => void;

  printingStudent: Siswa | null;
  setPrintingStudent: (s: Siswa | null) => void;

  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;

  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;

  isPrintRekapOpen: boolean;
  setIsPrintRekapOpen: (open: boolean) => void;

  isSchoolSettingsOpen: boolean;
  setIsSchoolSettingsOpen: (open: boolean) => void;

  // Actions
  addStudent: (siswaData: Omit<Siswa, 'id'>) => string;
  updateStudent: (id: string, siswaData: Partial<Siswa>) => void;
  deleteStudent: (id: string) => void;
  updateProfilSekolah: (data: Partial<ProfilSekolah>) => void;
  restoreBackup: (backup: BackupData) => void;
  resetToDefaultData: () => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const STORAGE_KEY_STUDENTS = 'buku_induk_smp_students_v2';
const STORAGE_KEY_SCHOOL = 'buku_induk_smp_school_v2';
const STORAGE_KEY_USER = 'buku_induk_smp_user_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Siswa[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [profilSekolah, setProfilSekolah] = useState<ProfilSekolah>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHOOL);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PROFIL_SEKOLAH;
  });

  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      role: 'admin',
      namaUser: 'Administrator Tata Usaha',
    };
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
  const [editingStudent, setEditingStudent] = useState<Siswa | null>(null);
  const [printingStudent, setPrintingStudent] = useState<Siswa | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState<boolean>(false);
  const [isSchoolSettingsOpen, setIsSchoolSettingsOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(profilSekolah));
    } catch (e) {
      console.error('Failed to save school profile to localStorage', e);
    }
  }, [profilSekolah]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userSession));
    } catch (e) {
      console.error('Failed to save user session to localStorage', e);
    }
  }, [userSession]);

  const switchRole = (role: 'admin' | 'siswa', studentId?: string) => {
    if (role === 'admin') {
      setUserSession({
        role: 'admin',
        namaUser: 'Administrator Tata Usaha',
      });
      showToast('Beralih ke Mode Admin (Akses Penuh)', 'info');
    } else {
      const targetId = studentId || students[0]?.id;
      const targetStudent = students.find((s) => s.id === targetId) || students[0];
      setUserSession({
        role: 'siswa',
        siswaId: targetStudent?.id,
        namaUser: targetStudent ? targetStudent.namaLengkap : 'Siswa',
      });
      showToast(`Beralih ke Portal Siswa: ${targetStudent?.namaLengkap}`, 'info');
    }
  };

  const addStudent = (siswaData: Omit<Siswa, 'id'>): string => {
    const newId = `sis-${Date.now().toString(36)}`;
    const newStudent: Siswa = {
      ...siswaData,
      id: newId,
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Data siswa ${newStudent.namaLengkap} (NIS: ${newStudent.nis}) berhasil disimpan ke Buku Induk!`, 'success');
    return newId;
  };

  const updateStudent = (id: string, siswaData: Partial<Siswa>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...siswaData };
          // If selected student is currently open, update it too
          if (selectedStudent?.id === id) setSelectedStudent(updated);
          return updated;
        }
        return s;
      })
    );
    showToast('Pembaruan data siswa berhasil disimpan!', 'success');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) setSelectedStudent(null);
    showToast(`Data siswa ${target?.namaLengkap || ''} berhasil dihapus dari sistem.`, 'info');
  };

  const updateProfilSekolah = (data: Partial<ProfilSekolah>) => {
    setProfilSekolah((prev) => ({ ...prev, ...data }));
    showToast('Profil sekolah berhasil diperbarui.', 'success');
  };

  const restoreBackup = (backup: BackupData) => {
    if (backup.profilSekolah) {
      setProfilSekolah(backup.profilSekolah);
    }
    if (backup.daftarSiswa && Array.isArray(backup.daftarSiswa)) {
      setStudents(backup.daftarSiswa);
    }
    showToast(`Data cadangan berhasil dipulihkan! (${backup.daftarSiswa.length} siswa)`, 'success');
  };

  const resetToDefaultData = () => {
    setStudents(INITIAL_STUDENTS);
    setProfilSekolah(INITIAL_PROFIL_SEKOLAH);
    showToast('Data telah berhasil direset ke data awal percontohan Kemendikbud.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        profilSekolah,
        userSession,
        setUserSession,
        switchRole,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        selectedStudent,
        setSelectedStudent,
        editingStudent,
        setEditingStudent,
        printingStudent,
        setPrintingStudent,
        isFormOpen,
        setIsFormOpen,
        isDetailOpen,
        setIsDetailOpen,
        isPrintRekapOpen,
        setIsPrintRekapOpen,
        isSchoolSettingsOpen,
        setIsSchoolSettingsOpen,
        addStudent,
        updateStudent,
        deleteStudent,
        updateProfilSekolah,
        restoreBackup,
        resetToDefaultData,
        toast,
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
