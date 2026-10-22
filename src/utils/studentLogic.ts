import { Siswa, RaporSemester, BackupData } from '../types/student';

/**
 * Validasi Nomor Induk Siswa (NIS) lokal SMP (biasanya 4-8 digit)
 */
export function validateNis(nis: string): boolean {
  if (!nis) return false;
  return /^[0-9]{4,10}$/.test(nis.trim());
}

/**
 * Validasi Nomor Induk Siswa Nasional (NISN) standar Kemendikbud: tepat 10 digit angka
 */
export function validateNisn(nisn: string): boolean {
  if (!nisn) return false;
  return /^[0-9]{10}$/.test(nisn.trim());
}

/**
 * Validasi NIK Kependudukan (16 digit angka)
 */
export function validateNik(nik: string): boolean {
  if (!nik) return false;
  return /^[0-9]{16}$/.test(nik.trim());
}

/**
 * Hitung rata-rata nilai mapel dalam satu semester
 */
export function calculateSemesterAverage(nilaiMapel: Record<string, number>): number {
  const values = Object.values(nilaiMapel).filter((v) => typeof v === 'number' && !isNaN(v) && v > 0);
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Hitung rata-rata nilai kumulatif rapor dari seluruh semester yang tersedia
 */
export function calculateCumulativeAverage(records: RaporSemester[]): number {
  if (!records || records.length === 0) return 0;
  const averages = records
    .map((r) => (r.rataRata > 0 ? r.rataRata : calculateSemesterAverage(r.nilaiMapel)))
    .filter((avg) => avg > 0);
  if (averages.length === 0) return 0;
  const sum = averages.reduce((acc, val) => acc + val, 0);
  return Number((sum / averages.length).toFixed(2));
}

/**
 * Pencarian cepat & multi-kriteria filter siswa
 */
export function searchStudents(
  students: Siswa[],
  query: string = '',
  filters: {
    kelas?: string;
    status?: string;
    gender?: string;
    tahunMasuk?: string;
  } = {}
): Siswa[] {
  const q = query.trim().toLowerCase();

  return students.filter((siswa) => {
    // 1. Text search on Nama, NIS, NISN, NIK, Nama Ayah, Nama Ibu, SD Asal
    if (q) {
      const matchNama = siswa.namaLengkap.toLowerCase().includes(q);
      const matchPanggilan = siswa.namaPanggilan.toLowerCase().includes(q);
      const matchNis = siswa.nis.toLowerCase().includes(q);
      const matchNisn = siswa.nisn.toLowerCase().includes(q);
      const matchNik = siswa.nik.toLowerCase().includes(q);
      const matchAyah = siswa.dataAyah?.nama?.toLowerCase().includes(q);
      const matchIbu = siswa.dataIbu?.nama?.toLowerCase().includes(q);
      const matchSd = siswa.namaSdAsal?.toLowerCase().includes(q);
      const matchIjazahSd = siswa.noIjazahSd?.toLowerCase().includes(q);
      const matchIjazahSmp = siswa.noIjazahSmp?.toLowerCase().includes(q);

      if (
        !matchNama &&
        !matchPanggilan &&
        !matchNis &&
        !matchNisn &&
        !matchNik &&
        !matchAyah &&
        !matchIbu &&
        !matchSd &&
        !matchIjazahSd &&
        !matchIjazahSmp
      ) {
        return false;
      }
    }

    // 2. Filter Kelas/Rombel
    if (filters.kelas && filters.kelas !== 'Semua') {
      if (siswa.rombelSaatIni !== filters.kelas) return false;
    }

    // 3. Filter Status Siswa
    if (filters.status && filters.status !== 'Semua') {
      if (siswa.statusSiswa !== filters.status) return false;
    }

    // 4. Filter Jenis Kelamin
    if (filters.gender && filters.gender !== 'Semua') {
      if (siswa.jenisKelamin !== filters.gender) return false;
    }

    // 5. Filter Tahun Masuk
    if (filters.tahunMasuk && filters.tahunMasuk !== 'Semua') {
      if (siswa.tahunAjaranMasuk !== filters.tahunMasuk) return false;
    }

    return true;
  });
}

/**
 * Statistik ringkas untuk dashboard Buku Induk
 */
export function getStatistics(students: Siswa[]) {
  const total = students.length;
  let aktif = 0;
  let lulus = 0;
  let pindah = 0;
  let keluar = 0;
  let totalLakiLaki = 0;
  let totalPerempuan = 0;
  let totalPrestasi = 0;
  const distributionKelas: Record<string, number> = {};

  students.forEach((s) => {
    if (s.statusSiswa === 'Aktif') aktif++;
    else if (s.statusSiswa === 'Lulus') lulus++;
    else if (s.statusSiswa === 'Pindah Sekolah') pindah++;
    else if (s.statusSiswa === 'Keluar') keluar++;

    if (s.jenisKelamin === 'L') totalLakiLaki++;
    else if (s.jenisKelamin === 'P') totalPerempuan++;

    if (s.prestasi && Array.isArray(s.prestasi)) {
      totalPrestasi += s.prestasi.length;
    }

    const k = s.rombelSaatIni || 'Belum Ada';
    distributionKelas[k] = (distributionKelas[k] || 0) + 1;
  });

  return {
    total,
    aktif,
    lulus,
    pindah,
    keluar,
    totalLakiLaki,
    totalPerempuan,
    totalPrestasi,
    distributionKelas,
  };
}

/**
 * Validasi struktur berkas JSON backup
 */
export function validateBackupJson(obj: unknown): { valid: boolean; error?: string; count?: number } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, error: 'Berkas JSON kosong atau format tidak sesuai.' };
  }

  const data = obj as Partial<BackupData>;
  if (!data.daftarSiswa || !Array.isArray(data.daftarSiswa)) {
    return { valid: false, error: 'Struktur data tidak memiliki array "daftarSiswa".' };
  }

  if (data.daftarSiswa.length === 0) {
    return { valid: false, error: 'Berkas cadangan tidak memuat data siswa.' };
  }

  // Check essential fields of first entry
  const first = data.daftarSiswa[0];
  if (!first.nis || !first.namaLengkap) {
    return { valid: false, error: 'Data siswa di dalam berkas tidak memiliki NIS atau Nama Lengkap yang valid.' };
  }

  return { valid: true, count: data.daftarSiswa.length };
}

