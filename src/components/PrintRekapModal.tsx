import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatTanggalIndo } from '../utils/studentLogic';
import { Printer, X, FileText } from 'lucide-react';

export const PrintRekapModal: React.FC = () => {
  const { isPrintRekapOpen, setIsPrintRekapOpen, students, profilSekolah } = useApp();

  const [selectedFormat, setSelectedFormat] = useState<'rekap-induk' | 'rekap-prestasi' | 'rekap-ijazah'>('rekap-induk');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');

  if (!isPrintRekapOpen) return null;

  const filtered = students.filter((s) => {
    if (selectedClass !== 'Semua' && s.rombelSaatIni !== selectedClass) return false;
    return true;
  });

  const availableClasses = ['Semua', ...Array.from(new Set(students.map((s) => s.rombelSaatIni))).sort()];
  const todayStr = formatTanggalIndo(new Date().toISOString().slice(0, 10));

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      <div className="bg-white w-full max-w-5xl min-h-screen my-auto shadow-2xl rounded-none sm:rounded-xl overflow-hidden flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:min-h-0">
        {/* Floating Top Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">Cetak Rekapitulasi Laporan Buku Induk</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-xs rounded px-2.5 py-1 text-white"
            >
              <option value="rekap-induk">Rekapitulasi Daftar Buku Induk</option>
              <option value="rekap-ijazah">Rekapitulasi Ijazah SD & SMP</option>
              <option value="rekap-prestasi">Rekapitulasi Prestasi & Piagam</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs rounded px-2.5 py-1 text-white"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === 'Semua' ? 'Semua Rombel' : `Kelas ${cls}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap (Ctrl+P)</span>
            </button>
            <button
              onClick={() => setIsPrintRekapOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 sm:p-10 text-black bg-white space-y-6 print:p-0">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-black">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              PEMERINTAH PROVINSI {profilSekolah.provinsi.toUpperCase()} • DINAS PENDIDIKAN
            </div>
            <h1 className="text-xl font-black uppercase text-slate-900 mt-0.5">{profilSekolah.namaSekolah}</h1>
            <div className="text-xs text-slate-600">
              NPSN: <span className="font-mono font-bold">{profilSekolah.npsn}</span> • Akreditasi:{' '}
              {profilSekolah.akreditasi} • {profilSekolah.alamatLengkap}
            </div>
            <div className="border-b border-black mt-1"></div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h2 className="text-base font-black uppercase tracking-wide underline underline-offset-4">
              {selectedFormat === 'rekap-induk' && 'REKAPITULASI BUKU INDUK PESERTA DIDIK'}
              {selectedFormat === 'rekap-ijazah' && 'REKAPITULASI DATA IJAZAH SD & SMP'}
              {selectedFormat === 'rekap-prestasi' && 'REKAPITULASI PRESTASI & PENGHARGAAN SISWA'}
            </h2>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Rombongan Belajar: {selectedClass === 'Semua' ? 'Seluruh Kelas' : `Kelas ${selectedClass}`} • Jumlah:{' '}
              {filtered.length} Peserta Didik
            </div>
          </div>

          {/* Table 1: Rekap Induk */}
          {selectedFormat === 'rekap-induk' && (
            <table className="w-full text-[11px] border border-black border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 w-8 text-center">No</th>
                  <th className="border-r border-black p-1.5 w-24">NIS / NISN</th>
                  <th className="border-r border-black p-1.5">Nama Peserta Didik</th>
                  <th className="border-r border-black p-1.5 w-8 text-center">JK</th>
                  <th className="border-r border-black p-1.5">Tempat, Tanggal Lahir</th>
                  <th className="border-r border-black p-1.5">Nama Orang Tua (Ayah / Ibu)</th>
                  <th className="border-r border-black p-1.5">SD Asal & No Ijazah SD</th>
                  <th className="p-1.5 w-16 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="border-b border-black">
                    <td className="border-r border-black p-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border-r border-black p-1.5 font-mono">
                      <div className="font-bold">{s.nis}</div>
                      <div className="text-[10px] text-slate-500">{s.nisn}</div>
                    </td>
                    <td className="border-r border-black p-1.5 font-bold uppercase">
                      {s.namaLengkap}
                      <span className="font-normal normal-case block text-[10px] text-slate-500">
                        Kelas: {s.rombelSaatIni}
                      </span>
                    </td>
                    <td className="border-r border-black p-1.5 text-center font-bold">{s.jenisKelamin}</td>
                    <td className="border-r border-black p-1.5">
                      {s.tempatLahir}, {formatTanggalIndo(s.tanggalLahir)}
                    </td>
                    <td className="border-r border-black p-1.5">
                      <div>Ayah: {s.dataAyah?.nama || '-'}</div>
                      <div>Ibu: {s.dataIbu?.nama || '-'}</div>
                    </td>
                    <td className="border-r border-black p-1.5">
                      <div className="font-semibold">{s.namaSdAsal}</div>
                      <div className="font-mono text-[10px]">{s.noIjazahSd}</div>
                    </td>
                    <td className="p-1.5 text-center font-bold">{s.statusSiswa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table 2: Rekap Ijazah SD & SMP */}
          {selectedFormat === 'rekap-ijazah' && (
            <table className="w-full text-[11px] border border-black border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 w-8 text-center">No</th>
                  <th className="border-r border-black p-1.5">NIS & Nama Siswa</th>
                  <th className="border-r border-black p-1.5">SD Asal</th>
                  <th className="border-r border-black p-1.5">Nomor Ijazah SD</th>
                  <th className="border-r border-black p-1.5">Status SMP</th>
                  <th className="border-r border-black p-1.5">Nomor Ijazah SMP</th>
                  <th className="p-1.5">Melanjutkan Ke</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id} className="border-b border-black">
                    <td className="border-r border-black p-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border-r border-black p-1.5">
                      <span className="font-bold">{s.namaLengkap}</span>
                      <span className="font-mono block text-[10px]">NIS: {s.nis} • NISN: {s.nisn}</span>
                    </td>
                    <td className="border-r border-black p-1.5">{s.namaSdAsal}</td>
                    <td className="border-r border-black p-1.5 font-mono font-semibold">{s.noIjazahSd}</td>
                    <td className="border-r border-black p-1.5 font-bold">{s.statusSiswa}</td>
                    <td className="border-r border-black p-1.5 font-mono font-bold text-purple-900">
                      {s.noIjazahSmp || '-'}
                    </td>
                    <td className="p-1.5 font-semibold">{s.melanjutkanKe || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table 3: Rekap Prestasi */}
          {selectedFormat === 'rekap-prestasi' && (
            <table className="w-full text-[11px] border border-black border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 w-8 text-center">No</th>
                  <th className="border-r border-black p-1.5">Nama Siswa / Kelas</th>
                  <th className="border-r border-black p-1.5">Nama Kejuaraan / Prestasi</th>
                  <th className="border-r border-black p-1.5 w-24">Bidang</th>
                  <th className="border-r border-black p-1.5 w-24">Tingkat</th>
                  <th className="border-r border-black p-1.5 w-24">Peringkat</th>
                  <th className="border-r border-black p-1.5 w-16 text-center">Tahun</th>
                  <th className="p-1.5">Nomor Piagam</th>
                </tr>
              </thead>
              <tbody>
                {filtered.flatMap((s) =>
                  (s.prestasi || []).map((p, pIdx) => (
                    <tr key={p.id} className="border-b border-black">
                      <td className="border-r border-black p-1.5 text-center font-mono">{pIdx + 1}</td>
                      <td className="border-r border-black p-1.5 font-bold">
                        {s.namaLengkap}
                        <span className="font-normal block text-[10px] text-slate-500">
                          NIS: {s.nis} • Kelas {s.rombelSaatIni}
                        </span>
                      </td>
                      <td className="border-r border-black p-1.5 font-bold">{p.namaPrestasi}</td>
                      <td className="border-r border-black p-1.5">{p.bidang}</td>
                      <td className="border-r border-black p-1.5">{p.tingkat}</td>
                      <td className="border-r border-black p-1.5 font-bold">{p.peringkat}</td>
                      <td className="border-r border-black p-1.5 text-center">{p.tahun}</td>
                      <td className="p-1.5 font-mono text-[10px]">{p.nomorSertifikat || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center print-avoid-break">
            <div>
              <div className="font-bold">Mengetahui,</div>
              <div className="text-slate-700">Petugas Tata Usaha Buku Induk</div>
              <div className="h-16"></div>
              <div className="font-bold underline uppercase">{profilSekolah.namaPetugasTataUsaha}</div>
              <div className="font-mono text-[11px]">NIP. {profilSekolah.nipPetugasTataUsaha}</div>
            </div>

            <div>
              <div>{profilSekolah.kabupatenKota.replace('Kota ', '')}, {todayStr}</div>
              <div className="font-bold">Kepala {profilSekolah.namaSekolah}</div>
              <div className="h-16"></div>
              <div className="font-bold underline uppercase">{profilSekolah.namaKepalaSekolah}</div>
              <div className="font-mono text-[11px]">NIP. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
