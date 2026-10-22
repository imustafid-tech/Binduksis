import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTanggalIndo, calculateCumulativeAverage } from '../utils/studentLogic';
import {
  X,
  Printer,
  Edit,
  User,
  Users,
  School,
  BookOpen,
  Award,
  ScrollText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

export const StudentDetailModal: React.FC = () => {
  const {
    isDetailOpen,
    setIsDetailOpen,
    selectedStudent,
    setEditingStudent,
    setIsFormOpen,
    setPrintingStudent,
    profilSekolah,
    userSession,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profil' | 'ortu' | 'akademik' | 'prestasi' | 'ijazah'>('profil');

  if (!isDetailOpen || !selectedStudent) return null;

  const cumAvg = calculateCumulativeAverage(selectedStudent.recordsSemester || []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-lg text-white">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Lembar Buku Induk: {selectedStudent.namaLengkap}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NIS: {selectedStudent.nis}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {profilSekolah.namaSekolah} • Nomor Induk Siswa Nasional: {selectedStudent.nisn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPrintingStudent(selectedStudent);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
              title="Cetak Lembar Buku Induk format standar Kemendikbud"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Induk</span>
            </button>

            {userSession.role === 'admin' && (
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setEditingStudent(selectedStudent);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={() => setIsDetailOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 overflow-x-auto flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'profil' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Keterangan Diri Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('ortu')}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ortu' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Orang Tua & Wali</span>
          </button>

          <button
            onClick={() => setActiveTab('akademik')}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'akademik' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Akademik & Rapor SMP</span>
          </button>

          <button
            onClick={() => setActiveTab('prestasi')}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'prestasi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Prestasi Siswa ({selectedStudent.prestasi?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('ijazah')}
            className={`px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ijazah' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Ijazah SD & SMP</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PROFIL & KETERANGAN DIRI */}
          {activeTab === 'profil' && (
            <div className="space-y-6">
              {/* Top Banner with Photo & Core Metrics */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {selectedStudent.pasFotoUrl ? (
                  <img
                    src={selectedStudent.pasFotoUrl}
                    alt={selectedStudent.namaLengkap}
                    className="w-28 h-36 object-cover rounded-lg border-2 border-white shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-28 h-36 bg-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                    <User className="w-10 h-10" />
                    <span className="text-[10px] mt-1 font-semibold">Pasfoto 3x4</span>
                  </div>
                )}

                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xl font-bold text-slate-900">{selectedStudent.namaLengkap}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      Kelas {selectedStudent.rombelSaatIni}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        selectedStudent.statusSiswa === 'Aktif'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedStudent.statusSiswa === 'Lulus'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedStudent.statusSiswa}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Nama Panggilan: <span className="font-semibold text-slate-700">{selectedStudent.namaPanggilan || '-'}</span> •{' '}
                    Jenis Kelamin:{' '}
                    <span className="font-semibold text-slate-700">
                      {selectedStudent.jenisKelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                    </span>{' '}
                    • Agama: <span className="font-semibold text-slate-700">{selectedStudent.agama}</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">NIS Sekolah</span>
                      <span className="font-mono font-bold text-slate-800">{selectedStudent.nis}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">NISN Nasional</span>
                      <span className="font-mono font-bold text-slate-800">{selectedStudent.nisn}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Rata-rata Rapor</span>
                      <span className="font-bold text-emerald-700">{cumAvg > 0 ? cumAvg : '-'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Prestasi</span>
                      <span className="font-bold text-amber-700">{selectedStudent.prestasi?.length || 0} Terdaftar</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Keterangan Diri Lengkap (Buku Induk Bagian A)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs">
                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tempat, Tanggal Lahir:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.tempatLahir}, {formatTanggalIndo(selectedStudent.tanggalLahir)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">NIK (Kependudukan):</span>
                      <span className="font-mono font-semibold text-slate-900">{selectedStudent.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kewarganegaraan:</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.kewarganegaraan || 'WNI'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Anak Ke / Dari:</span>
                      <span className="font-semibold text-slate-900">
                        Anak ke-{selectedStudent.anakKe} dari {selectedStudent.jumlahSaudaraKandung + 1} bersaudara
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bahasa Sehari-hari:</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.bahasaRumah || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Golongan Darah:</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.golonganDarah || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tinggi & Berat Badan:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.tinggiBadanCm || '-'} cm / {selectedStudent.beratBadanKg || '-'} kg
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Alamat Tempat Tinggal:</span>
                      <span className="font-semibold text-slate-900 text-right max-w-[220px]">
                        {selectedStudent.alamat}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RT / RW & Kelurahan:</span>
                      <span className="font-semibold text-slate-900">
                        RT {selectedStudent.rtRw}, Kel. {selectedStudent.kelurahan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kecamatan & Kota:</span>
                      <span className="font-semibold text-slate-900">
                        {selectedStudent.kecamatan}, {selectedStudent.kabupatenKota}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tinggal Bersama:</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.tinggalBersama || 'Orang Tua'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transportasi ke Sekolah:</span>
                      <span className="font-semibold text-slate-900">{selectedStudent.transportasi || 'Sepeda Motor'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">No. WhatsApp Siswa:</span>
                      <span className="font-semibold text-emerald-700 font-mono">{selectedStudent.noHpSiswa || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email Resmi Siswa:</span>
                      <span className="font-semibold text-slate-700 text-right text-[11px]">
                        {selectedStudent.emailSiswa || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA ORANG TUA MENDETAIL */}
          {activeTab === 'ortu' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ayah */}
                <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/20 shadow-xs">
                  <div className="bg-blue-600 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Data Ayah Kandung (Bagian B.1)
                  </div>
                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nama Lengkap Ayah:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.dataAyah?.nama || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">NIK Ayah:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedStudent.dataAyah?.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">TTL Ayah:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.dataAyah?.tempatLahir || '-'},{' '}
                        {formatTanggalIndo(selectedStudent.dataAyah?.tanggalLahir)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Pendidikan Terakhir:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.dataAyah?.pendidikan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Pekerjaan:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.dataAyah?.pekerjaan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Penghasilan Bulanan:</span>
                      <span className="font-semibold text-emerald-800">{selectedStudent.dataAyah?.penghasilanBulanan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Kontak Telepon / WA:</span>
                      <span className="font-mono font-bold text-emerald-700">{selectedStudent.dataAyah?.noTeleponWa || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Alamat:</span>
                      <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                        {selectedStudent.dataAyah?.alamat || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status Keberadaan:</span>
                      <span className="font-bold text-blue-900">{selectedStudent.dataAyah?.statusHidup || 'Masih Hidup'}</span>
                    </div>
                  </div>
                </div>

                {/* Ibu */}
                <div className="border border-pink-200 rounded-xl overflow-hidden bg-pink-50/20 shadow-xs">
                  <div className="bg-pink-600 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Data Ibu Kandung (Bagian B.2)
                  </div>
                  <div className="p-4 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nama Lengkap Ibu:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.dataIbu?.nama || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">NIK Ibu:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedStudent.dataIbu?.nik || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">TTL Ibu:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.dataIbu?.tempatLahir || '-'},{' '}
                        {formatTanggalIndo(selectedStudent.dataIbu?.tanggalLahir)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Pendidikan Terakhir:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.dataIbu?.pendidikan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Pekerjaan:</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.dataIbu?.pekerjaan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Penghasilan Bulanan:</span>
                      <span className="font-semibold text-emerald-800">{selectedStudent.dataIbu?.penghasilanBulanan || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Kontak Telepon / WA:</span>
                      <span className="font-mono font-bold text-emerald-700">{selectedStudent.dataIbu?.noTeleponWa || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Alamat:</span>
                      <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                        {selectedStudent.dataIbu?.alamat || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status Keberadaan:</span>
                      <span className="font-bold text-pink-900">{selectedStudent.dataIbu?.statusHidup || 'Masih Hidup'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AKADEMIK & RAPOR SMP */}
          {activeTab === 'akademik' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Catatan Nilai Rapor Semester (Buku Induk Bagian D)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tahun Masuk: {selectedStudent.tahunAjaranMasuk} • Diterima di Kelas: {selectedStudent.diterimaDiKelas}
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Rata-rata Kumulatif: {cumAvg > 0 ? cumAvg : '-'}
                </div>
              </div>

              {(!selectedStudent.recordsSemester || selectedStudent.recordsSemester.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  Belum ada nilai rapor semester yang tercatat dalam Buku Induk.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedStudent.recordsSemester.map((sem) => (
                    <div key={sem.semester} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          Semester {sem.semester} • Kelas {sem.kelas} ({sem.tahunAjaran})
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600">Rata-rata: {sem.rataRata}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Ranking #{sem.peringkatKelas || 1}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                          {Object.entries(sem.nilaiMapel).map(([k, val]) => (
                            <div key={k} className="bg-slate-50 p-2 rounded border border-slate-100 text-center">
                              <span className="text-[10px] uppercase text-slate-400 block">{k}</span>
                              <span className="font-bold text-slate-800 text-sm">{val}</span>
                            </div>
                          ))}
                        </div>

                        {sem.catatanPerkembangan && (
                          <div className="text-xs bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 text-emerald-950">
                            <span className="font-bold text-emerald-900 block">Catatan Perkembangan Wali Kelas:</span>
                            {sem.catatanPerkembangan}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PRESTASI & PENGHARGAAN */}
          {activeTab === 'prestasi' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Riwayat Prestasi & Kejuaraan (Buku Induk Bagian E)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total {selectedStudent.prestasi?.length || 0} prestasi resmi yang tercatat
                  </p>
                </div>
              </div>

              {(!selectedStudent.prestasi || selectedStudent.prestasi.length === 0) ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  Belum ada prestasi yang tercatat untuk siswa ini.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {selectedStudent.prestasi.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{p.namaPrestasi}</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            {p.peringkat}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Tingkat {p.tingkat}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          Bidang: <span className="font-semibold text-slate-800">{p.bidang}</span> • Tahun:{' '}
                          <span className="font-semibold text-slate-800">{p.tahun}</span> • Penyelenggara:{' '}
                          <span className="font-semibold text-slate-800">{p.penyelenggara}</span>
                        </div>
                        {p.nomorSertifikat && (
                          <div className="text-xs font-mono text-slate-500">
                            Nomor Piagam/Sertifikat: {p.nomorSertifikat}
                          </div>
                        )}
                        {p.keterangan && (
                          <div className="text-xs text-slate-500 italic mt-1">"{p.keterangan}"</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RIWAYAT IJAZAH SD & SMP */}
          {activeTab === 'ijazah' && (
            <div className="space-y-6">
              {/* Ijazah SD */}
              <div className="border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/20 shadow-xs">
                <div className="bg-emerald-700 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <School className="w-4 h-4" />
                  Riwayat Ijazah SD / Madrasah Ibtidaiyah Asal (Bagian C)
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nama SD / MI Asal:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.namaSdAsal}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">NPSN SD:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedStudent.npsnSdAsal || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nomor Seri Ijazah SD:</span>
                      <span className="font-mono font-bold text-emerald-900">{selectedStudent.noIjazahSd}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Tanggal Terbit Ijazah SD:</span>
                      <span className="font-semibold text-slate-800">
                        {formatTanggalIndo(selectedStudent.tanggalIjazahSd)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nilai Rata-rata Ijazah SD:</span>
                      <span className="font-bold text-emerald-700">{selectedStudent.nilaiRataRataSd || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Alamat SD Asal:</span>
                      <span className="font-semibold text-slate-800 text-right">{selectedStudent.alamatSdAsal || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ijazah SMP */}
              <div className="border border-purple-200 rounded-xl overflow-hidden bg-purple-50/20 shadow-xs">
                <div className="bg-purple-700 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <ScrollText className="w-4 h-4" />
                  Riwayat Ijazah SMP & Kelulusan (Bagian F)
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Status Kelulusan:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-xs ${
                          selectedStudent.statusSiswa === 'Lulus'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {selectedStudent.statusSiswa}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Tanggal Kelulusan:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.tanggalKelulusan ? formatTanggalIndo(selectedStudent.tanggalKelulusan) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nomor Seri Ijazah SMP:</span>
                      <span className="font-mono font-bold text-purple-900">
                        {selectedStudent.noIjazahSmp || '(Belum Terbit / Masih Aktif)'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nomor SKL (Surat Ket. Lulus):</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedStudent.noSkl || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nilai Rata-rata Ujian SMP:</span>
                      <span className="font-bold text-purple-900">{selectedStudent.nilaiRataRataUjianSmp || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Melanjutkan Pendidikan Ke:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.melanjutkanKe || '-'}</span>
                    </div>
                  </div>

                  {selectedStudent.catatanTambahan && (
                    <div className="mt-2 text-xs bg-purple-100/60 p-2.5 rounded-lg border border-purple-200 text-purple-950">
                      <span className="font-bold block">Catatan Kelulusan Tambahan:</span>
                      {selectedStudent.catatanTambahan}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Terdaftar di Buku Induk: Angkatan {selectedStudent.tahunAjaranMasuk} • Diperbarui Terakhir: 2024
          </div>
          <button
            onClick={() => setIsDetailOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
