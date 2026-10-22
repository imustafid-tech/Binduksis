import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTanggalIndo, calculateCumulativeAverage } from '../utils/studentLogic';
import { Printer, X, Download } from 'lucide-react';

export const PrintBukuInduk: React.FC = () => {
  const { printingStudent, setPrintingStudent, profilSekolah } = useApp();

  if (!printingStudent) return null;

  const cumAvg = calculateCumulativeAverage(printingStudent.recordsSemester || []);
  const todayStr = formatTanggalIndo(new Date().toISOString().slice(0, 10));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-white w-full max-w-4xl min-h-screen my-auto shadow-2xl rounded-none sm:rounded-xl overflow-hidden flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:min-h-0">
        {/* Floating Actions on Screen - Hidden on Print */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Pratinjau Lembar Cetak Buku Induk</span>
            <span className="text-xs text-slate-400 font-mono">
              ({printingStudent.nis} - {printingStudent.namaLengkap})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (Ctrl+P)</span>
            </button>
            <button
              onClick={() => setPrintingStudent(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 text-black bg-white space-y-6 print:p-0 print:text-black">
          {/* KOP SURAT RESMI SEKOLAH */}
          <div className="text-center pb-3 border-b-2 border-black relative">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              PEMERINTAH PROVINSI {profilSekolah.provinsi.toUpperCase()} • DINAS PENDIDIKAN
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
              {profilSekolah.namaSekolah}
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              NPSN: <span className="font-mono font-bold">{profilSekolah.npsn}</span> • NSS:{' '}
              <span className="font-mono font-bold">{profilSekolah.nss}</span> • Akreditasi:{' '}
              <span className="font-bold">{profilSekolah.akreditasi}</span>
            </div>
            <div className="text-[11px] text-slate-600">
              {profilSekolah.alamatLengkap}, Kel. {profilSekolah.kelurahan}, Kec. {profilSekolah.kecamatan},{' '}
              {profilSekolah.kabupatenKota} {profilSekolah.kodePos}
            </div>
            <div className="text-[10px] text-slate-500">
              Telp: {profilSekolah.noTelepon} • Email: {profilSekolah.email} • Website: {profilSekolah.website}
            </div>
            {/* Double Rule */}
            <div className="border-b border-black mt-1"></div>
          </div>

          {/* Title of Document */}
          <div className="text-center pt-2">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wide underline underline-offset-4">
              LEMBAR BUKU INDUK PESERTA DIDIK
            </h2>
            <div className="text-xs font-bold text-slate-700 mt-1 uppercase">
              JENJANG SEKOLAH MENENGAH PERTAMA (SMP)
            </div>
          </div>

          {/* Top Identifier & Photo Box */}
          <div className="flex items-start justify-between gap-4 border border-black p-3 bg-slate-50/50 print:bg-transparent">
            <div className="space-y-1 text-xs">
              <div>
                <span className="font-bold inline-block w-40">Nomor Induk Siswa (NIS)</span>
                <span className="font-mono font-bold text-sm">: {printingStudent.nis}</span>
              </div>
              <div>
                <span className="font-bold inline-block w-40">Nomor Induk Siswa Nas. (NISN)</span>
                <span className="font-mono font-bold text-sm">: {printingStudent.nisn}</span>
              </div>
              <div>
                <span className="font-bold inline-block w-40">NIK Kependudukan</span>
                <span className="font-mono">: {printingStudent.nik || '-'}</span>
              </div>
              <div>
                <span className="font-bold inline-block w-40">Tahun Ajaran Masuk</span>
                <span>: {printingStudent.tahunAjaranMasuk} (Diterima di Kelas {printingStudent.diterimaDiKelas})</span>
              </div>
              <div>
                <span className="font-bold inline-block w-40">Status Saat Ini</span>
                <span className="font-bold">: {printingStudent.statusSiswa} (Kelas {printingStudent.rombelSaatIni})</span>
              </div>
            </div>

            {/* Photo Box */}
            <div className="w-24 h-32 border-2 border-dashed border-black flex flex-col items-center justify-center text-center p-1 shrink-0">
              {printingStudent.pasFotoUrl ? (
                <img
                  src={printingStudent.pasFotoUrl}
                  alt={printingStudent.namaLengkap}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[10px] text-slate-500 leading-tight">
                  <div className="font-bold">PASFOTO</div>
                  <div>3 x 4 cm</div>
                  <div className="text-[8px] text-slate-400 mt-1">Cap Tiga Jari</div>
                </div>
              )}
            </div>
          </div>

          {/* BAGIAN A: IDENTITAS DIRI PESERTA DIDIK */}
          <div className="space-y-2">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider">
              A. KETERANGAN TENTANG DIRI PESERTA DIDIK
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">1.</td>
                  <td className="w-56 py-1 font-medium">Nama Lengkap Peserta Didik</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-bold uppercase">{printingStudent.namaLengkap}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">2.</td>
                  <td className="w-56 py-1 font-medium">Nama Panggilan</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">{printingStudent.namaPanggilan || '-'}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">3.</td>
                  <td className="w-56 py-1 font-medium">Jenis Kelamin</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    {printingStudent.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">4.</td>
                  <td className="w-56 py-1 font-medium">Tempat dan Tanggal Lahir</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    {printingStudent.tempatLahir}, {formatTanggalIndo(printingStudent.tanggalLahir)}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">5.</td>
                  <td className="w-56 py-1 font-medium">Agama</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">{printingStudent.agama}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">6.</td>
                  <td className="w-56 py-1 font-medium">Kewarganegaraan</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">{printingStudent.kewarganegaraan || 'Indonesia (WNI)'}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">7.</td>
                  <td className="w-56 py-1 font-medium">Anak Ke / Jumlah Saudara</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    Anak ke-{printingStudent.anakKe} dari {printingStudent.jumlahSaudaraKandung + 1} bersaudara
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">8.</td>
                  <td className="w-56 py-1 font-medium">Golongan Darah / Tinggi / Berat</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    Gol. {printingStudent.golonganDarah || '-'} • Tinggi: {printingStudent.tinggiBadanCm || '-'} cm • Berat: {printingStudent.beratBadanKg || '-'} kg
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">9.</td>
                  <td className="w-56 py-1 font-medium">Alamat Tempat Tinggal</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    {printingStudent.alamat}, RT {printingStudent.rtRw}, Kel. {printingStudent.kelurahan}, Kec. {printingStudent.kecamatan}, {printingStudent.kabupatenKota}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-6 py-1 text-slate-500 font-mono">10.</td>
                  <td className="w-56 py-1 font-medium">Tinggal Bersama / Transportasi</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    {printingStudent.tinggalBersama || 'Orang Tua'} / {printingStudent.transportasi || 'Sepeda Motor'}
                  </td>
                </tr>
                <tr>
                  <td className="w-6 py-1 text-slate-500 font-mono">11.</td>
                  <td className="w-56 py-1 font-medium">Kontak HP / WhatsApp Siswa</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-mono">{printingStudent.noHpSiswa || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN B: KETERANGAN TENTANG ORANG TUA / WALI */}
          <div className="space-y-2 print-avoid-break">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider">
              B. KETERANGAN TENTANG ORANG TUA KANDUNG & WALI
            </div>
            <table className="w-full text-xs border border-black border-collapse text-left">
              <thead>
                <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 w-44">Uraian Data</th>
                  <th className="border-r border-black p-1.5">Ayah Kandung</th>
                  <th className="p-1.5">Ibu Kandung</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">1. Nama Lengkap</td>
                  <td className="border-r border-black p-1.5 font-bold uppercase">{printingStudent.dataAyah?.nama || '-'}</td>
                  <td className="p-1.5 font-bold uppercase">{printingStudent.dataIbu?.nama || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">2. NIK Kependudukan</td>
                  <td className="border-r border-black p-1.5 font-mono">{printingStudent.dataAyah?.nik || '-'}</td>
                  <td className="p-1.5 font-mono">{printingStudent.dataIbu?.nik || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">3. Tempat, Tgl Lahir</td>
                  <td className="border-r border-black p-1.5">
                    {printingStudent.dataAyah?.tempatLahir || '-'}, {formatTanggalIndo(printingStudent.dataAyah?.tanggalLahir)}
                  </td>
                  <td className="p-1.5">
                    {printingStudent.dataIbu?.tempatLahir || '-'}, {formatTanggalIndo(printingStudent.dataIbu?.tanggalLahir)}
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">4. Pendidikan Terakhir</td>
                  <td className="border-r border-black p-1.5">{printingStudent.dataAyah?.pendidikan || '-'}</td>
                  <td className="p-1.5">{printingStudent.dataIbu?.pendidikan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">5. Pekerjaan</td>
                  <td className="border-r border-black p-1.5">{printingStudent.dataAyah?.pekerjaan || '-'}</td>
                  <td className="p-1.5">{printingStudent.dataIbu?.pekerjaan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">6. Penghasilan Rata-rata</td>
                  <td className="border-r border-black p-1.5">{printingStudent.dataAyah?.penghasilanBulanan || '-'}</td>
                  <td className="p-1.5">{printingStudent.dataIbu?.penghasilanBulanan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1.5 font-medium">7. Kontak HP / WA</td>
                  <td className="border-r border-black p-1.5 font-mono">{printingStudent.dataAyah?.noTeleponWa || '-'}</td>
                  <td className="p-1.5 font-mono">{printingStudent.dataIbu?.noTeleponWa || '-'}</td>
                </tr>
                <tr>
                  <td className="border-r border-black p-1.5 font-medium">8. Status Keberadaan</td>
                  <td className="border-r border-black p-1.5 font-bold">{printingStudent.dataAyah?.statusHidup || 'Masih Hidup'}</td>
                  <td className="p-1.5 font-bold">{printingStudent.dataIbu?.statusHidup || 'Masih Hidup'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN C: ASAL SEKOLAH & DATA IJAZAH SD */}
          <div className="space-y-2 print-avoid-break">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider">
              C. ASAL PENDIDIKAN & RIWAYAT IJAZAH SD / MI
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">1. Nama Sekolah Dasar (SD/MI) Asal</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-bold">{printingStudent.namaSdAsal}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">2. Nomor Seri Ijazah SD/MI</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-mono font-bold">{printingStudent.noIjazahSd}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">3. Tanggal Terbit Ijazah SD</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">{formatTanggalIndo(printingStudent.tanggalIjazahSd)}</td>
                </tr>
                <tr>
                  <td className="w-56 py-1 font-medium">4. Nilai Rata-rata Ujian / Ijazah SD</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-bold">{printingStudent.nilaiRataRataSd || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* BAGIAN D: PERKEMBANGAN AKADEMIK & NILAI RAPOR */}
          <div className="space-y-2 print-avoid-break">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider flex justify-between">
              <span>D. PERKEMBANGAN AKADEMIK & NILAI RAPOR DI SMP</span>
              <span>Rata-rata Kumulatif: {cumAvg > 0 ? cumAvg : '-'}</span>
            </div>
            {printingStudent.recordsSemester && printingStudent.recordsSemester.length > 0 ? (
              <table className="w-full text-xs border border-black border-collapse text-center">
                <thead>
                  <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                    <th className="border-r border-black p-1">Smt</th>
                    <th className="border-r border-black p-1">Kelas</th>
                    <th className="border-r border-black p-1">T.A.</th>
                    <th className="border-r border-black p-1">PAI</th>
                    <th className="border-r border-black p-1">PPKn</th>
                    <th className="border-r border-black p-1">IND</th>
                    <th className="border-r border-black p-1">MAT</th>
                    <th className="border-r border-black p-1">IPA</th>
                    <th className="border-r border-black p-1">IPS</th>
                    <th className="border-r border-black p-1">ENG</th>
                    <th className="border-r border-black p-1">PJOK</th>
                    <th className="border-r border-black p-1">SNB</th>
                    <th className="border-r border-black p-1">INF</th>
                    <th className="border-r border-black p-1 font-bold">Rata2</th>
                    <th className="p-1">Ranking</th>
                  </tr>
                </thead>
                <tbody>
                  {printingStudent.recordsSemester.map((r) => (
                    <tr key={r.semester} className="border-b border-black">
                      <td className="border-r border-black p-1 font-bold">{r.semester}</td>
                      <td className="border-r border-black p-1">{r.kelas}</td>
                      <td className="border-r border-black p-1">{r.tahunAjaran}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.pai}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.ppkn}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.indonesia}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.matematika}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.ipa}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.ips}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.inggris}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.pjok}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.seniBudaya}</td>
                      <td className="border-r border-black p-1">{r.nilaiMapel.informatika}</td>
                      <td className="border-r border-black p-1 font-bold bg-slate-50">{r.rataRata}</td>
                      <td className="p-1 font-bold">#{r.peringkatKelas || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-xs text-slate-500 italic p-2 border border-slate-300">
                Data nilai rapor semester sedang dalam proses rekapitulasi.
              </div>
            )}
          </div>

          {/* BAGIAN E: RIWAYAT PRESTASI & PENGHARGAAN */}
          <div className="space-y-2 print-avoid-break">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider">
              E. RIWAYAT PRESTASI & PIAGAM PENGHARGAAN SISWA
            </div>
            {printingStudent.prestasi && printingStudent.prestasi.length > 0 ? (
              <table className="w-full text-xs border border-black border-collapse text-left">
                <thead>
                  <tr className="bg-slate-100 print:bg-slate-50 border-b border-black">
                    <th className="border-r border-black p-1 w-8 text-center">No</th>
                    <th className="border-r border-black p-1">Nama Kejuaraan / Prestasi</th>
                    <th className="border-r border-black p-1 w-24">Bidang</th>
                    <th className="border-r border-black p-1 w-28">Tingkat</th>
                    <th className="border-r border-black p-1 w-24">Peringkat</th>
                    <th className="border-r border-black p-1 w-16 text-center">Tahun</th>
                    <th className="p-1">Nomor Sertifikat / Penyelenggara</th>
                  </tr>
                </thead>
                <tbody>
                  {printingStudent.prestasi.map((p, idx) => (
                    <tr key={p.id} className="border-b border-black">
                      <td className="border-r border-black p-1 text-center font-mono">{idx + 1}</td>
                      <td className="border-r border-black p-1 font-bold">{p.namaPrestasi}</td>
                      <td className="border-r border-black p-1">{p.bidang}</td>
                      <td className="border-r border-black p-1">{p.tingkat}</td>
                      <td className="border-r border-black p-1 font-semibold">{p.peringkat}</td>
                      <td className="border-r border-black p-1 text-center">{p.tahun}</td>
                      <td className="p-1 text-[11px]">
                        {p.penyelenggara} {p.nomorSertifikat ? `(No: ${p.nomorSertifikat})` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-xs text-slate-500 italic p-2 border border-slate-300">
                Belum ada catatan kejuaraan / piagam resmi.
              </div>
            )}
          </div>

          {/* BAGIAN F: KELULUSAN & RIWAYAT IJAZAH SMP */}
          <div className="space-y-2 print-avoid-break">
            <div className="font-bold text-xs bg-slate-200 print:bg-slate-100 px-2 py-1 border border-black uppercase tracking-wider">
              F. KETERANGAN KELULUSAN & DATA IJAZAH SMP
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">1. Tanggal Kelulusan dari SMP</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1">
                    {printingStudent.tanggalKelulusan ? formatTanggalIndo(printingStudent.tanggalKelulusan) : '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">2. Nomor Seri Ijazah SMP Resmi</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-mono font-bold text-sm">
                    {printingStudent.noIjazahSmp || '(Dalam proses / Masih aktif belajar)'}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">3. Nomor Surat Keterangan Lulus (SKL)</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-mono">{printingStudent.noSkl || '-'}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="w-56 py-1 font-medium">4. Nilai Rata-rata Ijazah SMP</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-bold">{printingStudent.nilaiRataRataUjianSmp || '-'}</td>
                </tr>
                <tr>
                  <td className="w-56 py-1 font-medium">5. Melanjutkan Pendidikan Ke</td>
                  <td className="w-3 py-1 font-bold">:</td>
                  <td className="py-1 font-bold">{printingStudent.melanjutkanKe || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TANDA TANGAN RESMI PENGESAHAN */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center print-avoid-break">
            <div>
              <div className="text-slate-600">Mengetahui / Memeriksa:</div>
              <div className="font-bold text-slate-800">Petugas Tata Usaha / Wali Kelas,</div>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 font-serif italic">(Tanda Tangan)</span>
              </div>
              <div className="font-bold underline uppercase">{profilSekolah.namaPetugasTataUsaha}</div>
              <div className="font-mono text-[11px] text-slate-600">NIP. {profilSekolah.nipPetugasTataUsaha}</div>
            </div>

            <div>
              <div className="text-slate-600">
                {profilSekolah.kabupatenKota.replace('Kota ', '')}, {todayStr}
              </div>
              <div className="font-bold text-slate-800">Kepala {profilSekolah.namaSekolah},</div>
              <div className="h-20 flex items-center justify-center relative">
                <div className="w-16 h-16 rounded-full border-2 border-slate-400/30 flex items-center justify-center text-[9px] text-slate-400 rotate-12 absolute">
                  STEMPEL RESMI
                </div>
                <span className="text-[10px] text-slate-300 font-serif italic">(Tanda Tangan)</span>
              </div>
              <div className="font-bold underline uppercase">{profilSekolah.namaKepalaSekolah}</div>
              <div className="font-mono text-[11px] text-slate-600">NIP. {profilSekolah.nipKepalaSekolah}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