/**
 * Ekspor daftar siswa ke format CSV
 */
export function exportToCsv(students: Siswa[]): string {
  const headers = [
    'NIS',
    'NISN',
    'NIK',
    'Nama Lengkap',
    'Nama Panggilan',
    'Jenis Kelamin',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Agama',
    'Kelas Saat Ini',
    'Status Siswa',
    'Tahun Ajaran Masuk',
    'Alamat',
    'Nama Ayah',
    'Pekerjaan Ayah',
    'No WA Ayah',
    'Nama Ibu',
    'Pekerjaan Ibu',
    'No WA Ibu',
    'Nama SD Asal',
    'Nomor Seri Ijazah SD',
    'Nomor Seri Ijazah SMP',
    'Melanjutkan Ke',
    'Jumlah Prestasi',
  ];

  const escapeCsv = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = students.map((s) => [
    escapeCsv(s.nis),
    escapeCsv(s.nisn),
    escapeCsv(s.nik),
    escapeCsv(s.namaLengkap),
    escapeCsv(s.namaPanggilan),
    escapeCsv(s.jenisKelamin),
    escapeCsv(s.tempatLahir),
    escapeCsv(s.tanggalLahir),
    escapeCsv(s.agama),
    escapeCsv(s.rombelSaatIni),
    escapeCsv(s.statusSiswa),
    escapeCsv(s.tahunAjaranMasuk),
    escapeCsv(`${s.alamat}, ${s.kelurahan}, ${s.kecamatan}, ${s.kabupatenKota}`),
    escapeCsv(s.dataAyah?.nama),
    escapeCsv(s.dataAyah?.pekerjaan),
    escapeCsv(s.dataAyah?.noTeleponWa),
    escapeCsv(s.dataIbu?.nama),
    escapeCsv(s.dataIbu?.pekerjaan),
    escapeCsv(s.dataIbu?.noTeleponWa),
    escapeCsv(s.namaSdAsal),
    escapeCsv(s.noIjazahSd),
    escapeCsv(s.noIjazahSmp || '-'),
    escapeCsv(s.melanjutkanKe || '-'),
    escapeCsv(s.prestasi ? s.prestasi.length : 0),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Format tanggal Indonesia standar (e.g. 17 Agustus 2010)
 */
export function formatTanggalIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
        return `${day} ${monthNames[monthIndex]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}
