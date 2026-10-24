import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Rocket,
  Globe,
  Server,
  Cloud,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  FolderArchive,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const DeployGuideModal: React.FC = () => {
  const { isDeployGuideOpen, setIsDeployGuideOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'vercel' | 'netlify' | 'cpanel' | 'vps' | 'docker'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isDeployGuideOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Perintah berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Rocket className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Panduan Siap Deploy ke Hosting
                <span className="text-[10px] font-medium bg-emerald-500/40 text-emerald-100 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                  Semua Konfigurasi Sudah Siap
                </span>
              </h2>
              <p className="text-xs text-indigo-100/90">
                Pilih platform hosting tujuan: Vercel, Netlify, cPanel, VPS Nginx, atau Docker Cloud
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-black" />
            <span>Vercel (Gratis & Tercepat)</span>
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'netlify'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4 text-teal-600" />
            <span>Netlify</span>
          </button>

          <button
            onClick={() => setActiveTab('cpanel')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cpanel'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-amber-600" />
            <span>cPanel / Shared Hosting</span>
          </button>

          <button
            onClick={() => setActiveTab('vps')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vps'
                ? 'bg-white text-indigo-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-indigo-600" />
            <span>VPS Linux (Nginx & PM2)</span>
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'docker'
                ? 'bg-white text-sky-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-600" />
            <span>Docker & Cloud Containers</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950">File Konfigurasi vercel.json Sudah Dibuat Otomatis</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    File <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">vercel.json</code> telah disiapkan di root proyek dengan aturan penulisan ulang URL SPA (Single Page Application) sehingga rute tidak akan 404 saat di-refresh.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Cara Deploy ke Vercel (Opsi 1: Lewat Git / GitHub):</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                  <li>Push repository ini ke GitHub / GitLab Anda.</li>
                  <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">vercel.com</a> dan klik <strong>"Add New" &rarr; "Project"</strong>.</li>
                  <li>Pilih repositori Anda, Vercel akan otomatis mengenali framework <strong>Vite</strong>.</li>
                  <li>Klik <strong>"Deploy"</strong>. Selesai dalam 30 detik dan Anda mendapatkan link live HTTPS gratis!</li>
                </ol>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-800 text-sm">Opsi 2: Deploy Cepat via Terminal (Vercel CLI):</h4>
                <div className="relative bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] flex items-center justify-between">
                  <span>npm i -g vercel && vercel</span>
                  <button
                    onClick={() => copyToClipboard('npm i -g vercel && vercel', 'vercel-cli')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === 'vercel-cli' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NETLIFY */}
          {activeTab === 'netlify' && (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-950">File netlify.toml & public/_redirects Siap Pakai</h4>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Aturan pengalihan <code className="bg-teal-100 px-1 py-0.5 rounded font-mono">/* /index.html 200</code> sudah aktif di folder public & root proyek.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Cara Deploy Drag & Drop ke Netlify (Paling Mudah):</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 leading-relaxed">
                  <li>Jalankan build di komputer / server Anda:</li>
                  <div className="relative bg-slate-900 text-slate-100 rounded-xl p-2.5 font-mono text-[11px] flex items-center justify-between my-2">
                    <span>npm run build</span>
                    <button
                      onClick={() => copyToClipboard('npm run build', 'net-build')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === 'net-build' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <li>Buka <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-teal-600 underline font-semibold">app.netlify.com/drop</a>.</li>
                  <li>Tarik (drag & drop) seluruh folder <strong>dist/</strong> yang baru saja terbuat ke browser.</li>
                  <li>Aplikasi Buku Induk langsung online dengan URL aman HTTPS!</li>
                </ol>
              </div>
            </div>
          )}

          {/* CPANEL */}
          {activeTab === 'cpanel' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950">File public/.htaccess Otomatis Termasuk di dist</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Mod_rewrite Apache dan Gzip compression sudah tertanam otomatis di file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.htaccess</code> saat Anda menjalankan build.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Langkah Deploy ke cPanel / Rumahweb / Niagahoster:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-slate-700 leading-relaxed">
                  <li>
                    Jalankan build:
                    <div className="relative bg-slate-900 text-slate-100 rounded-lg p-2 font-mono text-[11px] flex items-center justify-between my-1">
                      <span>npm run build</span>
                      <button
                        onClick={() => copyToClipboard('npm run build', 'cpanel-build')}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700"
                      >
                        {copiedKey === 'cpanel-build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </li>
                  <li>Buka folder <strong>dist/</strong>, zip semua isinya (termasuk file <code>.htaccess</code> dan <code>index.html</code>).</li>
                  <li>Login ke <strong>cPanel &rarr; File Manager</strong>.</li>
                  <li>Masuk ke folder <strong>public_html</strong> (atau subdomain sekolah misalnya <code>bukuinduk.smp1merdeka.sch.id</code>).</li>
                  <li>Upload file ZIP tadi lalu klik <strong>Extract</strong>.</li>
                  <li>Pastikan file <code>.htaccess</code> terlihat (aktifkan <em>"Show Hidden Files (dotfiles)"</em> pada pengaturan File Manager).</li>
                  <li>Buku Induk Anda siap diakses oleh seluruh guru dan tata usaha sekolah!</li>
                </ol>
              </div>
            </div>
          )}

          {/* VPS NGINX */}
          {activeTab === 'vps' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">1. Jalankan dengan Node & PM2 (Production):</h4>
                <div className="relative bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] flex items-center justify-between">
                  <span>npm run build && pm2 start server.ts --name "buku-induk" --interpreter tsx</span>
                  <button
                    onClick={() => copyToClipboard('npm run build && pm2 start server.ts --name "buku-induk" --interpreter tsx', 'pm2-cmd')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === 'pm2-cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">2. Konfigurasi Nginx (/etc/nginx/sites-available/bukuinduk):</h4>
                <div className="relative bg-slate-900 text-emerald-300 rounded-xl p-3 font-mono text-[11px] leading-relaxed">
                  <pre>{`server {
    listen 80;
    server_name bukuinduk.sekolah.sch.id;

    # Opsi A: Reverse proxy ke server Node.js port 3000
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `server {\n    listen 80;\n    server_name bukuinduk.sekolah.sch.id;\n\n    location / {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}`,
                        'nginx-conf'
                      )
                    }
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === 'nginx-conf' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DOCKER */}
          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sky-950">Dockerfile Multi-Stage Sudah Dibuat</h4>
                  <p className="text-[11px] text-sky-800 mt-0.5">
                    Mendukung deployment ke <strong>Google Cloud Run, Railway, Render, Fly.io, Coolify, atau CapRover</strong> secara langsung.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">Build & Jalankan Docker Container:</h4>
                <div className="relative bg-slate-900 text-slate-100 rounded-xl p-3 font-mono text-[11px] space-y-1">
                  <div>docker build -t buku-induk-smp .</div>
                  <div>docker run -d -p 3000:3000 --name buku-induk buku-induk-smp</div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'docker build -t buku-induk-smp .\ndocker run -d -p 3000:3000 --name buku-induk buku-induk-smp',
                        'docker-cmd'
                      )
                    }
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === 'docker-cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-600">
            Aplikasi siap di-deploy langsung tanpa konfigurasi tambahan.
          </span>
          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
