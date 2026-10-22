import React from 'react';
import { useApp } from '../context/AppContext';
import { getStatistics, formatTanggalIndo } from '../utils/studentLogic';
import {
  Users,
  GraduationCap,
  Award,
  ScrollText,
  TrendingUp,
  PlusCircle,
  Printer,
  FileCheck2,
  Calendar,
  Eye,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    students,
    profilSekolah,
    setCurrentTab,
    setIsFormOpen,
    setEditingStudent,
    setSelectedStudent,
    setIsDetailOpen,
    setIsPrintRekapOpen,
  } = useApp();

  const stats = getStatistics(students);

  // All achievements flattened
  const allAchievements = students.flatMap((s) =>
    (s.prestasi || []).map((p) => ({
      ...p,
      studentName: s.namaLengkap,
      studentClass: s.rombelSaatIni,
      studentId: s.id,
      studentNis: s.nis,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Tahun Ajaran Aktif 2024/2025 • Semester Ganjil
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buku Induk Registrasi Siswa
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            {profilSekolah.namaSekolah} • NPSN: {profilSekolah.npsn} • Akreditasi {profilSekolah.akreditasi}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Data Siswa Baru</span>
            </button>
            <button
              onClick={() => setCurrentTab('siswa')}
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-medium text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Lihat Semua Siswa ({students.length})</span>
            </button>
            <button
              onClick={() => setIsPrintRekapOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-medium text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Laporan Rekap</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 top-0 w-80 opacity-10 pointer-events-none flex items-center justify-center">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 font-medium">Total Siswa Terdaftar</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
              {stats.aktif} Aktif • {stats.lulus} Lulus
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.aktif}</div>
            <div className="text-xs text-slate-500 font-medium">Siswa Aktif Belajar</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {stats.totalLakiLaki} L • {stats.totalPerempuan} P
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalPrestasi}</div>
            <div className="text-xs text-slate-500 font-medium">Prestasi & Kejuaraan</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-0.5">
              Nasional & Provinsi
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ScrollText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.lulus}</div>
            <div className="text-xs text-slate-500 font-medium">Alumni Berijazah SMP</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-0.5">
              100% Tercatat Resmi
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Class Distribution & Recent Prestasi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Distribution by Class & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Distribusi Rombongan Belajar
              </h3>
            </div>
            <div className="space-y-2.5">
              {Object.entries(stats.distributionKelas).map(([rombel, count]) => (
                <div
                  key={rombel}
                  onClick={() => setCurrentTab('siswa')}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-700">Kelas {rombel}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (count / (stats.total || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Rasio Gender:</span>
              <span className="font-semibold text-slate-700">
                Laki-laki {Math.round((stats.totalLakiLaki / (stats.total || 1)) * 100)}% : Perempuan{' '}
                {Math.round((stats.totalPerempuan / (stats.total || 1)) * 100)}%
              </span>
            </div>
          </div>

          {/* Quick Notice / Kemendikbud Buku Induk Guidelines */}
          <div className="bg-emerald-50/60 rounded-xl border border-emerald-200/70 p-4 text-emerald-950 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ScrollText className="w-4 h-4 text-emerald-700" />
              Kelengkapan Buku Induk Standar
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Buku Induk Peserta Didik wajib memuat identitas pribadi, data lengkap orang tua/wali, riwayat ijazah
              SD asal, catatan nilai rapor tiap semester, riwayat prestasi yang diakui dinas, serta nomor seri ijazah SMP saat kelulusan.
            </p>
          </div>
        </div>

        {/* Right Column: Recent Achievements & Top Students */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Daftar Prestasi & Piagam Siswa Terkini
                </h3>
                <p className="text-xs text-slate-400">Prestasi resmi yang tercatat dalam Buku Induk</p>
              </div>
              <button
                onClick={() => setCurrentTab('prestasi')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Kelola Semua ({allAchievements.length}) &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {allAchievements.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.namaPrestasi}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {item.peringkat}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Tk. {item.tingkat}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold text-emerald-700">{item.studentName}</span>
                      <span className="text-slate-400">•</span>
                      <span>Kelas {item.studentClass}</span>
                      <span className="text-slate-400">•</span>
                      <span>Tahun {item.tahun}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Penyelenggara: {item.penyelenggara}
                      {item.nomorSertifikat && (
                        <span className="ml-2 font-mono text-[10px] text-slate-400">
                          (No: {item.nomorSertifikat})
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const student = students.find((s) => s.id === item.studentId);
                      if (student) {
                        setSelectedStudent(student);
                        setIsDetailOpen(true);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0 ml-3"
                    title="Lihat Buku Induk Siswa"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Table: Sample Students Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Daftar Peserta Didik Baru-Baru Ini Diperbarui
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('siswa')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Buka Buku Induk &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-2 px-3">NIS / NISN</th>
                    <th className="py-2 px-3">Nama Lengkap</th>
                    <th className="py-2 px-3">Kelas</th>
                    <th className="py-2 px-3">Ijazah SD Asal</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-bold text-slate-900">{s.nis}</span>
                        <span className="text-[10px] text-slate-400 block">{s.nisn}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{s.namaLengkap}</div>
                        <div className="text-[10px] text-slate-500">
                          Ayah: {s.dataAyah?.nama} • Ibu: {s.dataIbu?.nama}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-700 px-2 py-0.5 bg-slate-100 rounded">
                          {s.rombelSaatIni}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="truncate max-w-[140px] text-slate-700 font-medium">
                          {s.namaSdAsal}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                          {s.noIjazahSd}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsDetailOpen(true);
                          }}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer"
                        >
                          Buka Lembar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
