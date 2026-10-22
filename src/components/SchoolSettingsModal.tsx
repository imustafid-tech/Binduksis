import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProfilSekolah } from '../types/student';
import { Building2, X, Save } from 'lucide-react';

export const SchoolSettingsModal: React.FC = () => {
  const { isSchoolSettingsOpen, setIsSchoolSettingsOpen, profilSekolah, updateProfilSekolah } = useApp();

  const [form, setForm] = useState<ProfilSekolah>({ ...profilSekolah });

  if (!isSchoolSettingsOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfilSekolah(form);
    setIsSchoolSettingsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Pengaturan Profil Sekolah & Kepala Sekolah</h2>
          </div>
          <button
            onClick={() => setIsSchoolSettingsOpen(false)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                value={form.namaSekolah}
                onChange={(e) => setForm({ ...form, namaSekolah: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={form.npsn}
                onChange={(e) => setForm({ ...form, npsn: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Statistik Sekolah (NSS)</label>
              <input
                type="text"
                value={form.nss}
                onChange={(e) => setForm({ ...form, nss: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Akreditasi</label>
              <input
                type="text"
                value={form.akreditasi}
                onChange={(e) => setForm({ ...form, akreditasi: e.target.value })}
                placeholder="A (Unggul) - 97"
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
            <input
              type="text"
              value={form.alamatLengkap}
              onChange={(e) => setForm({ ...form, alamatLengkap: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kelurahan</label>
              <input
                type="text"
                value={form.kelurahan}
                onChange={(e) => setForm({ ...form, kelurahan: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
              <input
                type="text"
                value={form.kecamatan}
                onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kabupaten/Kota</label>
              <input
                type="text"
                value={form.kabupatenKota}
                onChange={(e) => setForm({ ...form, kabupatenKota: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
              <input
                type="text"
                value={form.provinsi}
                onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* Kepala Sekolah & TU */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Pejabat Kepala Sekolah</span>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={form.namaKepalaSekolah}
                  onChange={(e) => setForm({ ...form, namaKepalaSekolah: e.target.value })}
                  className="w-full bg-white border border-slate-300 p-2 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  value={form.nipKepalaSekolah}
                  onChange={(e) => setForm({ ...form, nipKepalaSekolah: e.target.value })}
                  className="w-full bg-white border border-slate-300 p-2 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Petugas Tata Usaha Buku Induk</span>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">Nama Petugas Tata Usaha</label>
                <input
                  type="text"
                  value={form.namaPetugasTataUsaha}
                  onChange={(e) => setForm({ ...form, namaPetugasTataUsaha: e.target.value })}
                  className="w-full bg-white border border-slate-300 p-2 rounded-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5">NIP Petugas Tata Usaha</label>
                <input
                  type="text"
                  value={form.nipPetugasTataUsaha}
                  onChange={(e) => setForm({ ...form, nipPetugasTataUsaha: e.target.value })}
                  className="w-full bg-white border border-slate-300 p-2 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSchoolSettingsOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Sekolah</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
