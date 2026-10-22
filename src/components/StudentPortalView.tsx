import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTanggalIndo, calculateCumulativeAverage } from '../utils/studentLogic';
import {
  GraduationCap,
  Printer,
  User,
  BookOpen,
  Award,
  ScrollText,
  Phone,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Shield,
  LogOut,
  KeyRound,
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const {
    students,
    userSession,
    switchRole,
    setPrintingStudent,
    setIsLogoutConfirmOpen,
    setIsEditCredentialsOpen,
    updateStudent,
    profilSekolah,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buku-induk' | 'rapor' | 'prestasi' | 'ijazah' | 'revisi'>('buku-induk');

  // Request revision state
  const [revisionCatatan, setRevisionCatatan] = useState('');
  const [newNoHp, setNewNoHp] = useState('');
  const [newAlamat, setNewAlamat] = useState('');

  // Find the current logged in student
  const student = students.find((s) => s.id === userSession.siswaId) || students[0];

  if (!student) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500">Data siswa tidak ditemukan.</p>
        <button
          onClick={() => switchRole('admin')}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
        >
          Kembali ke Mode Admin
        </button>
      </div>
    );
  }

  const cumAvg = calculateCumulativeAverage(student.recordsSemester || []);

  const handleKirimRevisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionCatatan.trim() && !newNoHp.trim() && !newAlamat.trim()) {
      showToast('Harap masukkan data yang ingin diperbarui', 'error');
      return;
    }

    const updates: any = {};
    if (newNoHp.trim()) updates.noHpSiswa = newNoHp;
    if (newAlamat.trim()) updates.alamat = newAlamat;
    if (revisionCatatan.trim()) {
      updates.catatanTambahan = `${student.catatanTambahan || ''} [Permintaan Revisi Siswa]: ${revisionCatatan}`.trim();
    }

    updateStudent(student.id, updates);
    setRevisionCatatan('');
    setNewNoHp('');
    setNewAlamat('');
    showToast('Permintaan pembaruan data berhasil disampaikan ke Tata Usaha Buku Induk!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {student.pasFotoUrl ? (
            <img
              src={student.pasFotoUrl}
              alt={student.namaLengkap}
              className="w-24 h-32 object-cover rounded-xl border-2 border-cyan-400/50 shadow-lg shrink-0"
            />
          ) : (
            <div className="w-24 h-32 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 shrink-0">
              <User className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              <span>Portal Mandiri Peserta Didik</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{student.namaLengkap}</h1>
            <p className="text-xs text-slate-300">
              NIS: <span className="font-mono font-bold text-white">{student.nis}</span> • NISN:{' '}
              <span className="font-mono font-bold text-white">{student.nisn}</span> • Kelas{' '}
              <span className="font-bold text-cyan-300">{student.rombelSaatIni}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
              <button
                onClick={() => setPrintingStudent(student)}
                className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Buku Induk Saya</span>
              </button>

              <button
                onClick={() => setIsEditCredentialsOpen(true)}
                className="inline-flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-xs px-3.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer shadow-sm"
                title="Ubah kata sandi login mandiri siswa"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Ubah Kata Sandi</span>
              </button>

              <button
                onClick={() => switchRole('admin')}
                className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Beralih ke Admin TU</span>
              </button>

              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                title="Keluar dari Portal Siswa"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('buku-induk')}
          className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'buku-induk' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Biodata Buku Induk</span>
        </button>

        <button
          onClick={() => setActiveTab('rapor')}
          className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'rapor' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Nilai Rapor Semester ({student.recordsSemester?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('prestasi')}
          className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'prestasi' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Prestasi & Piagam ({student.prestasi?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('ijazah')}
          className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'ijazah' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Data Ijazah SD & SMP</span>
        </button>

        <button
          onClick={() => setActiveTab('revisi')}
          className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'revisi' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ajukan Pembaruan Data</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'buku-induk' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Salinan Resmi Data Buku Induk Peserta Didik</h3>
            <span className="text-xs text-slate-500">{profilSekolah.namaSekolah}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-cyan-800">
                1. Keterangan Pribadi
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{student.namaLengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
                  <span className="font-semibold text-slate-800">
                    {student.tempatLahir}, {formatTanggalIndo(student.tanggalLahir)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Kelamin / Agama:</span>
                  <span className="font-semibold text-slate-800">
                    {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {student.agama}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat Tempat Tinggal:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                    {student.alamat}, {student.kelurahan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp Siswa:</span>
                  <span className="font-mono font-bold text-emerald-700">{student.noHpSiswa || '-'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-cyan-800">
                2. Data Orang Tua Kandung
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Ayah Kandung:</span>
                  <span className="font-bold text-slate-900">{student.dataAyah?.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pekerjaan Ayah:</span>
                  <span className="font-semibold text-slate-800">{student.dataAyah?.pekerjaan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Ibu Kandung:</span>
                  <span className="font-bold text-slate-900">{student.dataIbu?.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pekerjaan Ibu:</span>
                  <span className="font-semibold text-slate-800">{student.dataIbu?.pekerjaan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kontak Orang Tua:</span>
                  <span className="font-mono font-bold text-emerald-700">{student.dataAyah?.noTeleponWa || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rapor' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Perkembangan Akademik & Rata-rata Rapor</h3>
            <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              Rata-rata Kumulatif: {cumAvg > 0 ? cumAvg : '-'}
            </span>
          </div>

          <div className="space-y-4">
            {student.recordsSemester?.map((sem) => (
              <div key={sem.semester} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900">
                    Semester {sem.semester} • Kelas {sem.kelas} ({sem.tahunAjaran})
                  </span>
                  <span className="font-bold text-emerald-700">
                    Rata-rata: {sem.rataRata} • Peringkat #{sem.peringkatKelas || 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
                  {Object.entries(sem.nilaiMapel).map(([k, val]) => (
                    <div key={k} className="bg-white p-2 rounded border border-slate-200 text-center">
                      <span className="text-[10px] uppercase text-slate-400 block">{k}</span>
                      <span className="font-bold text-slate-800 text-sm">{val}</span>
                    </div>
                  ))}
                </div>

                {sem.catatanPerkembangan && (
                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-500">Catatan Wali Kelas:</span> {sem.catatanPerkembangan}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'prestasi' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Prestasi dan Kejuaraan yang Telah Tercatat</h3>
          {(!student.prestasi || student.prestasi.length === 0) ? (
            <p className="text-xs text-slate-400">Belum ada riwayat prestasi terdaftar.</p>
          ) : (
            <div className="space-y-3">
              {student.prestasi.map((p) => (
                <div key={p.id} className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{p.namaPrestasi}</span>
                    <span className="font-mono text-slate-500 font-semibold">{p.tahun}</span>
                  </div>
                  <div className="text-slate-600">
                    Peringkat: <span className="font-bold text-amber-800">{p.peringkat}</span> • Tingkat:{' '}
                    <span className="font-semibold">{p.tingkat}</span> • Penyelenggara: {p.penyelenggara}
                  </div>
                  {p.nomorSertifikat && (
                    <div className="font-mono text-[10px] text-slate-500">No Piagam: {p.nomorSertifikat}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ijazah' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-emerald-600" />
              Ijazah Sekolah Dasar (SD) Asal
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">SD / MI Asal:</span>
                <span className="font-bold text-slate-900">{student.namaSdAsal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Seri Ijazah SD:</span>
                <span className="font-mono font-bold text-emerald-900">{student.noIjazahSd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Terbit Ijazah SD:</span>
                <span className="font-semibold">{formatTanggalIndo(student.tanggalIjazahSd)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-purple-600" />
              Status Ijazah SMP
            </h3>
            <div className="bg-purple-50/40 p-4 rounded-xl border border-purple-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Status Belajar:</span>
                <span className="font-bold text-purple-900">{student.statusSiswa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Seri Ijazah SMP:</span>
                <span className="font-mono font-bold text-purple-950">
                  {student.noIjazahSmp || '(Sedang Menempuh Pendidikan / Belum Terbit)'}
                </span>
              </div>
              {student.melanjutkanKe && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Melanjutkan Ke:</span>
                  <span className="font-bold">{student.melanjutkanKe}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revisi' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Pengajuan Pembaruan / Verifikasi Data Mandiri</h3>
            <p className="text-xs text-slate-500 mt-1">
              Jika ada kesalahan penulisan nama, alamat, nomor telepon orang tua, atau perolehan piagam prestasi baru, sampaikan di formulir berikut.
            </p>
          </div>

          <form onSubmit={handleKirimRevisi} className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pembaruan Nomor WhatsApp Siswa</label>
              <input
                type="text"
                value={newNoHp}
                onChange={(e) => setNewNoHp(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pembaruan Alamat Tinggal</label>
              <input
                type="text"
                value={newAlamat}
                onChange={(e) => setNewAlamat(e.target.value)}
                placeholder="Jl. Alamat baru..."
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Rincian Revisi atau Piagam Baru
              </label>
              <textarea
                rows={3}
                value={revisionCatatan}
                onChange={(e) => setRevisionCatatan(e.target.value)}
                placeholder="Contoh: Perubahan gelar ayah, atau penambahan juara 1 lomba..."
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-5 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              Kirim Pembaruan ke Petugas Tata Usaha
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
