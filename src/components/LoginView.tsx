import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  HelpCircle,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAdmin, loginSiswa, students, profilSekolah, adminCredentials } = useApp();

  const [loginRole, setLoginRole] = useState<'admin' | 'siswa'>('admin');

  // Admin form state
  const [adminUsername, setAdminUsername] = useState(adminCredentials.username || 'admin');
  const [adminPassword, setAdminPassword] = useState(adminCredentials.passwordHashOrPlain || 'admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);

  // Siswa form state
  const [studentId, setStudentId] = useState(students[0]?.nis || '230101');
  const [studentPassword, setStudentPassword] = useState(students[0]?.tanggalLahir || '2010-05-14');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Feedback error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = loginAdmin(adminUsername, adminPassword);
    if (!result.success) {
      setErrorMsg(result.message || 'Login gagal.');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = loginSiswa(studentId, studentPassword);
    if (!result.success) {
      setErrorMsg(result.message || 'Login siswa gagal.');
    }
  };

  const handleQuickStudentSelect = (sId: string) => {
    const s = students.find((st) => st.id === sId);
    if (s) {
      setStudentId(s.nis);
      setStudentPassword(s.tanggalLahir);
      setErrorMsg(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: Brand Banner */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white shadow-md shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                  Kemendikbudristek RI
                </span>
                <h2 className="font-extrabold text-base tracking-tight leading-tight">
                  {profilSekolah.namaSekolah}
                </h2>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sistem e-Buku Induk Resmi
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Buku Induk Registrasi Siswa SMP
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Catatan induk digital lengkap: identitas diri, data orang tua & wali, nilai rapor, riwayat prestasi, serta nomor ijazah SD dan SMP.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              <span>NPSN: {profilSekolah.npsn} • Akreditasi {profilSekolah.akreditasi}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Edisi Administrasi Sekolah Digital • Versi 2.4 Terpadu
            </p>
          </div>

          {/* Decorative watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
            <GraduationCap className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Masuk ke Sistem</h3>
                <p className="text-xs text-slate-500">Pilih jenis akun hak akses Anda</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600">
                Aman & Terenkripsi
              </span>
            </div>

            {/* Role Tab Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl my-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginRole === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin / Tata Usaha</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginRole('siswa');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  loginRole === 'siswa'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Portal Siswa</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FORM 1: ADMIN LOGIN */}
            {loginRole === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username / NIP Petugas TU
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin atau NIP"
                      className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Kata Sandi</label>
                    <span className="text-[10px] text-slate-400 font-mono">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 pl-9 pr-10 py-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberAdmin}
                      onChange={(e) => setRememberAdmin(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>Ingat sesi saya</span>
                  </label>
                  <span className="text-emerald-700 font-semibold text-[11px] cursor-pointer hover:underline">
                    Bantuan Petugas TU
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk sebagai Administrator TU</span>
                </button>

                {/* Quick demo autofill */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Akun Aktif: <strong className="text-slate-800">{adminCredentials.username}</strong> / <strong className="text-slate-800">{adminCredentials.passwordHashOrPlain}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername(adminCredentials.username);
                      setAdminPassword(adminCredentials.passwordHashOrPlain);
                      loginAdmin(adminCredentials.username, adminCredentials.passwordHashOrPlain);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    ⚡ Masuk Cepat
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: SISWA LOGIN */}
            {loginRole === 'siswa' && (
              <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Induk Siswa (NIS) atau NISN (10 Digit)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Contoh: 230101 atau 0098273641"
                      className="w-full bg-slate-50 border border-slate-300 pl-9 pr-3 py-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-mono font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Tanggal Lahir (YYYY-MM-DD atau PIN)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Bisa pakai: siswa123</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Contoh: 2010-05-14 atau siswa123"
                      className="w-full bg-slate-50 border border-slate-300 pl-9 pr-10 py-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Quick Student Selector for Demo */}
                <div className="bg-cyan-50/50 p-2.5 rounded-xl border border-cyan-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-cyan-900 block">Pilih Akun Siswa Demo Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {students.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleQuickStudentSelect(s.id)}
                        className={`text-[10px] px-2 py-1 rounded font-semibold transition-colors cursor-pointer border ${
                          studentId === s.nis
                            ? 'bg-cyan-600 text-white border-cyan-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-100'
                        }`}
                      >
                        {s.namaPanggilan || s.namaLengkap.split(' ')[0]} ({s.nis})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Portal Siswa</span>
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 text-center text-[10px] text-slate-400 border-t border-slate-100 mt-4">
            Akses hanya untuk Petugas Tata Usaha dan Peserta Didik terdaftar. Data dilindungi kerahasiaannya.
          </div>
        </div>
      </div>
    </div>
  );
};
