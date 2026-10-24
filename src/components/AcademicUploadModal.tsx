import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Info,
  BookOpen,
  Check,
  Award,
} from 'lucide-react';
import {
  downloadAcademicTemplateExcel,
  parseAcademicFile,
  ParsedAcademicRow,
} from '../utils/uploadHelpers';
import { RaporSemester } from '../types/student';

export const AcademicUploadModal: React.FC = () => {
  const { students, bulkUpdateGrades, isAcademicUploadOpen, setIsAcademicUploadOpen, showToast } = useApp();

  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedTahun, setSelectedTahun] = useState<string>('2024/2025');

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedAcademicRow[]>([]);
  const [filterPreview, setFilterPreview] = useState<'all' | 'matched' | 'unmatched'>('all');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAcademicUploadOpen) return null;

  const availableClasses = ['Semua', ...Array.from(new Set(students.map((s) => s.rombelSaatIni))).sort()];

  const handleDownloadTemplate = () => {
    downloadAcademicTemplateExcel(students, selectedClass, selectedSemester, selectedTahun);
    showToast(`Template nilai rapor Semester ${selectedSemester} berhasil diunduh!`, 'success');
  };

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsParsing(true);
    try {
      const result = await parseAcademicFile(selectedFile, students);
      setParsedRows(result.rows);
      showToast(
        `File nilai terbaca: ${result.totalCount} baris (${result.matchedCount} cocok dengan siswa di database)`,
        result.unmatchedCount > 0 ? 'info' : 'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast('Gagal memproses file nilai. Pastikan format kolom sesuai dengan template Excel.', 'error');
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const matchedRows = parsedRows.filter((r) => Boolean(r.matchedStudent));
  const unmatchedRows = parsedRows.filter((r) => !r.matchedStudent);

  const displayedRows = parsedRows.filter((r) => {
    if (filterPreview === 'matched') return Boolean(r.matchedStudent);
    if (filterPreview === 'unmatched') return !r.matchedStudent;
    return true;
  });

  const handleCommitGrades = () => {
    if (matchedRows.length === 0) {
      showToast('Tidak ada siswa yang cocok untuk disimpan nilainya.', 'error');
      return;
    }

    const updates = matchedRows.map((row) => {
      const student = row.matchedStudent!;
      const semesterRecord: RaporSemester = {
        semester: row.semester,
        kelas: row.kelas || student.rombelSaatIni,
        tahunAjaran: row.tahunAjaran,
        nilaiMapel: row.nilaiMapel,
        rataRata: row.rataRata,
        kehadiran: row.kehadiran,
        ekstrakurikuler: [
          { nama: 'Pramuka', predikat: 'Baik' },
          { nama: 'PMR / UKS', predikat: 'Baik' },
        ],
        catatanPerkembangan: row.catatanPerkembangan,
        statusKenaikan: row.statusKenaikan,
      };

      return {
        studentId: student.id,
        semesterRecord,
      };
    });

    bulkUpdateGrades(updates);
    setIsAcademicUploadOpen(false);
    setFile(null);
    setParsedRows([]);
  };

  const handleClose = () => {
    setIsAcademicUploadOpen(false);
    setFile(null);
    setParsedRows([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-linear-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Upload & Import Nilai Akademik Rapor
                <span className="text-[10px] font-medium bg-emerald-500/40 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                  Semua Mapel SMP
                </span>
              </h2>
              <p className="text-xs text-emerald-100/90">
                Unggah rekapitulasi nilai rapor semester per kelas sekaligus dan otomatis hitung rata-rata
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Pre-download Customized Template */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-950">Langkah 1: Unduh Format Template Rapor Otomatis</h3>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Pilih rombel dan semester di bawah. Template akan otomatis terisi daftar nama dan NIS siswa Anda!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/70">
              <div>
                <label className="text-[11px] font-bold text-emerald-900 block mb-1">Pilih Rombel / Kelas</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-white border border-emerald-300 text-xs text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls === 'Semua' ? 'Semua Kelas' : `Kelas ${cls}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-900 block mb-1">Semester Rapor</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-emerald-300 text-xs text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={1}>Semester 1 (Ganjil)</option>
                  <option value={2}>Semester 2 (Genap)</option>
                  <option value={3}>Semester 3 (Ganjil)</option>
                  <option value={4}>Semester 4 (Genap)</option>
                  <option value={5}>Semester 5 (Ganjil)</option>
                  <option value={6}>Semester 6 (Genap)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-emerald-900 block mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  placeholder="2024/2025"
                  className="w-full bg-white border border-emerald-300 text-xs text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Format Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Langkah 2: Unggah File Nilai Excel / CSV yang Telah Diisi</span>
              </label>
              {file && (
                <span className="text-[11px] text-slate-500 font-mono">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                  : file
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {file ? 'Klik atau seret file nilai lain untuk mengganti' : 'Klik untuk memilih file nilai atau seret file ke sini'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung file Excel (.xlsx, .xls) dan CSV (.csv)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isParsing && (
            <div className="flex items-center justify-center gap-2 py-6 text-emerald-700">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs font-medium">Membaca dan memetakan nilai siswa...</span>
            </div>
          )}

          {/* Preview Section */}
          {parsedRows.length > 0 && !isParsing && (
            <div className="space-y-4 pt-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500">Total Baris Terbaca</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{parsedRows.length} Nilai</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-[11px] text-emerald-700">Cocok dengan Siswa</div>
                  <div className="text-lg font-bold text-emerald-800 mt-0.5">{matchedRows.length} Siswa</div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <div className="text-[11px] text-rose-700">Tidak Dikenali (Cek NIS/Nama)</div>
                  <div className="text-lg font-bold text-rose-800 mt-0.5">{unmatchedRows.length} Baris</div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setFilterPreview('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterPreview === 'all'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Semua ({parsedRows.length})
                  </button>
                  <button
                    onClick={() => setFilterPreview('matched')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterPreview === 'matched'
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Cocok ({matchedRows.length})
                  </button>
                  {unmatchedRows.length > 0 && (
                    <button
                      onClick={() => setFilterPreview('unmatched')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        filterPreview === 'unmatched'
                          ? 'bg-rose-700 text-white'
                          : 'text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      Tidak Cocok ({unmatchedRows.length})
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  Menampilkan {displayedRows.length} dari {parsedRows.length} data nilai
                </span>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">No</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">NIS</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3 text-center">Smtr</th>
                      <th className="py-2.5 px-3 text-center">Rata-Rata</th>
                      <th className="py-2.5 px-3">Contoh Nilai (PAI/MTK/IPA)</th>
                      <th className="py-2.5 px-3 text-center">S/I/A</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {displayedRows.map((r, idx) => (
                      <tr
                        key={idx}
                        className={
                          !r.matchedStudent
                            ? 'bg-rose-50/50 hover:bg-rose-50'
                            : r.isExistingSemester
                            ? 'bg-amber-50/30 hover:bg-amber-50/60'
                            : 'hover:bg-slate-50'
                        }
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-sans">{r.rowNumber}</td>
                        <td className="py-2 px-3 font-sans">
                          {!r.matchedStudent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full" title={r.validationErrors.join(', ')}>
                              <AlertCircle className="w-3 h-3" /> Tak Ditemukan
                            </span>
                          ) : r.isExistingSemester ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full" title="Akan memperbarui nilai rapor semester ini">
                              <RefreshCw className="w-3 h-3" /> Timpa Nilai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Baru
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-800">{r.nis}</td>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-900">
                          {r.matchedStudent ? r.matchedStudent.namaLengkap : r.studentName}
                        </td>
                        <td className="py-2 px-3 text-center font-sans font-bold text-slate-700">
                          S{r.semester}
                        </td>
                        <td className="py-2 px-3 text-center font-sans">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                              r.rataRata >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.rataRata >= 75
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.rataRata}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          PAI: {r.nilaiMapel.pai} • MTK: {r.nilaiMapel.matematika} • IPA: {r.nilaiMapel.ipa}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600">
                          {r.kehadiran.sakit}/{r.kehadiran.izin}/{r.kehadiran.tanpaKeterangan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {parsedRows.length > 0 ? (
              <span>
                Siap menyimpan nilai untuk{' '}
                <strong className="text-emerald-700 font-bold">{matchedRows.length} siswa</strong>
                {unmatchedRows.length > 0 && (
                  <span className="text-rose-600 ml-1">({unmatchedRows.length} tidak ditemukan)</span>
                )}
              </span>
            ) : (
              <span>Unduh template Excel terlebih dahulu, isi nilai, lalu unggah kembali ke sini</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleCommitGrades}
              disabled={matchedRows.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Nilai Rapor ({matchedRows.length} Siswa)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
