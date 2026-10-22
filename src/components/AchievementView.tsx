import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Plus, Search, Filter, Eye, User, Sparkles } from 'lucide-react';

export const AchievementView: React.FC = () => {
  const { students, setSelectedStudent, setIsDetailOpen, setEditingStudent, setIsFormOpen } = useApp();

  const [selectedBidang, setSelectedBidang] = useState<string>('Semua');
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');

  // Flatten all achievements
  const allAchievements = students.flatMap((s) =>
    (s.prestasi || []).map((p) => ({
      ...p,
      studentId: s.id,
      studentName: s.namaLengkap,
      studentNis: s.nis,
      studentClass: s.rombelSaatIni,
      studentPhoto: s.pasFotoUrl,
    }))
  );

  const filtered = allAchievements.filter((item) => {
    if (selectedBidang !== 'Semua' && item.bidang !== selectedBidang) return false;
    if (selectedTingkat !== 'Semua' && item.tingkat !== selectedTingkat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.namaPrestasi.toLowerCase().includes(q);
      const matchStudent = item.studentName.toLowerCase().includes(q);
      const matchPenyelenggara = item.penyelenggara.toLowerCase().includes(q);
      const matchCert = item.nomorSertifikat?.toLowerCase().includes(q);
      if (!matchName && !matchStudent && !matchPenyelenggara && !matchCert) return false;
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
              <Award className="w-5 h-5 text-amber-500" />
              Riwayat Prestasi & Kejuaraan Siswa
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan prestasi lomba akademik, seni budaya, olahraga, sains, dan keagamaan
            </p>
          </div>

          <button
            onClick={() => {
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data Prestasi</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari prestasi, nama siswa, piagam..."
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Semua">Semua Bidang</option>
              <option value="Akademik">Akademik</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Seni & Budaya">Seni & Budaya</option>
              <option value="Keagamaan">Keagamaan</option>
              <option value="Teknologi / Riset">Teknologi / Riset</option>
            </select>
          </div>

          <div>
            <select
              value={selectedTingkat}
              onChange={(e) => setSelectedTingkat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="Sekolah">Tingkat Sekolah</option>
              <option value="Kecamatan">Tingkat Kecamatan</option>
              <option value="Kabupaten/Kota">Tingkat Kab/Kota</option>
              <option value="Provinsi">Tingkat Provinsi</option>
              <option value="Nasional">Tingkat Nasional</option>
              <option value="Internasional">Tingkat Internasional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Achievements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Tidak ada riwayat prestasi yang cocok</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {item.peringkat}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Tingkat {item.tingkat}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {item.bidang}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.namaPrestasi}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {item.tahun}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="text-slate-400">Penyelenggara:</span>{' '}
                    <span className="font-semibold text-slate-700">{item.penyelenggara}</span>
                  </div>
                  {item.nomorSertifikat && (
                    <div className="font-mono text-[11px] text-slate-500">
                      <span className="text-slate-400">No. Piagam:</span> {item.nomorSertifikat}
                    </div>
                  )}
                  {item.keterangan && (
                    <div className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                      "{item.keterangan}"
                    </div>
                  )}
                </div>
              </div>

              {/* Student footer bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {item.studentPhoto ? (
                    <img
                      src={item.studentPhoto}
                      alt={item.studentName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900">{item.studentName}</span>
                    <span className="text-[10px] text-slate-500 block">
                      NIS: {item.studentNis} • Kelas {item.studentClass}
                    </span>
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
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Buku Induk</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
