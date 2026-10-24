import React, { createContext, useContext, useState, useEffect } from 'react';
import { Siswa, ProfilSekolah, UserSession, BackupData, AdminCredentials, StudentPasswordMap, RaporSemester } from '../types/student';
import { INITIAL_STUDENTS, INITIAL_PROFIL_SEKOLAH } from '../data/sampleData';
import { authenticateAdmin, authenticateStudent, validateNewUsername, validateNewPassword } from '../utils/studentLogic';

interface AppContextType {
  students: Siswa[];
  profilSekolah: ProfilSekolah;
  userSession: UserSession;
  setUserSession: (session: UserSession) => void;
  switchRole: (role: 'admin' | 'siswa', studentId?: string) => void;

  // Auth actions & Credentials
  adminCredentials: AdminCredentials;
  studentPasswords: StudentPasswordMap;
  loginAdmin: (username: string, password: string) => { success: boolean; message?: string };
  loginSiswa: (identifier: string, passwordOrBirthdate: string) => { success: boolean; message?: string };
  logout: () => void;
  isLogoutConfirmOpen: boolean;
  setIsLogoutConfirmOpen: (open: boolean) => void;

  // Edit credentials modal
  isEditCredentialsOpen: boolean;
  setIsEditCredentialsOpen: (open: boolean) => void;
  updateAdminCredentials: (newUsername: string, newPassword: string) => { success: boolean; message?: string };
  updateStudentPassword: (studentId: string, newPassword: string) => { success: boolean; message?: string };
  resetAdminCredentialsToDefault: () => void;

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

  // Upload modals & deploy guide
  isStudentUploadOpen: boolean;
  setIsStudentUploadOpen: (open: boolean) => void;
  isAcademicUploadOpen: boolean;
  setIsAcademicUploadOpen: (open: boolean) => void;
  isDeployGuideOpen: boolean;
  setIsDeployGuideOpen: (open: boolean) => void;

