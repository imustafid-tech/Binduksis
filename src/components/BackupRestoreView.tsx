import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BackupData } from '../types/student';
import { validateBackupJson, exportToCsv } from '../utils/studentLogic';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  FileSpreadsheet,
  ShieldAlert,
  Rocket,
} from 'lucide-react';

export const BackupRestoreView: React.FC = () => {
  const { students, profilSekolah, restoreBackup, resetToDefaultData, setIsDeployGuideOpen, showToast } = useApp();

  const [previewBackup, setPreviewBackup] = useState<BackupData | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export JSON Backup
  const handleDownloadBackup = () => {
    const backup: BackupData = {
      app: 'Buku Induk Siswa SMP',
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      profilSekolah,
      daftarSiswa: students,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `BACKUP_BUKU_INDUK_SMP_${profilSekolah.npsn}_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`Cadangan database berhasil diunduh (${students.length} siswa).`, 'success');
  };

  // 2. Handle File Selection for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackupError(null);
    setPreviewBackup(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const check = validateBackupJson(parsed);

        if (!check.valid) {
          setBackupError(check.error || 'Format berkas cadangan tidak valid.');
          return;
        }

        setPreviewBackup(parsed as BackupData);
      } catch (err) {
        setBackupError('Gagal membaca berkas. Pastikan berkas berformat JSON yang valid.');
      }
    };
    reader.readAsText(file);
  };

  // 3. Confirm Restore
  const handleApplyRestore = () => {
    if (!previewBackup) return;
    restoreBackup(previewBackup);
    setPreviewBackup(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 4. Download CSV Master
  const handleDownloadCsv = () => {
    const csv = exportToCsv(students);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Buku_Induk_SMP_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Berkas CSV berhasil diunduh.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          Pencadangan dan Pemulihan Database (Backup & Restore)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Amankan seluruh catatan buku induk, profil sekolah, nilai rapor, prestasi, dan riwayat ijazah secara offline dan mandiri.
        </p>
      </div>

      {/* Main 2-column: Backup & Restore */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Backup Database */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Cadangkan Database (Backup JSON)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Unduh seluruh data aplikasi ke dalam berkas standar JSON. Berkas ini dapat disimpan di komputer, flashdisk, atau Google Drive untuk arsip berkala.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Siswa Terdaftar:</span>
                <span className="font-bold text-slate-900">{students.length} Siswa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sekolah:</span>
                <span className="font-semibold text-slate-800">{profilSekolah.namaSekolah}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Format Cadangan:</span>
                <span className="font-mono text-emerald-700 font-bold">.JSON (Full State)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Cadangan Database Sekarang (.JSON)</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Unduh Salinan Lembar Kerja (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Card 2: Restore Database */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Pulihkan Database (Restore JSON)</h3>
              <p className="text-xs text-slate-500 mt-1">
                Pilih berkas cadangan JSON yang sebelumnya pernah diunduh. Sistem akan memverifikasi integritas data sebelum memulihkannya.
              </p>
            </div>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="restore-file-input"
              />
              <label htmlFor="restore-file-input" className="cursor-pointer block space-y-2">
                <FileJson className="w-8 h-8 mx-auto text-slate-400" />
                <span className="text-xs font-semibold text-emerald-700 block">
                  Pilih atau Tarik Berkas Cadangan (.json)
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Mendukung berkas cadangan Buku Induk v2.x
                </span>
              </label>
            </div>

            {/* Error state */}
            {backupError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{backupError}</span>
              </div>
            )}

            {/* Preview of Backup to Restore */}
            {previewBackup && (
              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Berkas Cadangan Valid & Siap Dipulihkan:
                </div>
                <div className="space-y-1 text-slate-700">
                  <div>Sekolah: <span className="font-bold">{previewBackup.profilSekolah?.namaSekolah}</span></div>
                  <div>Jumlah Siswa: <span className="font-bold">{previewBackup.daftarSiswa?.length || 0} orang</span></div>
                  <div>Tanggal Cadangan: <span className="font-mono text-[11px]">{previewBackup.exportedAt?.slice(0, 10)}</span></div>
                </div>
                <button
                  onClick={handleApplyRestore}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Konfirmasi & Pulihkan Data Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Siap Deploy ke Hosting Section */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-sm border border-indigo-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0 border border-white/20">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">Siap Deploy Langsung ke Hosting</h4>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-semibold">
                Multi-Platform Ready
              </span>
            </div>
            <p className="text-xs text-indigo-200/90 mt-1 max-w-xl leading-relaxed">
              Konfigurasi Vercel (<code>vercel.json</code>), Netlify (<code>_redirects</code>), cPanel/Apache (<code>.htaccess</code>), VPS Nginx, dan <code>Dockerfile</code> sudah terpasang. Klik tombol di kanan untuk panduan langkah demi langkah.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDeployGuideOpen(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <Rocket className="w-4 h-4 text-slate-950" />
          <span>Panduan Deploy Hosting</span>
        </button>
      </div>

      {/* Danger Zone: Reset to Initial Data */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-rose-950">Reset ke Data Contoh Standar Kemendikbud</h4>
            <p className="text-xs text-rose-800 mt-0.5">
              Kembalikan seluruh data siswa dan profil sekolah ke set data percontohan lengkap (SMPN 1 Teladan Nusantara).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mengatur ulang data ke data awal percontohan? Perubahan saat ini akan diganti.')) {
              resetToDefaultData();
            }
          }}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset ke Data Awal</span>
        </button>
      </div>
    </div>
  );
};
