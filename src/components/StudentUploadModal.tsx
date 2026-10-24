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
  Users,
  Check,
} from 'lucide-react';
import {
  downloadStudentTemplateExcel,
  parseStudentFile,
  ParsedStudentRow,
} from '../utils/uploadHelpers';
import { Siswa } from '../types/student';

export const StudentUploadModal: React.FC = () => {
  const { students, bulkAddStudents, isStudentUploadOpen, setIsStudentUploadOpen, showToast } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [filterPreview, setFilterPreview] = useState<'all' | 'valid' | 'existing' | 'error'>('all');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isStudentUploadOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsParsing(true);
    try {
      const result = await parseStudentFile(selectedFile, students);
      setParsedRows(result.rows);
      showToast(
        `File berhasil dibaca: ${result.totalCount} baris (${result.validCount} valid, ${result.duplicateCount} NIS terdaftar)`,
        result.errorCount > 0 ? 'info' : 'success'
      );
    } catch (err: any) {
      console.error(err);
      showToast('Gagal memproses file. Pastikan format file sesuai template Excel/CSV.', 'error');
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

  const validRows = parsedRows.filter((r) => r.validationErrors.length === 0);
  const errorRows = parsedRows.filter((r) => r.validationErrors.length > 0);
  const existingRows = validRows.filter((r) => r.isExisting);
  const newRows = validRows.filter((r) => !r.isExisting);

  const displayedRows = parsedRows.filter((r) => {
    if (filterPreview === 'valid') return r.validationErrors.length === 0;
    if (filterPreview === 'existing') return r.isExisting && r.validationErrors.length === 0;
    if (filterPreview === 'error') return r.validationErrors.length > 0;
    return true;
  });

  const handleCommitImport = () => {
    if (validRows.length === 0) {
      showToast('Tidak ada data valid yang dapat disimpan.', 'error');
      return;
    }

    const studentsToImport: Omit<Siswa, 'id'>[] = validRows.map((row) => ({
      nis: row.nis,
      nisn: row.nisn,
      nik: row.nik,
      namaLengkap: row.namaLengkap,
      namaPanggilan: row.namaPanggilan,
      jenisKelamin: row.jenisKelamin,
      tempatLahir: row.tempatLahir,
      tanggalLahir: row.tanggalLahir,
      agama: row.agama,
      kewarganegaraan: 'WNI',
      anakKe: 1,
      jumlahSaudaraKandung: 0,
      bahasaRumah: 'Bahasa Indonesia',
      golonganDarah: '-',
      alamat: row.alamat,
      rtRw: '001/001',
      kelurahan: '-',
      kecamatan: '-',
      kabupatenKota: '-',
      provinsi: '-',
      kodePos: '-',
      tinggalBersama: 'Orang Tua',
      transportasi: 'Sepeda Motor',
      noHpSiswa: row.noHpSiswa,
      dataAyah: {
        nama: row.namaAyah,
        nik: '-',
        tempatLahir: '-',
        tanggalLahir: '1980-01-01',
        agama: row.agama,
        pendidikan: 'SMA/Sederajat',
        pekerjaan: row.pekerjaanAyah,
        penghasilanBulanan: 'Rp 3.000.000 - Rp 5.000.000',
        noTeleponWa: row.noWaAyah,
        alamat: row.alamat,
        statusHidup: 'Masih Hidup',
      },
      dataIbu: {
        nama: row.namaIbu,
        nik: '-',
        tempatLahir: '-',
        tanggalLahir: '1983-01-01',
        agama: row.agama,
        pendidikan: 'SMA/Sederajat',
        pekerjaan: row.pekerjaanIbu,
        penghasilanBulanan: 'Rp 1.000.000 - Rp 3.000.000',
        noTeleponWa: row.noWaIbu,
        alamat: row.alamat,
        statusHidup: 'Masih Hidup',
      },
      statusMasuk: 'Siswa Baru',
      tanggalMasuk: `${row.tahunAjaranMasuk.split('/')[0]}-07-15`,
      diterimaDiKelas: row.rombelSaatIni,
      namaSdAsal: row.namaSdAsal,
      noIjazahSd: row.noIjazahSd,
      tanggalIjazahSd: `${row.tahunAjaranMasuk.split('/')[0]}-06-20`,
      rombelSaatIni: row.rombelSaatIni,
      tahunAjaranMasuk: row.tahunAjaranMasuk,
      recordsSemester: [],
      prestasi: [],
      statusSiswa: 'Aktif',
    }));

    bulkAddStudents(studentsToImport, updateExisting);
    setIsStudentUploadOpen(false);
    // Reset state
    setFile(null);
    setParsedRows([]);
  };

  const handleClose = () => {
    setIsStudentUploadOpen(false);
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
              <UploadCloud className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Upload & Import Data Siswa Massal
                <span className="text-[10px] font-medium bg-emerald-500/40 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                  Excel & CSV
                </span>
              </h2>
              <p className="text-xs text-emerald-100/90">
                Unggah banyak data siswa sekaligus ke Buku Induk dengan template resmi Kemendikbud
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Step 1: Download Template banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950">Langkah 1: Unduh Format Template Excel</h3>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Gunakan format kolom resmi agar data terbaca sempurna (NIS, NISN, NIK, Nama Lengkap, Jenis Kelamin, Kelas, Tanggal Lahir, Orang Tua, dsb).
                </p>
              </div>
            </div>
            <button
              onClick={downloadStudentTemplateExcel}
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Template (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Langkah 2: Pilih atau Tarik File Excel / CSV</span>
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
                    {file ? 'Klik atau seret file lain untuk mengganti' : 'Klik untuk memilih file atau seret file ke sini'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung file Excel (.xlsx, .xls) dan CSV (.csv)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parsing Spinner */}
          {isParsing && (
            <div className="flex items-center justify-center gap-2 py-6 text-emerald-700">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs font-medium">Membaca dan memvalidasi file Excel...</span>
            </div>
          )}

          {/* Results & Preview Section */}
          {parsedRows.length > 0 && !isParsing && (
            <div className="space-y-4 pt-2">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[11px] text-slate-500">Total Dibaca</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{parsedRows.length} Siswa</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="text-[11px] text-emerald-700">Valid Siap Impor</div>
                  <div className="text-lg font-bold text-emerald-800 mt-0.5">{validRows.length} Siswa</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="text-[11px] text-amber-700">NIS Sudah Ada</div>
                  <div className="text-lg font-bold text-amber-800 mt-0.5">{existingRows.length} Siswa</div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <div className="text-[11px] text-rose-700">Baris Error</div>
                  <div className="text-lg font-bold text-rose-800 mt-0.5">{errorRows.length} Baris</div>
                </div>
              </div>

              {/* Behavior on Duplicate */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Opsi jika NIS siswa sudah terdaftar di Buku Induk:</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="updatePolicy"
                      checked={updateExisting}
                      onChange={() => setUpdateExisting(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-800 font-medium">Timpa & Perbarui Data Lama</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="updatePolicy"
                      checked={!updateExisting}
                      onChange={() => setUpdateExisting(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-600">Lewati (Jangan Ubah)</span>
                  </label>
                </div>
              </div>

              {/* Filter Tabs for Preview */}
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
                    onClick={() => setFilterPreview('valid')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterPreview === 'valid'
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Valid ({validRows.length})
                  </button>
                  <button
                    onClick={() => setFilterPreview('existing')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterPreview === 'existing'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Update ({existingRows.length})
                  </button>
                  {errorRows.length > 0 && (
                    <button
                      onClick={() => setFilterPreview('error')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        filterPreview === 'error'
                          ? 'bg-rose-700 text-white'
                          : 'text-rose-700 hover:bg-rose-50'
                      }`}
                    >
                      Error ({errorRows.length})
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">
                  Menampilkan {displayedRows.length} dari {parsedRows.length} baris
                </span>
              </div>

              {/* Data Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">No</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">NIS</th>
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3">JK</th>
                      <th className="py-2.5 px-3">Rombel</th>
                      <th className="py-2.5 px-3">Tgl Lahir</th>
                      <th className="py-2.5 px-3">Orang Tua</th>
                      <th className="py-2.5 px-3">SD Asal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {displayedRows.map((r, idx) => (
                      <tr
                        key={idx}
                        className={
                          r.validationErrors.length > 0
                            ? 'bg-rose-50/50 hover:bg-rose-50'
                            : r.isExisting
                            ? 'bg-amber-50/30 hover:bg-amber-50/60'
                            : 'hover:bg-slate-50'
                        }
                      >
                        <td className="py-2 px-3 text-center text-slate-400 font-sans">{r.rowNumber}</td>
                        <td className="py-2 px-3 font-sans">
                          {r.validationErrors.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full" title={r.validationErrors.join(', ')}>
                              <AlertCircle className="w-3 h-3" /> Error
                            </span>
                          ) : r.isExisting ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              <RefreshCw className="w-3 h-3" /> Update
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Baru
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-800">{r.nis}</td>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-900">{r.namaLengkap}</td>
                        <td className="py-2 px-3 text-center font-sans">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              r.jenisKelamin === 'L'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.jenisKelamin}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans">{r.rombelSaatIni}</td>
                        <td className="py-2 px-3 text-slate-600">{r.tanggalLahir}</td>
                        <td className="py-2 px-3 font-sans text-slate-700">
                          {r.namaAyah || r.namaIbu || '-'}
                        </td>
                        <td className="py-2 px-3 font-sans text-slate-600 truncate max-w-[140px]">
                          {r.namaSdAsal}
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
                Siap mengimpor{' '}
                <strong className="text-emerald-700 font-bold">{validRows.length} siswa</strong> ke Buku Induk
                {existingRows.length > 0 && (
                  <> ({newRows.length} baru, {existingRows.length} {updateExisting ? 'diperbarui' : 'dilewati'})</>
                )}
              </span>
            ) : (
              <span>Silakan pilih file Excel (.xlsx) atau CSV yang ingin diimpor</span>
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
              onClick={handleCommitImport}
              disabled={validRows.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan ke Buku Induk ({validRows.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
