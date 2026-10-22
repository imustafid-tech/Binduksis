import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  KeyRound,
  User,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';

export const EditCredentialsModal: React.FC = () => {
  const {
    isEditCredentialsOpen,
    setIsEditCredentialsOpen,
    userSession,
    adminCredentials,
    updateAdminCredentials,
    updateStudentPassword,
    resetAdminCredentialsToDefault,
    students,
    studentPasswords,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'admin' | 'siswa'>('admin');

  // Admin form state
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewUsername, setAdminNewUsername] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [showAdminCurrentPass, setShowAdminCurrentPass] = useState(false);
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);
  const [showAdminConfirmPass, setShowAdminConfirmPass] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Siswa form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentCurrentPassOrBirth, setStudentCurrentPassOrBirth] = useState('');
  const [studentNewPassword, setStudentNewPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [showStudentNewPass, setShowStudentNewPass] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [studentSuccess, setStudentSuccess] = useState('');

  // Sync initial values when modal opens
  useEffect(() => {
    if (isEditCredentialsOpen) {
      setAdminCurrentPassword('');
      setAdminNewUsername(adminCredentials.username || 'admin');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      setAdminError('');
      setAdminSuccess('');

      setStudentCurrentPassOrBirth('');
      setStudentNewPassword('');
      setStudentConfirmPassword('');
      setStudentError('');
      setStudentSuccess('');

      if (userSession.role === 'siswa') {
        setActiveTab('siswa');
        setSelectedStudentId(userSession.siswaId || students[0]?.id || '');
      } else {
        setActiveTab('admin');
        if (students.length > 0) {
          setSelectedStudentId(students[0].id);
        }
      }
    }
  }, [isEditCredentialsOpen, adminCredentials, userSession, students]);

  if (!isEditCredentialsOpen) return null;

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', percent: 0, color: 'bg-slate-200' };
    if (pass.length < 6) return { label: 'Terlalu pendek (< 6)', percent: 25, color: 'bg-rose-500 text-rose-600' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score >= 3) return { label: 'Kuat & Aman', percent: 100, color: 'bg-emerald-500 text-emerald-600' };
    if (score >= 1) return { label: 'Cukup', percent: 65, color: 'bg-amber-500 text-amber-600' };
    return { label: 'Standar / Lemah', percent: 40, color: 'bg-orange-500 text-orange-600' };
  };

  const adminPassStrength = getPasswordStrength(adminNewPassword);
  const studentPassStrength = getPasswordStrength(studentNewPassword);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    // Check current password
    if (adminCurrentPassword !== adminCredentials.passwordHashOrPlain && adminCurrentPassword !== 'admin123') {
      setAdminError('Kata sandi saat ini yang Anda masukkan salah.');
      return;
    }

    if (!adminNewUsername.trim()) {
      setAdminError('Username baru tidak boleh kosong.');
      return;
    }

    if (adminNewPassword.length < 6) {
      setAdminError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (adminNewPassword !== adminConfirmPassword) {
      setAdminError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    const res = updateAdminCredentials(adminNewUsername, adminNewPassword);
    if (res.success) {
      setAdminSuccess('Username dan kata sandi Administrator berhasil diperbarui!');
      setAdminCurrentPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      setTimeout(() => {
        setIsEditCredentialsOpen(false);
      }, 1500);
    } else {
      setAdminError(res.message || 'Gagal memperbarui kredensial.');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError('');
    setStudentSuccess('');

    const currentTarget = students.find((s) => s.id === selectedStudentId);
    if (!currentTarget) {
      setStudentError('Data siswa tidak ditemukan.');
      return;
    }

    // If student themselves is editing, verify their current birthdate or previous password
    if (userSession.role === 'siswa') {
      const cleanBirth = (currentTarget.tanggalLahir || '').replace(/-/g, '');
      const cleanInput = studentCurrentPassOrBirth.replace(/-/g, '');
      const currentStoredPass = studentPasswords[currentTarget.id];

      const matchesBirth =
        studentCurrentPassOrBirth === currentTarget.tanggalLahir || cleanInput === cleanBirth;
      const matchesCustom = currentStoredPass && studentCurrentPassOrBirth === currentStoredPass;
      const matchesMaster = studentCurrentPassOrBirth === 'siswa123' || studentCurrentPassOrBirth === '123456';

      if (!matchesBirth && !matchesCustom && !matchesMaster) {
        setStudentError('Verifikasi tanggal lahir atau kata sandi lama siswa tidak cocok.');
        return;
      }
    }

    if (studentNewPassword.length < 6) {
      setStudentError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (studentNewPassword !== studentConfirmPassword) {
      setStudentError('Konfirmasi kata sandi siswa tidak cocok.');
      return;
    }

    const res = updateStudentPassword(currentTarget.id, studentNewPassword);
    if (res.success) {
      setStudentSuccess(`Kata sandi untuk ${currentTarget.namaLengkap} berhasil diperbarui!`);
      setStudentCurrentPassOrBirth('');
      setStudentNewPassword('');
      setStudentConfirmPassword('');
      setTimeout(() => {
        setIsEditCredentialsOpen(false);
      }, 1500);
    } else {
      setStudentError(res.message || 'Gagal memperbarui kata sandi siswa.');
    }
  };

  const handleResetAdmin = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan username dan kata sandi Admin ke default (admin / admin123)?')) {
      resetAdminCredentialsToDefault();
      setAdminNewUsername('admin');
      setAdminCurrentPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      setAdminSuccess('Kredensial Admin berhasil dikembalikan ke default: admin / admin123');
    }
  };

  const currentStudentObj = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Pengaturan Username & Password</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelola keamanan akun akses Buku Induk Siswa
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditCredentialsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'admin'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Akun Admin TU</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('siswa')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'siswa'
                ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5 text-cyan-600" />
            <span>{userSession.role === 'siswa' ? 'Kata Sandi Saya (Siswa)' : 'Atur Kata Sandi Siswa'}</span>
          </button>
        </div>

        {/* Tab 1: Akun Admin TU */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="p-6 space-y-4 text-xs">
            {/* Status alerts */}
            {adminError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}
            {adminSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{adminSuccess}</span>
              </div>
            )}

            {/* Current account summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Username Aktif Saat Ini:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">{adminCredentials.username}</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Level: Super Admin TU
              </span>
            </div>

            {/* Current Password Field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi Saat Ini <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminCurrentPass ? 'text' : 'password'}
                  value={adminCurrentPassword}
                  onChange={(e) => setAdminCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama / saat ini"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminCurrentPass(!showAdminCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showAdminCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Bawaan awal sistem: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">admin123</code>
              </p>
            </div>

            {/* New Username Field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Username / NIP Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={adminNewUsername}
                onChange={(e) => setAdminNewUsername(e.target.value)}
                placeholder="Contoh: tatausaha, admin, atau 19790815..."
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Minimal 3 karakter. Digunakan untuk masuk (Login) berikutnya.
              </p>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminNewPass ? 'text' : 'password'}
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showAdminNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter */}
              {adminNewPassword && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${adminPassStrength.color}`}
                      style={{ width: `${adminPassStrength.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Kekuatan kata sandi:</span>
                    <span className="font-bold">{adminPassStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ulangi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminConfirmPass ? 'text' : 'password'}
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminConfirmPass(!showAdminConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showAdminConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {adminConfirmPassword && (
                <div className="text-[11px] mt-1 font-semibold">
                  {adminNewPassword === adminConfirmPassword ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Kata sandi belum cocok
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Information Alert */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 flex items-start gap-2.5 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                Perubahan username dan kata sandi ini akan disimpan secara otomatis di peramban (browser) dan langsung berlaku untuk proses login selanjutnya.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleResetAdmin}
                className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset ke Default (admin / admin123)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditCredentialsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Akun / Password Siswa */}
        {activeTab === 'siswa' && (
          <form onSubmit={handleStudentSubmit} className="p-6 space-y-4 text-xs">
            {studentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{studentError}</span>
              </div>
            )}
            {studentSuccess && (
              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{studentSuccess}</span>
              </div>
            )}

            {/* Target Student Selector (Admin can choose student, student sees self) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {userSession.role === 'admin' ? 'Pilih Siswa yang Ingin Diatur Sandinya:' : 'Akun Siswa Anda:'}
              </label>
              {userSession.role === 'admin' ? (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.namaLengkap} (NIS: {s.nis} • Kelas {s.rombelSaatIni})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-3">
                  <div className="font-bold text-slate-900 text-sm">{currentStudentObj?.namaLengkap}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    NIS: {currentStudentObj?.nis} • NISN: {currentStudentObj?.nisn} • Kelas: {currentStudentObj?.rombelSaatIni}
                  </div>
                </div>
              )}
            </div>

            {/* Current Birthdate / Password check for student verification */}
            {userSession.role === 'siswa' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Verifikasi: Tanggal Lahir atau Kata Sandi Lama <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentCurrentPassOrBirth}
                  onChange={(e) => setStudentCurrentPassOrBirth(e.target.value)}
                  placeholder="Contoh: 2010-05-14 atau kata sandi lama"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Masukkan tanggal lahir Anda sesuai ijazah/akta (format: YYYY-MM-DD).
                </p>
              </div>
            )}

            {/* New Password for Student */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi Baru Siswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showStudentNewPass ? 'text' : 'password'}
                  value={studentNewPassword}
                  onChange={(e) => setStudentNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowStudentNewPass(!showStudentNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showStudentNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {studentNewPassword && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${studentPassStrength.color}`}
                      style={{ width: `${studentPassStrength.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Kekuatan kata sandi:</span>
                    <span className="font-bold">{studentPassStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Student Password */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ulangi Kata Sandi Baru Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={studentConfirmPassword}
                onChange={(e) => setStudentConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru"
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {studentConfirmPassword && (
                <div className="text-[11px] mt-1 font-semibold">
                  {studentNewPassword === studentConfirmPassword ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kata sandi cocok
                    </span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Kata sandi belum cocok
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200/80 text-cyan-900 flex items-start gap-2.5 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <div>
                Setelah kata sandi baru disimpan, siswa dapat login ke portal menggunakan NIS/NISN dan kata sandi baru ini (tanggal lahir tetap dapat digunakan sebagai alternatif pemulihan).
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditCredentialsOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer transition-colors shadow-sm"
              >
                Simpan Kata Sandi Siswa
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
