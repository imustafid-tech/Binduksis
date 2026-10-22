import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Siswa, PrestasiSiswa, RaporSemester, JenisKelamin, Agama, StatusSiswa, StatusHidup } from '../types/student';
import {
  X,
  Save,
  User,
  Users,
  School,
  BookOpen,
  Award,
  ScrollText,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { validateNis, validateNisn, validateNik } from '../utils/studentLogic';

const DEFAULT_MAPEL_KEYS = [
  { key: 'pai', label: 'PAI & Budi Pekerti' },
  { key: 'ppkn', label: 'Pendidikan Pancasila / PPKn' },
  { key: 'indonesia', label: 'Bahasa Indonesia' },
  { key: 'matematika', label: 'Matematika' },
  { key: 'ipa', label: 'Ilmu Pengetahuan Alam (IPA)' },
  { key: 'ips', label: 'Ilmu Pengetahuan Sosial (IPS)' },
  { key: 'inggris', label: 'Bahasa Inggris' },
  { key: 'pjok', label: 'PJOK / Penjasorkes' },
  { key: 'seniBudaya', label: 'Seni Budaya' },
  { key: 'informatika', label: 'Informatika' },
  { key: 'muatanLokal', label: 'Muatan Lokal / Bahasa Daerah' },
];

export const StudentFormModal: React.FC = () => {
  const { isFormOpen, setIsFormOpen, editingStudent, setEditingStudent, addStudent, updateStudent, showToast } =
    useApp();

  const [activeTab, setActiveTab] = useState<'biodata' | 'ortu' | 'sd' | 'akademik' | 'prestasi' | 'kelulusan'>('biodata');

  // Form State
  const [formData, setFormData] = useState<Partial<Siswa>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Achievements sub-state
  const [prestasiList, setPrestasiList] = useState<PrestasiSiswa[]>([]);
  const [newPrestasi, setNewPrestasi] = useState<Partial<PrestasiSiswa>>({
    namaPrestasi: '',
    bidang: 'Akademik',
    tingkat: 'Kabupaten/Kota',
    peringkat: 'Juara 1',
    tahun: new Date().getFullYear(),
    penyelenggara: '',
    nomorSertifikat: '',
  });

  // Academic semester records sub-state
  const [semesterRecords, setSemesterRecords] = useState<RaporSemester[]>([]);

  useEffect(() => {
    if (editingStudent) {
      setFormData(JSON.parse(JSON.stringify(editingStudent)));
      setPrestasiList(editingStudent.prestasi || []);
      setSemesterRecords(editingStudent.recordsSemester || []);
    } else {
      // Default initial new student form
      setFormData({
        nis: '',
        nisn: '',
        nik: '',
        namaLengkap: '',
        namaPanggilan: '',
        jenisKelamin: 'L',
        tempatLahir: '',
        tanggalLahir: '2011-01-01',
        agama: 'Islam',
        kewarganegaraan: 'WNI',
        anakKe: 1,
        jumlahSaudaraKandung: 1,
        bahasaRumah: 'Bahasa Indonesia',
        golonganDarah: '-',
        tinggiBadanCm: 155,
        beratBadanKg: 45,
        riwayatPenyakit: 'Tidak Ada',
        alamat: '',
        rtRw: '001/001',
        kelurahan: '',
        kecamatan: '',
        kabupatenKota: 'Jakarta Selatan',
        provinsi: 'DKI Jakarta',
        kodePos: '',
        tinggalBersama: 'Orang Tua',
        transportasi: 'Sepeda Motor',
        noHpSiswa: '',
        emailSiswa: '',
        pasFotoUrl: '',

        dataAyah: {
          nama: '',
          nik: '',
          tempatLahir: '',
          tanggalLahir: '1975-01-01',
          agama: 'Islam',
          pendidikan: 'S1',
          pekerjaan: '',
          penghasilanBulanan: '3 - 5 Juta',
          noTeleponWa: '',
          alamat: '',
          statusHidup: 'Masih Hidup',
        },
        dataIbu: {
          nama: '',
          nik: '',
          tempatLahir: '',
          tanggalLahir: '1978-01-01',
          agama: 'Islam',
          pendidikan: 'S1',
          pekerjaan: '',
          penghasilanBulanan: '3 - 5 Juta',
          noTeleponWa: '',
          alamat: '',
          statusHidup: 'Masih Hidup',
        },

        statusMasuk: 'Siswa Baru',
        tanggalMasuk: new Date().toISOString().slice(0, 10),
        diterimaDiKelas: '7A',
        namaSdAsal: '',
        noIjazahSd: '',
        tanggalIjazahSd: '2024-06-15',
        nilaiRataRataSd: 85,

        rombelSaatIni: '7A',
        tahunAjaranMasuk: '2024/2025',
        statusSiswa: 'Aktif',
      });
      setPrestasiList([]);
      setSemesterRecords([]);
    }
    setActiveTab('biodata');
    setErrors({});
  }, [editingStudent, isFormOpen]);

  if (!isFormOpen) return null;

  const validateForm = () => {
    const err: Record<string, string> = {};
    if (!formData.namaLengkap?.trim()) err.namaLengkap = 'Nama lengkap wajib diisi.';
    if (!formData.nis?.trim()) err.nis = 'NIS wajib diisi.';
    else if (!validateNis(formData.nis)) err.nis = 'Format NIS harus 4-10 digit angka.';

    if (!formData.nisn?.trim()) err.nisn = 'NISN wajib diisi.';
    else if (!validateNisn(formData.nisn)) err.nisn = 'Format NISN harus tepat 10 digit angka.';

    if (!formData.tempatLahir?.trim()) err.tempatLahir = 'Tempat lahir wajib diisi.';
    if (!formData.dataAyah?.nama?.trim()) err.namaAyah = 'Nama ayah wajib diisi.';
    if (!formData.dataIbu?.nama?.trim()) err.namaIbu = 'Nama ibu wajib diisi.';
    if (!formData.namaSdAsal?.trim()) err.namaSdAsal = 'Nama SD asal wajib diisi.';
    if (!formData.noIjazahSd?.trim()) err.noIjazahSd = 'Nomor Ijazah SD wajib diisi.';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Harap periksa kolom yang masih kurang atau belum valid.', 'error');
      return;
    }

    const payload: Omit<Siswa, 'id'> = {
      ...(formData as Siswa),
      prestasi: prestasiList,
      recordsSemester: semesterRecords,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, payload);
    } else {
      addStudent(payload);
    }

    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleAddPrestasi = () => {
    if (!newPrestasi.namaPrestasi?.trim()) {
      showToast('Nama kejuaraan/prestasi harus diisi', 'error');
      return;
    }
    const item: PrestasiSiswa = {
      id: `pst-${Date.now().toString(36)}`,
      namaPrestasi: newPrestasi.namaPrestasi,
      bidang: newPrestasi.bidang || 'Akademik',
      tingkat: newPrestasi.tingkat || 'Kabupaten/Kota',
      peringkat: newPrestasi.peringkat || 'Juara 1',
      tahun: Number(newPrestasi.tahun) || new Date().getFullYear(),
      penyelenggara: newPrestasi.penyelenggara || 'Dinas Pendidikan',
      nomorSertifikat: newPrestasi.nomorSertifikat || '',
      keterangan: newPrestasi.keterangan || '',
    };
    setPrestasiList([...prestasiList, item]);
    setNewPrestasi({
      namaPrestasi: '',
      bidang: 'Akademik',
      tingkat: 'Kabupaten/Kota',
      peringkat: 'Juara 1',
      tahun: new Date().getFullYear(),
      penyelenggara: '',
      nomorSertifikat: '',
      keterangan: '',
    });
    showToast('Prestasi berhasil ditambahkan ke daftar riwayat siswa', 'success');
  };

  const handleRemovePrestasi = (id: string) => {
    setPrestasiList(prestasiList.filter((p) => p.id !== id));
  };

  const handleAddSemesterRecord = () => {
    const nextSem = semesterRecords.length + 1;
    if (nextSem > 6) {
      showToast('Maksimal 6 semester untuk jenjang SMP.', 'error');
      return;
    }
    const newRecord: RaporSemester = {
      semester: nextSem,
      kelas: nextSem <= 2 ? '7A' : nextSem <= 4 ? '8A' : '9A',
      tahunAjaran: `${2023 + Math.floor((nextSem - 1) / 2)}/${2024 + Math.floor((nextSem - 1) / 2)}`,
      nilaiMapel: {
        pai: 85,
        ppkn: 85,
        indonesia: 88,
        matematika: 85,
        ipa: 85,
        ips: 85,
        inggris: 85,
        pjok: 85,
        seniBudaya: 85,
        informatika: 85,
        muatanLokal: 85,
      },
      rataRata: 85.27,
      peringkatKelas: 1,
      kehadiran: { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      ekstrakurikuler: [{ nama: 'Pramuka Penggalang', predikat: 'Baik' }],
      statusKenaikan: nextSem === 6 ? 'Lulus' : 'Naik Kelas',
    };
    setSemesterRecords([...semesterRecords, newRecord]);
    showToast(`Semester ${nextSem} berhasil ditambahkan`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              {editingStudent ? `Edit Buku Induk: ${editingStudent.namaLengkap}` : 'Registrasi Siswa Baru ke Buku Induk'}
            </h2>
            <p className="text-xs text-slate-400">
              Pengisian berkas induk resmi Kementerian Pendidikan dan Kebudayaan RI
            </p>
          </div>
          <button
            onClick={() => {
              setIsFormOpen(false);
              setEditingStudent(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 overflow-x-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('biodata')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'biodata'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Identitas Diri</span>
            {errors.namaLengkap || errors.nis || errors.nisn ? (
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ortu')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ortu'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>2. Data Orang Tua (Ayah & Ibu)</span>
            {errors.namaAyah || errors.namaIbu ? (
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sd')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'sd'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>3. Ijazah SD Asal</span>
            {errors.namaSdAsal || errors.noIjazahSd ? (
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('akademik')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'akademik'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Akademik & Rapor ({semesterRecords.length} Smt)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prestasi')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'prestasi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>5. Riwayat Prestasi ({prestasiList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kelulusan')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'kelulusan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>6. Ijazah SMP & Kelulusan</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: IDENTITAS DIRI SISWA */}
          {activeTab === 'biodata' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                Bagian A: Keterangan Tentang Diri Peserta Didik
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Induk Siswa (NIS SMP) *
                  </label>
                  <input
                    type="text"
                    value={formData.nis || ''}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 240101"
                    className={`w-full bg-slate-50 border text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.nis ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.nis && <p className="text-[10px] text-rose-500 mt-0.5">{errors.nis}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN (10 Digit Kemendikbud) *
                  </label>
                  <input
                    type="text"
                    value={formData.nisn || ''}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0098273641"
                    maxLength={10}
                    className={`w-full bg-slate-50 border text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.nisn ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.nisn && <p className="text-[10px] text-rose-500 mt-0.5">{errors.nisn}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK Siswa (16 Digit KTP/KK)
                  </label>
                  <input
                    type="text"
                    value={formData.nik || ''}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="Contoh: 3174011405100003"
                    maxLength={16}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    value={formData.namaLengkap || ''}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Sesuai akta kelahiran"
                    className={`w-full bg-slate-50 border text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.namaLengkap ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                  {errors.namaLengkap && <p className="text-[10px] text-rose-500 mt-0.5">{errors.namaLengkap}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={formData.namaPanggilan || ''}
                    onChange={(e) => setFormData({ ...formData, namaPanggilan: e.target.value })}
                    placeholder="Contoh: Radit"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.jenisKelamin || 'L'}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as JenisKelamin })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Kota kelahiran"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agama *
                  </label>
                  <select
                    value={formData.agama || 'Islam'}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as Agama })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
              </div>

              {/* Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Jalan / Tempat Tinggal
                  </label>
                  <input
                    type="text"
                    value={formData.alamat || ''}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Jl. Merdeka No. 12"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RT / RW</label>
                  <input
                    type="text"
                    value={formData.rtRw || ''}
                    onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                    placeholder="002/005"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelurahan / Desa</label>
                  <input
                    type="text"
                    value={formData.kelurahan || ''}
                    onChange={(e) => setFormData({ ...formData, kelurahan: e.target.value })}
                    placeholder="Kelurahan"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formData.kecamatan || ''}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    placeholder="Kecamatan"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kabupaten / Kota</label>
                  <input
                    type="text"
                    value={formData.kabupatenKota || ''}
                    onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                    placeholder="Kota"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP Siswa</label>
                  <input
                    type="text"
                    value={formData.noHpSiswa || ''}
                    onChange={(e) => setFormData({ ...formData, noHpSiswa: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Pas Foto (3x4)</label>
                  <input
                    type="text"
                    value={formData.pasFotoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, pasFotoUrl: e.target.value })}
                    placeholder="https://... atau biarkan kosong"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Physical & family traits */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Anak Ke-</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.anakKe || 1}
                    onChange={(e) => setFormData({ ...formData, anakKe: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jml Saudara</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.jumlahSaudaraKandung || 0}
                    onChange={(e) => setFormData({ ...formData, jumlahSaudaraKandung: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Golongan Darah</label>
                  <select
                    value={formData.golonganDarah || '-'}
                    onChange={(e) => setFormData({ ...formData, golonganDarah: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                  >
                    <option value="-">-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tinggi (cm)</label>
                  <input
                    type="number"
                    value={formData.tinggiBadanCm || 155}
                    onChange={(e) => setFormData({ ...formData, tinggiBadanCm: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Berat (kg)</label>
                  <input
                    type="number"
                    value={formData.beratBadanKg || 45}
                    onChange={(e) => setFormData({ ...formData, beratBadanKg: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-2.5 py-1.5 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA ORANG TUA (AYAH & IBU) MENDETAIL */}
          {activeTab === 'ortu' && (
            <div className="space-y-6">
              {/* Data Ayah Kandung */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    Data Lengkap Ayah Kandung
                  </h4>
                  <span className="text-[10px] text-blue-700 font-medium">Buku Induk Bagian B.1</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap Ayah *
                    </label>
                    <input
                      type="text"
                      value={formData.dataAyah?.nama || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), nama: e.target.value },
                        })
                      }
                      placeholder="Nama lengkap & gelar"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIK Ayah (16 Digit)</label>
                    <input
                      type="text"
                      value={formData.dataAyah?.nik || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), nik: e.target.value },
                        })
                      }
                      placeholder="NIK Kependudukan"
                      maxLength={16}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                    <select
                      value={formData.dataAyah?.pendidikan || 'S1'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), pendidikan: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="SD">SD/Sederajat</option>
                      <option value="SMP">SMP/Sederajat</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="D3">Diploma (D3)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2">Magister (S2)</option>
                      <option value="S3">Doktor (S3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={formData.dataAyah?.pekerjaan || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), pekerjaan: e.target.value },
                        })
                      }
                      placeholder="PNS / Swasta / Wiraswasta"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Penghasilan Bulanan</label>
                    <select
                      value={formData.dataAyah?.penghasilanBulanan || '3 - 5 Juta'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), penghasilanBulanan: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="< 1 Juta">&lt; 1 Juta</option>
                      <option value="1 - 3 Juta">1 - 3 Juta</option>
                      <option value="3 - 5 Juta">3 - 5 Juta</option>
                      <option value="5 - 10 Juta">5 - 10 Juta</option>
                      <option value="> 10 Juta">&gt; 10 Juta</option>
                      <option value="Tidak Berpenghasilan">Tidak Berpenghasilan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">No. HP / WA Ayah</label>
                    <input
                      type="text"
                      value={formData.dataAyah?.noTeleponWa || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), noTeleponWa: e.target.value },
                        })
                      }
                      placeholder="0812xxxxxxx"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Ayah</label>
                    <input
                      type="text"
                      value={formData.dataAyah?.alamat || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), alamat: e.target.value },
                        })
                      }
                      placeholder="Alamat domisili ayah"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Keberadaan</label>
                    <select
                      value={formData.dataAyah?.statusHidup || 'Masih Hidup'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAyah: { ...(formData.dataAyah as any), statusHidup: e.target.value as StatusHidup },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="Masih Hidup">Masih Hidup</option>
                      <option value="Meninggal Dunia">Meninggal Dunia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Ibu Kandung */}
              <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-pink-200">
                  <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-700" />
                    Data Lengkap Ibu Kandung
                  </h4>
                  <span className="text-[10px] text-pink-700 font-medium">Buku Induk Bagian B.2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap Ibu *
                    </label>
                    <input
                      type="text"
                      value={formData.dataIbu?.nama || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), nama: e.target.value },
                        })
                      }
                      placeholder="Nama lengkap ibu kandung"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIK Ibu (16 Digit)</label>
                    <input
                      type="text"
                      value={formData.dataIbu?.nik || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), nik: e.target.value },
                        })
                      }
                      placeholder="NIK Kependudukan"
                      maxLength={16}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pendidikan Terakhir</label>
                    <select
                      value={formData.dataIbu?.pendidikan || 'S1'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), pendidikan: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="SD">SD/Sederajat</option>
                      <option value="SMP">SMP/Sederajat</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="D3">Diploma (D3)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2">Magister (S2)</option>
                      <option value="S3">Doktor (S3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={formData.dataIbu?.pekerjaan || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), pekerjaan: e.target.value },
                        })
                      }
                      placeholder="Ibu Rumah Tangga / Pegawai"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Penghasilan Bulanan</label>
                    <select
                      value={formData.dataIbu?.penghasilanBulanan || 'Tidak Berpenghasilan'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), penghasilanBulanan: e.target.value },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="Tidak Berpenghasilan">Tidak Berpenghasilan / IRT</option>
                      <option value="< 1 Juta">&lt; 1 Juta</option>
                      <option value="1 - 3 Juta">1 - 3 Juta</option>
                      <option value="3 - 5 Juta">3 - 5 Juta</option>
                      <option value="5 - 10 Juta">5 - 10 Juta</option>
                      <option value="> 10 Juta">&gt; 10 Juta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">No. HP / WA Ibu</label>
                    <input
                      type="text"
                      value={formData.dataIbu?.noTeleponWa || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), noTeleponWa: e.target.value },
                        })
                      }
                      placeholder="0812xxxxxxx"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Ibu</label>
                    <input
                      type="text"
                      value={formData.dataIbu?.alamat || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), alamat: e.target.value },
                        })
                      }
                      placeholder="Alamat domisili ibu"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Keberadaan</label>
                    <select
                      value={formData.dataIbu?.statusHidup || 'Masih Hidup'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataIbu: { ...(formData.dataIbu as any), statusHidup: e.target.value as StatusHidup },
                        })
                      }
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    >
                      <option value="Masih Hidup">Masih Hidup</option>
                      <option value="Meninggal Dunia">Meninggal Dunia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IJAZAH SD ASAL */}
          {activeTab === 'sd' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center gap-2">
                <School className="w-4 h-4 text-emerald-600" />
                Bagian C: Keterangan Asal Pendidikan & Riwayat Ijazah SD/MI
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Masuk ke SMP *
                  </label>
                  <select
                    value={formData.statusMasuk || 'Siswa Baru'}
                    onChange={(e) => setFormData({ ...formData, statusMasuk: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  >
                    <option value="Siswa Baru">Siswa Baru (Kelas 7)</option>
                    <option value="Pindahan">Siswa Pindahan (Mutasi Masuk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Diterima Masuk SMP *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalMasuk || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diterima di Rombel Kelas *
                  </label>
                  <input
                    type="text"
                    value={formData.diterimaDiKelas || '7A'}
                    onChange={(e) => setFormData({ ...formData, diterimaDiKelas: e.target.value })}
                    placeholder="Contoh: 7A"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama SD / MI Asal Kelulusan *
                  </label>
                  <input
                    type="text"
                    value={formData.namaSdAsal || ''}
                    onChange={(e) => setFormData({ ...formData, namaSdAsal: e.target.value })}
                    placeholder="Contoh: SD Negeri Menteng 01 Pagi"
                    className={`w-full bg-slate-50 border text-xs px-3 py-2 rounded-lg ${
                      errors.namaSdAsal ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.namaSdAsal && <p className="text-[10px] text-rose-500 mt-0.5">{errors.namaSdAsal}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NPSN SD Asal
                  </label>
                  <input
                    type="text"
                    value={formData.npsnSdAsal || ''}
                    onChange={(e) => setFormData({ ...formData, npsnSdAsal: e.target.value })}
                    placeholder="Nomor Pokok Sekolah Nasional"
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Seri Ijazah SD *
                  </label>
                  <input
                    type="text"
                    value={formData.noIjazahSd || ''}
                    onChange={(e) => setFormData({ ...formData, noIjazahSd: e.target.value })}
                    placeholder="DN-01/D-SD/23/0012345"
                    className={`w-full bg-slate-50 border text-xs px-3 py-2 rounded-lg font-mono ${
                      errors.noIjazahSd ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {errors.noIjazahSd && <p className="text-[10px] text-rose-500 mt-0.5">{errors.noIjazahSd}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Terbit Ijazah SD *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalIjazahSd || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalIjazahSd: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nilai Rata-rata Ijazah SD
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.nilaiRataRataSd || 85}
                    onChange={(e) => setFormData({ ...formData, nilaiRataRataSd: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap SD Asal
                </label>
                <input
                  type="text"
                  value={formData.alamatSdAsal || ''}
                  onChange={(e) => setFormData({ ...formData, alamatSdAsal: e.target.value })}
                  placeholder="Jl. Alamat SD asal"
                  className="w-full bg-slate-50 border border-slate-300 text-xs px-3 py-2 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AKADEMIK & RAPOR SMP */}
          {activeTab === 'akademik' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Bagian D: Perkembangan Akademik & Nilai Rapor Semester di SMP
                  </h3>
                  <p className="text-xs text-slate-500">
                    Catatan nilai rapor kumulatif per semester yang disahkan dalam Buku Induk
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSemesterRecord}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Semester ({semesterRecords.length + 1})</span>
                </button>
              </div>

              {/* Current Class & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rombel / Kelas Saat Ini</label>
                  <input
                    type="text"
                    value={formData.rombelSaatIni || '7A'}
                    onChange={(e) => setFormData({ ...formData, rombelSaatIni: e.target.value })}
                    placeholder="Contoh: 7A, 8B, 9A"
                    className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Ajaran Masuk</label>
                  <input
                    type="text"
                    value={formData.tahunAjaranMasuk || '2024/2025'}
                    onChange={(e) => setFormData({ ...formData, tahunAjaranMasuk: e.target.value })}
                    placeholder="Contoh: 2024/2025"
                    className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              {semesterRecords.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-500 text-xs">
                  <p>Belum ada rekaman nilai rapor semester yang diinputkan.</p>
                  <button
                    type="button"
                    onClick={handleAddSemesterRecord}
                    className="mt-2 text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    + Klik untuk menambah Data Semester 1
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {semesterRecords.map((sem, sIdx) => (
                    <div key={sem.semester} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                            Semester {sem.semester} (Kelas {sem.kelas} • TA {sem.tahunAjaran})
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            Rata-rata: {sem.rataRata} • Peringkat: #{sem.peringkatKelas || 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSemesterRecords(semesterRecords.filter((_, i) => i !== sIdx))}
                          className="text-slate-400 hover:text-rose-600 text-xs cursor-pointer p-1"
                          title="Hapus semester ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Mapel Scores Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                        {DEFAULT_MAPEL_KEYS.map(({ key, label }) => (
                          <div key={key} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <span className="block text-[10px] text-slate-500 font-medium truncate" title={label}>
                              {label.split(' ')[0]}
                            </span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={sem.nilaiMapel[key as keyof typeof sem.nilaiMapel] || 85}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updatedMapel = { ...sem.nilaiMapel, [key]: val };
                                const values = Object.values(updatedMapel);
                                const avg = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
                                const updatedList = [...semesterRecords];
                                updatedList[sIdx] = {
                                  ...updatedList[sIdx],
                                  nilaiMapel: updatedMapel,
                                  rataRata: avg,
                                };
                                setSemesterRecords(updatedList);
                              }}
                              className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-bold text-slate-800 text-center mt-1"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Notes & Attendance */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block">Ketidakhadiran</label>
                          <span className="text-[11px] text-slate-700">
                            Sakit: {sem.kehadiran.sakit} • Izin: {sem.kehadiran.izin} • Alpa:{' '}
                            {sem.kehadiran.tanpaKeterangan}
                          </span>
                        </div>
                        <div className="sm:col-span-3">
                          <label className="text-[10px] text-slate-500 font-medium block">
                            Catatan Perkembangan & Karakter
                          </label>
                          <input
                            type="text"
                            value={sem.catatanPerkembangan || ''}
                            onChange={(e) => {
                              const updatedList = [...semesterRecords];
                              updatedList[sIdx] = {
                                ...updatedList[sIdx],
                                catatanPerkembangan: e.target.value,
                              };
                              setSemesterRecords(updatedList);
                            }}
                            placeholder="Catatan wali kelas untuk Buku Induk"
                            className="w-full bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RIWAYAT PRESTASI SISWA MENDETAIL */}
          {activeTab === 'prestasi' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Bagian E: Riwayat Prestasi & Kejuaraan Siswa Mendetail
                </h3>
                <p className="text-xs text-slate-500">
                  Pencatatan prestasi tingkat Sekolah, Kecamatan, Kab/Kota, Provinsi, Nasional, hingga Internasional
                </p>
              </div>

              {/* Form Input Prestasi Baru */}
              <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="font-semibold text-xs text-amber-900">Tambah Prestasi / Piagam Penghargaan:</div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Kejuaraan / Lomba *
                    </label>
                    <input
                      type="text"
                      value={newPrestasi.namaPrestasi || ''}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, namaPrestasi: e.target.value })}
                      placeholder="Contoh: OSN Matematika / FLS2N Tari Kreasi"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bidang Lomba</label>
                    <select
                      value={newPrestasi.bidang || 'Akademik'}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, bidang: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    >
                      <option value="Akademik">Akademik / Sains</option>
                      <option value="Olahraga">Olahraga (O2SN, dsb)</option>
                      <option value="Seni & Budaya">Seni & Budaya (FLS2N)</option>
                      <option value="Keagamaan">Keagamaan (MTQ, dsb)</option>
                      <option value="Teknologi / Riset">Teknologi / Riset / Robotik</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tingkat Lomba</label>
                    <select
                      value={newPrestasi.tingkat || 'Kabupaten/Kota'}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, tingkat: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    >
                      <option value="Sekolah">Tingkat Sekolah</option>
                      <option value="Kecamatan">Tingkat Kecamatan</option>
                      <option value="Kabupaten/Kota">Tingkat Kabupaten/Kota</option>
                      <option value="Provinsi">Tingkat Provinsi</option>
                      <option value="Nasional">Tingkat Nasional</option>
                      <option value="Internasional">Tingkat Internasional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Peringkat / Juara</label>
                    <select
                      value={newPrestasi.peringkat || 'Juara 1'}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, peringkat: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    >
                      <option value="Juara 1">Juara 1 (Emas)</option>
                      <option value="Juara 2">Juara 2 (Perak)</option>
                      <option value="Juara 3">Juara 3 (Perunggu)</option>
                      <option value="Harapan 1">Harapan 1</option>
                      <option value="Harapan 2">Harapan 2</option>
                      <option value="Finalis">Finalis</option>
                      <option value="Peserta">Peserta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tahun Perolehan</label>
                    <input
                      type="number"
                      value={newPrestasi.tahun || new Date().getFullYear()}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, tahun: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Penyelenggara</label>
                    <input
                      type="text"
                      value={newPrestasi.penyelenggara || ''}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, penyelenggara: e.target.value })}
                      placeholder="Disdik / BPTI Kemendikbud"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Piagam / Sertifikat
                    </label>
                    <input
                      type="text"
                      value={newPrestasi.nomorSertifikat || ''}
                      onChange={(e) => setNewPrestasi({ ...newPrestasi, nomorSertifikat: e.target.value })}
                      placeholder="Contoh: 0482/BPTI/OSN-SMP/IX/2024"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-1.5 rounded-lg font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddPrestasi}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambahkan ke Riwayat</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Prestasi List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Daftar Prestasi Tercatat ({prestasiList.length}):</div>
                {prestasiList.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                    Belum ada prestasi terdaftar untuk siswa ini.
                  </div>
                ) : (
                  prestasiList.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.namaPrestasi}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            {p.peringkat}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Tk. {p.tingkat}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Tahun {p.tahun} • Penyelenggara: {p.penyelenggara}
                          {p.nomorSertifikat && (
                            <span className="ml-2 font-mono text-[10px] text-slate-400">
                              (No: {p.nomorSertifikat})
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrestasi(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Hapus prestasi ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DATA KELULUSAN & IJAZAH SMP */}
          {activeTab === 'kelulusan' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-200 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-purple-600" />
                Bagian F: Riwayat Kelulusan & Data Ijazah SMP
              </h3>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Siswa Saat Ini *
                    </label>
                    <select
                      value={formData.statusSiswa || 'Aktif'}
                      onChange={(e) => setFormData({ ...formData, statusSiswa: e.target.value as StatusSiswa })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-bold"
                    >
                      <option value="Aktif">Aktif (Sedang Menempuh Pendidikan)</option>
                      <option value="Lulus">Lulus (Tamat Belajar di SMP ini)</option>
                      <option value="Pindah Sekolah">Pindah Sekolah (Mutasi Keluar)</option>
                      <option value="Keluar">Keluar (Mengundurkan Diri)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Kelulusan
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalKelulusan || ''}
                      onChange={(e) => setFormData({ ...formData, tanggalKelulusan: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor SKL (Surat Keterangan Lulus)
                    </label>
                    <input
                      type="text"
                      value={formData.noSkl || ''}
                      onChange={(e) => setFormData({ ...formData, noSkl: e.target.value })}
                      placeholder="421.3/088/SMPN1-TN/SKL/VI/2024"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Seri Ijazah SMP Resmi Kemendikbud
                    </label>
                    <input
                      type="text"
                      value={formData.noIjazahSmp || ''}
                      onChange={(e) => setFormData({ ...formData, noIjazahSmp: e.target.value })}
                      placeholder="DN-01/D-SMP/K13/24/0012345"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-mono font-bold text-purple-900"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Wajib dicantumkan setelah blangko ijazah SMP terbit resmi dari dinas
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Terbit Ijazah SMP
                    </label>
                    <input
                      type="date"
                      value={formData.tanggalIjazahSmp || ''}
                      onChange={(e) => setFormData({ ...formData, tanggalIjazahSmp: e.target.value })}
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Peserta Ujian / Asesmen SMP
                    </label>
                    <input
                      type="text"
                      value={formData.noPesertaUjianSmp || ''}
                      onChange={(e) => setFormData({ ...formData, noPesertaUjianSmp: e.target.value })}
                      placeholder="01-24-0120-0001-8"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nilai Rata-rata Ujian / Ijazah SMP
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.nilaiRataRataUjianSmp || ''}
                      onChange={(e) => setFormData({ ...formData, nilaiRataRataUjianSmp: Number(e.target.value) })}
                      placeholder="92.5"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Melanjutkan Pendidikan Ke
                    </label>
                    <input
                      type="text"
                      value={formData.melanjutkanKe || ''}
                      onChange={(e) => setFormData({ ...formData, melanjutkanKe: e.target.value })}
                      placeholder="SMA Negeri 8 Jakarta / SMK / Pesantren"
                      className="w-full bg-white border border-slate-300 text-xs px-3 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catatan Kelulusan Tambahan
                  </label>
                  <textarea
                    rows={2}
                    value={formData.catatanTambahan || ''}
                    onChange={(e) => setFormData({ ...formData, catatanTambahan: e.target.value })}
                    placeholder="Prestasi kelulusan, predikat kelulusan, atau catatan mutasi..."
                    className="w-full bg-white border border-slate-300 text-xs p-2.5 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingStudent(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>

              {/* Prev tab button */}
              {activeTab !== 'biodata' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: ('biodata' | 'ortu' | 'sd' | 'akademik' | 'prestasi' | 'kelulusan')[] = [
                      'biodata',
                      'ortu',
                      'sd',
                      'akademik',
                      'prestasi',
                      'kelulusan',
                    ];
                    const idx = tabs.indexOf(activeTab);
                    if (idx > 0) setActiveTab(tabs[idx - 1]);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  &larr; Sebelumnya
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Next tab button */}
              {activeTab !== 'kelulusan' && (
                <button
                  type="button"
                  onClick={() => {
                    const tabs: ('biodata' | 'ortu' | 'sd' | 'akademik' | 'prestasi' | 'kelulusan')[] = [
                      'biodata',
                      'ortu',
                      'sd',
                      'akademik',
                      'prestasi',
                      'kelulusan',
                    ];
                    const idx = tabs.indexOf(activeTab);
                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  Langkah Berikutnya &rarr;
                </button>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan ke Buku Induk</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
