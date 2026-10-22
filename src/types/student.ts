export type JenisKelamin = 'L' | 'P';
export type Agama = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu';
export type StatusSiswa = 'Aktif' | 'Lulus' | 'Pindah Sekolah' | 'Keluar';
export type StatusHidup = 'Masih Hidup' | 'Meninggal Dunia';

export interface DataOrangTua {
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: Agama;
  pendidikan: string;
  pekerjaan: string;
  penghasilanBulanan: string;
  noTeleponWa: string;
  alamat: string;
  statusHidup: StatusHidup;
}

export interface DataWali {
  nama: string;
  nik: string;
  hubunganKeluarga: string;
  pendidikan: string;
  pekerjaan: string;
  penghasilanBulanan: string;
  noTeleponWa: string;
  alamat: string;
}

export interface PrestasiSiswa {
  id: string;
  namaPrestasi: string;
  bidang: 'Akademik' | 'Olahraga' | 'Seni & Budaya' | 'Keagamaan' | 'Teknologi / Riset' | 'Lainnya';
  tingkat: 'Sekolah' | 'Kecamatan' | 'Kabupaten/Kota' | 'Provinsi' | 'Nasional' | 'Internasional';
  peringkat: 'Juara 1' | 'Juara 2' | 'Juara 3' | 'Harapan 1' | 'Harapan 2' | 'Finalis' | 'Peserta';
  tahun: number;
  penyelenggara: string;
  nomorSertifikat?: string;
  keterangan?: string;
}

export interface RaporSemester {
  semester: number; // 1 s.d 6
  kelas: string; // e.g., '7A', '8B', '9A'
  tahunAjaran: string; // e.g., '2023/2024'
  nilaiMapel: {
    pai: number;
    ppkn: number;
    indonesia: number;
    matematika: number;
    ipa: number;
    ips: number;
    inggris: number;
    pjok: number;
    seniBudaya: number;
    informatika: number;
    muatanLokal: number;
  };
  rataRata: number;
  peringkatKelas?: number;
  kehadiran: {
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
  };
  ekstrakurikuler: Array<{
    nama: string;
    predikat: 'Sangat Baik' | 'Baik' | 'Cukup';
  }>;
  catatanPerkembangan?: string;
  statusKenaikan?: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Sedang Berjalan';
}

export interface Siswa {
  id: string;
  // Bagian A: Keterangan Pribadi
  nis: string; // Nomor Induk Siswa di SMP
  nisn: string; // 10 Digit
  nik: string; // 16 Digit
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: Agama;
  kewarganegaraan: string;
  anakKe: number;
  jumlahSaudaraKandung: number;
  bahasaRumah: string;
  golonganDarah: 'A' | 'B' | 'AB' | 'O' | '-';
  tinggiBadanCm?: number;
  beratBadanKg?: number;
  riwayatPenyakit?: string;
  alamat: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  tinggalBersama: 'Orang Tua' | 'Wali' | 'Asrama / Pondok' | 'Kost' | 'Lainnya';
  transportasi: 'Jalan Kaki' | 'Sepeda' | 'Sepeda Motor' | 'Angkutan Umum' | 'Antar Jemput' | 'Lainnya';
  noHpSiswa: string;
  emailSiswa?: string;
  pasFotoUrl?: string;

  // Bagian B: Data Orang Tua & Wali
  dataAyah: DataOrangTua;
  dataIbu: DataOrangTua;
  dataWali?: DataWali;

  // Bagian C: Asal Pendidikan & Riwayat Ijazah SD
  statusMasuk: 'Siswa Baru' | 'Pindahan';
  tanggalMasuk: string;
  diterimaDiKelas: string;
  namaSdAsal: string;
  npsnSdAsal?: string;
  alamatSdAsal?: string;
  noIjazahSd: string; // Nomor seri ijazah SD
  tanggalIjazahSd: string;
  noPesertaUjianSd?: string;
  nilaiRataRataSd?: number;
  suratPindahAsal?: {
    noSurat: string;
    tanggalSurat: string;
    alasanPindah: string;
  };

  // Bagian D: Perkembangan Akademik di SMP
  rombelSaatIni: string; // '7A', '7B', '8A', '8B', '9A', '9B'
  tahunAjaranMasuk: string; // '2024/2025'
  recordsSemester: RaporSemester[];

  // Bagian E: Riwayat Prestasi Siswa
  prestasi: PrestasiSiswa[];

  // Bagian F: Riwayat Kelulusan & Ijazah SMP
  statusSiswa: StatusSiswa;
  tanggalKelulusan?: string;
  noIjazahSmp?: string; // Nomor seri ijazah SMP jika sudah lulus
  tanggalIjazahSmp?: string;
  noSkl?: string; // Surat Keterangan Lulus
  noPesertaUjianSmp?: string;
  nilaiRataRataUjianSmp?: number;
  melanjutkanKe?: string; // SMA/SMK/MA tujuan
  catatanTambahan?: string;
}

export interface ProfilSekolah {
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  alamatLengkap: string;
  kelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  noTelepon: string;
  email: string;
  website: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaPetugasTataUsaha: string;
  nipPetugasTataUsaha: string;
  logoSekolahUrl?: string;
}

export interface BackupData {
  app: string;
  version: string;
  exportedAt: string;
  profilSekolah: ProfilSekolah;
  daftarSiswa: Siswa[];
}

export interface UserSession {
  isAuthenticated: boolean;
  role: 'admin' | 'siswa';
  siswaId?: string; // If role === 'siswa'
  namaUser: string;
  usernameOrNip?: string;
  loginTime?: string;
  avatarUrl?: string;
}

export interface AdminCredentials {
  username: string;
  passwordHashOrPlain: string;
  updatedAt?: string;
}

export type StudentPasswordMap = Record<string, string>;

