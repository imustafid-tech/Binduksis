import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Search, Eye, Filter, Award, ChevronRight, Plus } from 'lucide-react';
import { calculateSemesterAverage } from '../utils/studentLogic';

export const AcademicView: React.FC = () => {
  const { students, setSelectedStudent, setIsDetailOpen, setEditingStudent, setIsFormOpen } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');

  const availableClasses = ['Semua', ...Array.from(new Set(students.map((s) => s.rombelSaatIni))).sort()];

  const filteredStudents = students.filter((s) => {
    if (selectedClass !== 'Semua' && s.rombelSaatIni !== selectedClass) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.namaLengkap.toLowerCase().includes(q) ||
        s.nis.toLowerCase().includes(q) ||
        s.nisn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Pengelolaan Nilai Akademik & Rapor Kumulatif
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi nilai rapor semester, perankingan rombel, dan evaluasi capaian belajar siswa SMP
            </p>
          </div>

          <button
            onClick={() => {
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input / Update Rapor Siswa</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 max-w-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau NIS siswa..."
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === 'Semua' ? 'Semua Rombel' : `Kelas ${cls}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List of Academic Records by Student */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((s) => {
          const records = s.recordsSemester || [];
          const latestRecord = records[records.length - 1];

          return (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {s.rombelSaatIni}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setIsDetailOpen(true);
                      }}
                      className="font-bold text-sm text-slate-900 hover:text-emerald-600 text-left cursor-pointer"
                    >
                      {s.namaLengkap}
                    </button>
                    <div className="text-[11px] text-slate-500 font-mono">
                      NIS: {s.nis} • NISN: {s.nisn} • Angkatan: {s.tahunAjaranMasuk}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Tercatat: <strong className="text-slate-800">{records.length} Semester</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedStudent(s);
                      setIsDetailOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Rapor</span>
                  </button>
                </div>
              </div>

              {/* Semester Badges / Mini Summary */}
              {records.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada nilai semester yang diinputkan.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {records.map((r) => (
                    <div
                      key={r.semester}
                      className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Semester {r.semester}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Rank #{r.peringkatKelas || 1}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Rata-rata Mapel:</span>
                        <span className="font-bold text-emerald-700">{r.rataRata}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span>Kehadiran (S/I/A):</span>
                        <span className="font-mono">
                          {r.kehadiran.sakit}/{r.kehadiran.izin}/{r.kehadiran.tanpaKeterangan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
