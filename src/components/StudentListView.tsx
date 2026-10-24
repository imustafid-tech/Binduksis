import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Siswa } from '../types/student';
import { searchStudents, formatTanggalIndo, exportToCsv } from '../utils/studentLogic';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Printer,
  Download,
  Award,
  FileText,
  User,
  GraduationCap,
  Phone,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';

export const StudentListView: React.FC = () => {
  const {
    students,
    searchQuery,
    setSearchQuery,
    setSelectedStudent,
    setIsDetailOpen,
    setEditingStudent,
    setIsFormOpen,
    setPrintingStudent,
    deleteStudent,
    setIsPrintRekapOpen,
    setIsStudentUploadOpen,
    showToast,
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [selectedTahun, setSelectedTahun] = useState<string>('Semua');

  // Filter students based on all criteria
  const filteredStudents = searchStudents(students, searchQuery, {
    kelas: selectedClass,
    status: selectedStatus,
    gender: selectedGender,
    tahunMasuk: selectedTahun,
  });

  // Extract unique classes & years
  const availableClasses = ['Semua', ...Array.from(new Set(students.map((s) => s.rombelSaatIni))).sort()];
  const availableYears = ['Semua', ...Array.from(new Set(students.map((s) => s.tahunAjaranMasuk))).sort().reverse()];

  const handleExportCsv = () => {
    const csv = exportToCsv(filteredStudents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Buku_Induk_Siswa_SMP_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Berhasil mengekspor ${filteredStudents.length} data siswa ke CSV`, 'success');
  };

  const handleDelete = (s: Siswa) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa ${s.namaLengkap} (NIS: ${s.nis}) dari Buku Induk?`)) {
      deleteStudent(s.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Buku Induk Peserta Didik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencarian cepat, filter multi-dimensi, kelola data orang tua, riwayat ijazah & prestasi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Siswa Baru</span>
            </button>

            <button
              onClick={() => setIsStudentUploadOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              title="Upload file Excel (.xlsx) atau CSV data siswa massal"
            >
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>Upload / Import Siswa</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
              title="Unduh Data CSV untuk Excel"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => setIsPrintRekapOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
              title="Cetak Laporan Rekapitulasi Data Siswa"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari NIS, NISN, NIK, nama siswa, orang tua, no ijazah SD..."
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option disabled value="">
                Pilih Kelas
              </option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === 'Semua' ? 'Semua Kelas' : `Kelas ${cls}`}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus (Alumni)</option>
              <option value="Pindah Sekolah">Pindah Sekolah</option>
              <option value="Keluar">Keluar</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Gender</option>
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Semua">Semua Angkatan</option>
              {availableYears.map((th) => (
                <option key={th} value={th}>
                  {th === 'Semua' ? 'Semua Angkatan' : `Masuk ${th}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Menampilkan <span className="font-bold text-slate-800">{filteredStudents.length}</span> dari total{' '}
            <span className="font-bold text-slate-800">{students.length}</span> siswa terdaftar di Buku Induk
          </div>

          {(searchQuery || selectedClass !== 'Semua' || selectedStatus !== 'Semua' || selectedGender !== 'Semua' || selectedTahun !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedClass('Semua');
                setSelectedStatus('Semua');
                setSelectedGender('Semua');
                setSelectedTahun('Semua');
              }}
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Student Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3">NIS & NISN</th>
                <th className="py-3 px-4">Nama Siswa & Data Diri</th>
                <th className="py-3 px-4">Data Orang Tua (Ayah / Ibu)</th>
                <th className="py-3 px-3">Kelas & Status</th>
                <th className="py-3 px-4">Ijazah SD & Asal</th>
                <th className="py-3 px-3 text-center">Prestasi</th>
                <th className="py-3 px-4 text-center">Aksi Administrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Tidak ada data siswa yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Coba ganti kata kunci pencarian atau sesuaikan filter rombel/status
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Number */}
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* NIS & NISN */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 text-xs">{s.nis}</div>
                      <div className="font-mono text-[10px] text-slate-500">NISN: {s.nisn}</div>
                      <div className="font-mono text-[10px] text-slate-400">NIK: {s.nik?.slice(0, 8)}...</div>
                    </td>

                    {/* Student Name & Biodata */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {s.pasFotoUrl ? (
                          <img
                            src={s.pasFotoUrl}
                            alt={s.namaLengkap}
                            className="w-10 h-12 object-cover rounded-md border border-slate-200 shrink-0 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-12 bg-slate-100 rounded-md border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setIsDetailOpen(true);
                            }}
                            className="font-bold text-slate-900 hover:text-emerald-600 text-left transition-colors cursor-pointer text-xs"
                          >
                            {s.namaLengkap}
                          </button>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {s.tempatLahir},{' '}
                            {formatTanggalIndo(s.tanggalLahir)}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {s.alamat}, {s.kelurahan}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Parents Data */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 text-xs">
                        <div className="text-slate-800">
                          <span className="font-semibold text-slate-600 text-[11px]">Ayah:</span>{' '}
                          {s.dataAyah?.nama || '-'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Pekerjaan: {s.dataAyah?.pekerjaan || '-'}
                        </div>
                        <div className="text-slate-800 pt-0.5">
                          <span className="font-semibold text-slate-600 text-[11px]">Ibu:</span>{' '}
                          {s.dataIbu?.nama || '-'}
                        </div>
                        {s.dataAyah?.noTeleponWa && (
                          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-mono">
                            <Phone className="w-2.5 h-2.5" />
                            {s.dataAyah.noTeleponWa}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Class & Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-800">Kelas {s.rombelSaatIni}</div>
                      <div className="text-[10px] text-slate-500">Masuk: {s.tahunAjaranMasuk}</div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.statusSiswa === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.statusSiswa === 'Lulus'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.statusSiswa}
                      </span>
                    </td>

                    {/* Elementary School & Diploma */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-[170px]" title={s.namaSdAsal}>
                        {s.namaSdAsal}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate max-w-[170px]" title={s.noIjazahSd}>
                        Ijazah SD: {s.noIjazahSd}
                      </div>
                      {s.statusSiswa === 'Lulus' && s.noIjazahSmp && (
                        <div className="mt-1 pt-1 border-t border-slate-100 text-[10px] text-purple-700 font-mono">
                          Ijazah SMP: {s.noIjazahSmp}
                        </div>
                      )}
                    </td>

                    {/* Achievements Count */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {s.prestasi && s.prestasi.length > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                          title="Klik untuk melihat detail prestasi"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>{s.prestasi.length} Prestasi</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Lembar Buku Induk Lengkap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setPrintingStudent(s);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Lembar Buku Induk Siswa"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setEditingStudent(s);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Data Siswa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Siswa dari Buku Induk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
