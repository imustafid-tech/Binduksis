import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  Award,
  ScrollText,
  Printer,
  Database,
  Building2,
  LogOut,
  KeyRound,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    students,
    setIsFormOpen,
    setEditingStudent,
    setIsSchoolSettingsOpen,
    setIsLogoutConfirmOpen,
    setIsEditCredentialsOpen,
    userSession,
  } = useApp();

  const totalPrestasi = students.reduce((acc, s) => acc + (s.prestasi ? s.prestasi.length : 0), 0);
  const totalLulus = students.filter((s) => s.statusSiswa === 'Lulus').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      fullLabel: 'Dashboard & Ikhtisar',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'siswa',
      label: 'Buku Induk',
      fullLabel: 'Buku Induk Siswa',
      icon: Users,
      badge: students.length,
    },
    {
      id: 'input-siswa',
      label: 'Input Siswa',
      fullLabel: 'Input Siswa Baru',
      icon: UserPlus,
      action: () => {
        setEditingStudent(null);
        setIsFormOpen(true);
      },
    },
    {
      id: 'akademik',
      label: 'Akademik',
      fullLabel: 'Akademik & Rapor',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'prestasi',
      label: 'Prestasi',
      fullLabel: 'Riwayat Prestasi',
      icon: Award,
      badge: totalPrestasi,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'ijazah',
      label: 'Ijazah',
      fullLabel: 'Ijazah SD & SMP',
      icon: ScrollText,
      badge: totalLulus > 0 ? `${totalLulus} Lulus` : null,
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'cetak',
      label: 'Cetak',
      fullLabel: 'Cetak Laporan',
      icon: Printer,
      badge: null,
    },
    {
      id: 'backup',
      label: 'Backup',
      fullLabel: 'Backup & Restore',
      icon: Database,
      badge: null,
    },
    {
      id: 'pengaturan',
      label: 'Sekolah',
      fullLabel: 'Profil Sekolah',
      icon: Building2,
      action: () => {
        setIsSchoolSettingsOpen(true);
      },
    },
    {
      id: 'credentials',
      label: 'Ganti Sandi',
      fullLabel: 'Ubah Sandi & Akun',
      icon: KeyRound,
      action: () => {
        setIsEditCredentialsOpen(true);
      },
    },
    {
      id: 'logout',
      label: 'Logout',
      fullLabel: 'Keluar (Logout)',
      icon: LogOut,
      isLogout: true,
      action: () => {
        setIsLogoutConfirmOpen(true);
      },
    },
  ];

  return (
    <>
      {/* Mobile Top Horizontal Scroll Menu (< md) */}
      <div className="md:hidden no-print w-full bg-white border-b border-slate-200 px-3 py-2 overflow-x-auto flex items-center gap-1.5 shrink-0 z-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isLogout = item.isLogout;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isLogout
                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                  : isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar (>= md) */}
      <aside className="hidden md:flex no-print w-60 lg:w-64 bg-white border-r border-slate-200 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="p-4 border-b border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Administrasi Buku Induk
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isLogout = item.isLogout;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setCurrentTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isLogout
                    ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 mt-2 border-t border-slate-100 pt-3'
                    : isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isLogout
                        ? 'text-rose-500'
                        : isActive
                        ? 'text-emerald-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.fullLabel}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor ||
                      (isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50/70">
          <div className="font-semibold text-slate-700">{userSession.namaUser || 'Petugas TU'}</div>
          <div className="text-slate-500 mt-0.5">Buku Induk Registrasi Siswa</div>
          <div className="text-[10px] text-slate-400 mt-1">Edisi Digital Terpadu v2.4</div>
        </div>
      </aside>
    </>
  );
};