  // Actions
  addStudent: (siswaData: Omit<Siswa, 'id'>) => string;
  updateStudent: (id: string, siswaData: Partial<Siswa>) => void;
  deleteStudent: (id: string) => void;
  bulkAddStudents: (newStudents: Omit<Siswa, 'id'>[], updateExisting?: boolean) => { added: number; updated: number };
  bulkUpdateGrades: (updates: { studentId: string; semesterRecord: RaporSemester }[]) => { updated: number };
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
const STORAGE_KEY_ADMIN_CREDS = 'buku_induk_smp_admin_creds_v2';
const STORAGE_KEY_STUDENT_PASSWORDS = 'buku_induk_smp_student_passwords_v2';

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  username: 'admin',
  passwordHashOrPlain: 'admin123',
};

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

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_CREDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.passwordHashOrPlain) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN_CREDS;
  });

  const [studentPasswords, setStudentPasswords] = useState<StudentPasswordMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT_PASSWORDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isAuthenticated === 'boolean') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return {
      isAuthenticated: true,
      role: 'admin',
      namaUser: 'Dra. Hj. Sri Wahyuni, M.M.',
      usernameOrNip: '19790815 200501 2 007',
      loginTime: '07:30',
    };
  });

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isEditCredentialsOpen, setIsEditCredentialsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Siswa | null>(null);
  const [editingStudent, setEditingStudent] = useState<Siswa | null>(null);
  const [printingStudent, setPrintingStudent] = useState<Siswa | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState<boolean>(false);
  const [isSchoolSettingsOpen, setIsSchoolSettingsOpen] = useState<boolean>(false);
  const [isStudentUploadOpen, setIsStudentUploadOpen] = useState<boolean>(false);
  const [isAcademicUploadOpen, setIsAcademicUploadOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_CREDS, JSON.stringify(adminCredentials));
    } catch (e) {
      console.error('Failed to save admin credentials to localStorage', e);
    }
  }, [adminCredentials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT_PASSWORDS, JSON.stringify(studentPasswords));
    } catch (e) {
      console.error('Failed to save student passwords to localStorage', e);
    }
  }, [studentPasswords]);

  const loginAdmin = (username: string, password: string): { success: boolean; message?: string } => {
    const result = authenticateAdmin(username, password, adminCredentials);
    if (!result.success) {
      showToast(result.message || 'Login gagal.', 'error');
      return result;
    }
    const session: UserSession = {
      isAuthenticated: true,
      role: 'admin',
      namaUser: profilSekolah.namaPetugasTataUsaha || 'Administrator Tata Usaha',
      usernameOrNip: username,
      loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setUserSession(session);
    showToast(`Selamat datang, ${session.namaUser}! Anda masuk sebagai Administrator TU.`, 'success');
    return { success: true };
  };

  const loginSiswa = (identifier: string, passwordOrBirthdate: string): { success: boolean; message?: string } => {
    const result = authenticateStudent(students, identifier, passwordOrBirthdate, studentPasswords);
    if (!result.success || !result.student) {
      showToast(result.message || 'Login siswa gagal.', 'error');
      return { success: false, message: result.message };
    }
    const targetStudent = result.student;
    const session: UserSession = {
      isAuthenticated: true,
      role: 'siswa',
      siswaId: targetStudent.id,
      namaUser: targetStudent.namaLengkap,
      usernameOrNip: targetStudent.nis,
      avatarUrl: targetStudent.pasFotoUrl,
      loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setUserSession(session);
    showToast(`Selamat datang, ${targetStudent.namaLengkap}!`, 'success');
    return { success: true };
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string): { success: boolean; message?: string } => {
    const valUser = validateNewUsername(newUsername);
    if (!valUser.valid) {
      showToast(valUser.error || 'Username tidak valid.', 'error');
      return { success: false, message: valUser.error };
    }
    const valPass = validateNewPassword(newPassword);
    if (!valPass.valid) {
      showToast(valPass.error || 'Kata sandi tidak valid.', 'error');
      return { success: false, message: valPass.error };
    }

    const updated: AdminCredentials = {
      username: newUsername.trim(),
      passwordHashOrPlain: newPassword.trim(),
      updatedAt: new Date().toISOString(),
    };

    setAdminCredentials(updated);
    if (userSession.role === 'admin') {
      setUserSession((prev) => ({
        ...prev,
        usernameOrNip: updated.username,
      }));
    }
    showToast('Username dan kata sandi Administrator berhasil diperbarui!', 'success');
    return { success: true };
  };

  const updateStudentPassword = (studentId: string, newPassword: string): { success: boolean; message?: string } => {
    const valPass = validateNewPassword(newPassword);
    if (!valPass.valid) {
      showToast(valPass.error || 'Kata sandi tidak valid.', 'error');
      return { success: false, message: valPass.error };
    }
    setStudentPasswords((prev) => ({
      ...prev,
      [studentId]: newPassword.trim(),
    }));
    showToast('Kata sandi login siswa berhasil diperbarui!', 'success');
    return { success: true };
  };

  const resetAdminCredentialsToDefault = () => {
    setAdminCredentials(DEFAULT_ADMIN_CREDS);
    showToast('Kredensial login admin telah direset ke default (admin / admin123).', 'info');
  };


  const logout = () => {
    setUserSession({
      isAuthenticated: false,
      role: 'admin',
      namaUser: '',
    });
    setSelectedStudent(null);
    setEditingStudent(null);
    setPrintingStudent(null);
    setIsFormOpen(false);
    setIsDetailOpen(false);
    setIsPrintRekapOpen(false);
    setIsSchoolSettingsOpen(false);
    showToast('Anda telah berhasil keluar (Logout) dari sistem Buku Induk.', 'info');
  };

  const switchRole = (role: 'admin' | 'siswa', studentId?: string) => {
    if (role === 'admin') {
      setUserSession({
        isAuthenticated: true,
        role: 'admin',
        namaUser: profilSekolah.namaPetugasTataUsaha || 'Administrator Tata Usaha',
        usernameOrNip: profilSekolah.nipPetugasTataUsaha,
      });
      showToast('Beralih ke Akun Administrator TU', 'info');
    } else {
      const targetId = studentId || students[0]?.id;
      const targetStudent = students.find((s) => s.id === targetId) || students[0];
      setUserSession({
        isAuthenticated: true,
        role: 'siswa',
        siswaId: targetStudent?.id,
        namaUser: targetStudent ? targetStudent.namaLengkap : 'Siswa',
        usernameOrNip: targetStudent?.nis,
        avatarUrl: targetStudent?.pasFotoUrl,
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

  const bulkAddStudents = (
    newStudentsData: Omit<Siswa, 'id'>[],
    updateExisting: boolean = true
  ): { added: number; updated: number } => {
    let addedCount = 0;
    let updatedCount = 0;

    setStudents((prev) => {
      const existingMap = new Map<string, Siswa>();
      prev.forEach((s) => existingMap.set(s.nis.trim().toLowerCase(), s));

      const updatedList = [...prev];

      newStudentsData.forEach((newS) => {
        const nisKey = newS.nis.trim().toLowerCase();
        if (existingMap.has(nisKey)) {
          if (updateExisting) {
            const oldStudent = existingMap.get(nisKey)!;
            const merged: Siswa = {
              ...oldStudent,
              ...newS,
              id: oldStudent.id,
              recordsSemester: newS.recordsSemester && newS.recordsSemester.length > 0 ? newS.recordsSemester : oldStudent.recordsSemester,
              prestasi: newS.prestasi && newS.prestasi.length > 0 ? newS.prestasi : oldStudent.prestasi,
            };
            const idx = updatedList.findIndex((item) => item.id === oldStudent.id);
            if (idx !== -1) {
              updatedList[idx] = merged;
            }
            existingMap.set(nisKey, merged);
            updatedCount++;
          }
        } else {
          const freshId = `sis-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
          const fullStudent: Siswa = {
            ...newS,
            id: freshId,
          };
          updatedList.unshift(fullStudent);
          existingMap.set(nisKey, fullStudent);
          addedCount++;
        }
      });

      return updatedList;
    });

    showToast(`Berhasil memproses data siswa: ${addedCount} baru ditambahkan, ${updatedCount} diperbarui.`, 'success');
    return { added: addedCount, updated: updatedCount };
  };

  const bulkUpdateGrades = (
    updates: { studentId: string; semesterRecord: RaporSemester }[]
  ): { updated: number } => {
    let count = 0;

    setStudents((prev) =>
      prev.map((s) => {
        const targetUpdate = updates.find((u) => u.studentId === s.id);
        if (!targetUpdate) return s;

        const currentRecords = [...(s.recordsSemester || [])];
        const recordIndex = currentRecords.findIndex(
          (r) => r.semester === targetUpdate.semesterRecord.semester
        );

        if (recordIndex >= 0) {
          currentRecords[recordIndex] = targetUpdate.semesterRecord;
        } else {
          currentRecords.push(targetUpdate.semesterRecord);
          currentRecords.sort((a, b) => a.semester - b.semester);
        }

        count++;
        return {
          ...s,
          recordsSemester: currentRecords,
        };
      })
    );

    showToast(`Berhasil mengunggah & memperbarui nilai rapor ${updates.length} siswa!`, 'success');
    return { updated: count };
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
        adminCredentials,
        studentPasswords,
        loginAdmin,
        loginSiswa,
        logout,
        isLogoutConfirmOpen,
        setIsLogoutConfirmOpen,
        isEditCredentialsOpen,
        setIsEditCredentialsOpen,
        updateAdminCredentials,
        updateStudentPassword,
        resetAdminCredentialsToDefault,
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
        isStudentUploadOpen,
        setIsStudentUploadOpen,
        isAcademicUploadOpen,
        setIsAcademicUploadOpen,
        isDeployGuideOpen,
        setIsDeployGuideOpen,
        addStudent,
        bulkAddStudents,
        bulkUpdateGrades,
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
