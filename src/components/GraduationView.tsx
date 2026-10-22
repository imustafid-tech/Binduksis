import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Siswa } from '../types/student';
import { formatTanggalIndo } from '../utils/studentLogic';
import { ScrollText, School, GraduationCap, Edit, Eye, Search, CheckCircle2 } from 'lucide-react';

export const GraduationView: React.FC = () => {
  const { students, updateStudent, setSelectedStudent, setIsDetailOpen, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'sd' | 'smp'>('smp');
  const [search, setSearch] = useState<string>('');
  const [editingDiplomaStudent, setEditingDiplomaStudent] = useState<Siswa | null>(null);

  // Form for quick diploma update
  const [noIjazahSmp, setNoIjazahSmp] = useState('');
  const [tanggalIjazahSmp, setTanggalIjazahSmp] = useState('');
  const [noSkl, setNoSkl] = useState('');
  const [melanjutkanKe, setMelanjutkanKe] = useState('');
  const [statusSiswa, setStatusSiswa] = useState<Siswa['statusSiswa']>('Lulus');

  const openDiplomaEditor = (s: Siswa) => {
    setEditingDiplomaStudent(s);
    setNoIjazahSmp(s.noIjazahSmp || '');
    setTanggalIjazahSmp(s.tanggalIjazahSmp || '');
    setNoSkl(s.noSkl || '');
    setMelanjutkanKe(s.melanjutkanKe || '');
    setStatusSiswa(s.statusSiswa);
  };

  const handleSaveDiploma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiplomaStudent) return;
    updateStudent(editingDiplomaStudent.id, {
      noIjazahSmp,
      tanggalIjazahSmp,
      noSkl,
      melanjutkanKe,
      statusSiswa,
      tanggalKelulusan: statusSiswa === 'Lulus' ? editingDiplomaStudent.tanggalKelulusan || new Date().toISOString().slice(0, 10) : undefined,
    });
    setEditingDiplomaStudent(null);
    showToast('Data ijazah SMP & status kelulusan berhasil diperbarui!', 'success');
  };

  const filteredStudents = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.namaLengkap.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      s.nisn.toLowerCase().includes(q) ||
      s.noIjazahSd?.toLowerCase().includes(q) ||
      s.noIjazahSmp?.toLowerCase().includes(q) ||
      s.namaSdAsal?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-indigo-600" />
              Riwayat & Pendataan Ijazah SD dan SMP
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan nomor seri blangko ijazah resmi Kemendikbud, SKL, serta pelacakan alumni lanjutan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('smp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'smp' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ijazah SMP & Kelulusan
            </button>
            <button
              onClick={() => setActiveTab('sd')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sd' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ijazah SD Asal
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="pt-2 border-t border-slate-100 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIS, nomor seri ijazah..."
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table of Diplomas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3">NIS & NISN</th>
                <th className="py-3 px-4">Nama Peserta Didik</th>
                {activeTab === 'smp' ? (
                  <>
                    <th className="py-3 px-4">Nomor Seri Ijazah SMP</th>
                    <th className="py-3 px-3">Tgl Ijazah / SKL</th>
                    <th className="py-3 px-3">Nilai Rata2</th>
                    <th className="py-3 px-4">Melanjutkan Ke</th>
                    <th className="py-3 px-3 text-center">Aksi Cepat</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4">SD / MI Asal Kelulusan</th>
                    <th className="py-3 px-4">Nomor Seri Ijazah SD</th>
                    <th className="py-3 px-3">Tgl Ijazah SD</th>
                    <th className="py-3 px-3">Nilai SD</th>
                    <th className="py-3 px-3 text-center">Status Buku Induk</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="font-bold text-slate-900">{s.nis}</span>
                    <span className="text-[10px] text-slate-400 block">{s.nisn}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setSelectedStudent(s);
                        setIsDetailOpen(true);
                      }}
                      className="font-bold text-slate-900 hover:text-indigo-600 text-left cursor-pointer"
                    >
                      {s.namaLengkap}
                    </button>
                    <span className="text-[10px] text-slate-500 block">
                      Kelas: {s.rombelSaatIni} • {s.statusSiswa}
                    </span>
                  </td>

                  {activeTab === 'smp' ? (
                    <>
                      <td className="py-3 px-4 font-mono">
                        {s.noIjazahSmp ? (
                          <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {s.noIjazahSmp}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">(Belum Terbit)</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">
                          {s.tanggalIjazahSmp ? formatTanggalIndo(s.tanggalIjazahSmp) : '-'}
                        </div>
                        {s.noSkl && <div className="text-[10px] font-mono text-slate-400 truncate max-w-[130px]">{s.noSkl}</div>}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {s.nilaiRataRataUjianSmp || '-'}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {s.melanjutkanKe || '-'}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => openDiplomaEditor(s)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Input Ijazah</span>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 font-semibold text-slate-800">{s.namaSdAsal}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-900">{s.noIjazahSd}</td>
                      <td className="py-3 px-3 text-slate-700">{formatTanggalIndo(s.tanggalIjazahSd)}</td>
                      <td className="py-3 px-3 font-bold text-slate-800">{s.nilaiRataRataSd || '-'}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Modal for SMP Diploma */}
      {editingDiplomaStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Update Data Ijazah SMP & Kelulusan
                </h3>
                <p className="text-xs text-slate-500">
                  {editingDiplomaStudent.namaLengkap} (NIS: {editingDiplomaStudent.nis})
                </p>
              </div>
              <button
                onClick={() => setEditingDiplomaStudent(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDiploma} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Siswa</label>
                <select
                  value={statusSiswa}
                  onChange={(e) => setStatusSiswa(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-bold"
                >
                  <option value="Lulus">Lulus (Tamat Belajar)</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Pindah Sekolah">Pindah Sekolah</option>
                  <option value="Keluar">Keluar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Seri Ijazah SMP</label>
                <input
                  type="text"
                  value={noIjazahSmp}
                  onChange={(e) => setNoIjazahSmp(e.target.value)}
                  placeholder="Contoh: DN-01/D-SMP/K13/24/0048192"
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Terbit Ijazah</label>
                  <input
                    type="date"
                    value={tanggalIjazahSmp}
                    onChange={(e) => setTanggalIjazahSmp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor SKL</label>
                  <input
                    type="text"
                    value={noSkl}
                    onChange={(e) => setNoSkl(e.target.value)}
                    placeholder="No. SKL"
                    className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Melanjutkan Pendidikan Ke</label>
                <input
                  type="text"
                  value={melanjutkanKe}
                  onChange={(e) => setMelanjutkanKe(e.target.value)}
                  placeholder="SMA Negeri 8 Jakarta / SMK / Pesantren..."
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDiplomaStudent(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Ijazah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
