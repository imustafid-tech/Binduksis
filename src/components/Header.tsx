import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Search,
  UserCheck,
  Shield,
  User,
  Settings,
  PlusCircle,
  Printer,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profilSekolah,
    userSession,
    switchRole,
    students,
    searchQuery,
    setSearchQuery,
    setCurrentTab,
    setIsFormOpen,
    setEditingStudent,
    setIsPrintRekapOpen,
    setIsSchoolSettingsOpen,
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-inner font-bold text-xl shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base tracking-tight truncate text-white">
                    {profilSekolah.namaSekolah}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    NPSN {profilSekolah.npsn}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate hidden sm:block">
                  Sistem Informasi Buku Induk Siswa (Master Register) Standar Kemendikbud
                </p>
              </div>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() && userSession.role === 'admin') {
                    setCurrentTab('siswa');
                  }
                }}
                placeholder="Cari NIS, NISN, NIK, nama siswa, orang tua..."
                className="w-full bg-slate-800/90 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {userSession.role === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setIsFormOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                  title="Tambah Siswa Baru ke Buku Induk"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Input Siswa</span>
                </button>

                <button
                  onClick={() => setIsPrintRekapOpen(true)}
                  className="hidden lg:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                  title="Cetak Laporan Rekapitulasi Data Siswa"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Cetak Rekap</span>
                </button>

                <button
                  onClick={() => setIsSchoolSettingsOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Pengaturan Profil Sekolah & Kepala Sekolah"
                  aria-label="Pengaturan Profil Sekolah"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            ) : null}

            {/* Role Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer transition-colors focus:ring-2 focus:ring-emerald-500"
                aria-label="Ganti Hak Akses Pengguna"
                aria-expanded={isDropdownOpen}
              >
                {userSession.role === 'admin' ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hak Akses:</span> Admin TU
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Portal:</span> Siswa
                  </div>
                )}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-68 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Simulasi Hak Akses Pengguna
                  </div>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                      userSession.role === 'admin' ? 'text-emerald-400 font-bold bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-semibold">Administrator Tata Usaha</div>
                        <div className="text-[10px] text-slate-400">Akses penuh input, edit & kelola</div>
                      </div>
                    </div>
                    {userSession.role === 'admin' && <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                  </button>

                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-t border-slate-800 mt-1">
                    Masuk Sebagai Siswa:
                  </div>

                  <div className="max-h-52 overflow-y-auto">
                    {students.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          switchRole('siswa', s.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                          userSession.role === 'siswa' && userSession.siswaId === s.id
                            ? 'text-cyan-400 font-bold bg-slate-800/50'
                            : 'text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium truncate">{s.namaLengkap}</div>
                          <div className="text-[10px] text-slate-400">
                            NIS: {s.nis} • Kelas {s.rombelSaatIni}
                          </div>
                        </div>
                        {userSession.role === 'siswa' && userSession.siswaId === s.id && (
                          <UserCheck className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
