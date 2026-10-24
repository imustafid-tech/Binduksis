import * as XLSX from 'xlsx';
import { Siswa, RaporSemester, JenisKelamin, Agama, StatusSiswa, StatusHidup } from '../types/student';
import { calculateSemesterAverage } from './studentLogic';

export interface ParsedStudentRow {
  rowNumber: number;
  nis: string;
  nisn: string;
  nik: string;
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  tanggalLahir: string;
  agama: Agama;
  rombelSaatIni: string;
  tahunAjaranMasuk: string;
  alamat: string;
  noHpSiswa: string;
  namaAyah: string;
  pekerjaanAyah: string;
  noWaAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  noWaIbu: string;
  namaSdAsal: string;
  noIjazahSd: string;
  isExisting: boolean;
  validationErrors: string[];
}

export interface ParsedAcademicRow {
  rowNumber: number;
  nis: string;
  studentName: string;
  matchedStudent?: Siswa;
  semester: number;
  kelas: string;
  tahunAjaran: string;
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
  kehadiran: {
    sakit: number;
    izin: number;
    tanpaKeterangan: number;
  };
  catatanPerkembangan: string;
  statusKenaikan?: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Sedang Berjalan';
  isExistingSemester: boolean;
  validationErrors: string[];
}

// Download template Excel untuk Data Siswa
export function downloadStudentTemplateExcel() {
  const sampleData = [
    {
      'NIS (Wajib)': '20240101',
      'NISN (10 Digit)': '0098765431',
      'NIK (16 Digit)': '3271012304110001',
      'Nama Lengkap (Wajib)': 'Ahmad Fauzi Pratama',
      'Nama Panggilan': 'Fauzi',
      'Jenis Kelamin (L/P)': 'L',
      'Tempat Lahir': 'Bandung',
      'Tanggal Lahir (YYYY-MM-DD)': '2011-04-15',
      'Agama': 'Islam',
      'Kelas / Rombel': '7A',
      'Tahun Masuk': '2024/2025',
      'Alamat Siswa': 'Jl. Merdeka No. 45 RT 02/05',
      'No HP Siswa': '081234567890',
      'Nama Ayah': 'Bambang Pratama',
      'Pekerjaan Ayah': 'Wiraswasta',
      'No WA Ayah': '081298765432',
      'Nama Ibu': 'Siti Rohmah',
      'Pekerjaan Ibu': 'Ibu Rumah Tangga',
      'No WA Ibu': '081298765433',
      'Asal SD': 'SD Negeri 1 Merdeka',
      'No Ijazah SD': 'DN-02/D-SD/13/0012345',
    },
    {
      'NIS (Wajib)': '20240102',
      'NISN (10 Digit)': '0098765432',
      'NIK (16 Digit)': '3271015609110002',
      'Nama Lengkap (Wajib)': 'Nadia Putri Maharani',
      'Nama Panggilan': 'Nadia',
      'Jenis Kelamin (L/P)': 'P',
      'Tempat Lahir': 'Jakarta',
      'Tanggal Lahir (YYYY-MM-DD)': '2011-09-20',
      'Agama': 'Islam',
      'Kelas / Rombel': '7A',
      'Tahun Masuk': '2024/2025',
      'Alamat Siswa': 'Komp. Graha Indah Blok C3 No. 12',
      'No HP Siswa': '081234567891',
      'Nama Ayah': 'Hendro Santoso',
      'Pekerjaan Ayah': 'Pegawai Negeri Sipil',
      'No WA Ayah': '081345678901',
      'Nama Ibu': 'Dewi Lestari',
      'Pekerjaan Ibu': 'Guru',
      'No WA Ibu': '081345678902',
      'Asal SD': 'SD IT Al-Hikmah',
      'No Ijazah SD': 'DN-02/D-SD/13/0012346',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // NIS
    { wch: 16 }, // NISN
    { wch: 20 }, // NIK
    { wch: 26 }, // Nama Lengkap
    { wch: 15 }, // Panggilan
    { wch: 18 }, // JK
    { wch: 15 }, // Tempat Lahir
    { wch: 25 }, // Tanggal Lahir
    { wch: 12 }, // Agama
    { wch: 15 }, // Kelas
    { wch: 14 }, // Tahun Masuk
    { wch: 32 }, // Alamat
    { wch: 15 }, // No HP Siswa
    { wch: 20 }, // Nama Ayah
    { wch: 18 }, // Pekerjaan Ayah
    { wch: 16 }, // No WA Ayah
    { wch: 20 }, // Nama Ibu
    { wch: 18 }, // Pekerjaan Ibu
    { wch: 16 }, // No WA Ibu
    { wch: 22 }, // Asal SD
    { wch: 24 }, // No Ijazah SD
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa');
  XLSX.writeFile(wb, 'Format_Import_Data_Siswa_SMP.xlsx');
}

// Download template Excel untuk Nilai Rapor
export function downloadAcademicTemplateExcel(
  students: Siswa[],
  filterClass: string = 'Semua',
  semester: number = 1,
  tahunAjaran: string = '2024/2025'
) {
  const targetStudents =
    filterClass === 'Semua' ? students : students.filter((s) => s.rombelSaatIni === filterClass);

  const rows = targetStudents.map((s) => {
    // Find existing semester record if any
    const existingRec = s.recordsSemester?.find((r) => r.semester === semester);
    const m = existingRec?.nilaiMapel;

    return {
      'NIS (Kunci Siswa)': s.nis,
      'Nama Siswa': s.namaLengkap,
      'Kelas / Rombel': s.rombelSaatIni,
      'Semester (1-6)': semester,
      'Tahun Ajaran': tahunAjaran,
      'PAI (0-100)': m ? m.pai : 85,
      'PPKn (0-100)': m ? m.ppkn : 84,
      'B. Indonesia (0-100)': m ? m.indonesia : 86,
      'Matematika (0-100)': m ? m.matematika : 82,
      'IPA (0-100)': m ? m.ipa : 83,
      'IPS (0-100)': m ? m.ips : 85,
      'B. Inggris (0-100)': m ? m.inggris : 80,
      'PJOK (0-100)': m ? m.pjok : 88,
      'Seni Budaya (0-100)': m ? m.seniBudaya : 85,
      'Informatika (0-100)': m ? m.informatika : 87,
      'Muatan Lokal (0-100)': m ? m.muatanLokal : 86,
      'Sakit (Hari)': existingRec ? existingRec.kehadiran.sakit : 0,
      'Izin (Hari)': existingRec ? existingRec.kehadiran.izin : 0,
      'Alpa (Hari)': existingRec ? existingRec.kehadiran.tanpaKeterangan : 0,
      'Catatan Perkembangan': existingRec?.catatanPerkembangan || 'Menunjukkan kemajuan belajar yang baik dan berakhlak terpuji.',
      'Status Kenaikan': existingRec?.statusKenaikan || (semester % 2 === 0 ? 'Naik Kelas' : 'Sedang Berjalan'),
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [
    { wch: 18 }, // NIS
    { wch: 28 }, // Nama
    { wch: 14 }, // Kelas
    { wch: 15 }, // Semester
    { wch: 14 }, // Tahun Ajaran
    { wch: 12 }, // PAI
    { wch: 12 }, // PPKn
    { wch: 18 }, // B. Indonesia
    { wch: 18 }, // Matematika
    { wch: 12 }, // IPA
    { wch: 12 }, // IPS
    { wch: 16 }, // B. Inggris
    { wch: 12 }, // PJOK
    { wch: 15 }, // Seni Budaya
    { wch: 16 }, // Informatika
    { wch: 18 }, // Muatan Lokal
    { wch: 12 }, // Sakit
    { wch: 12 }, // Izin
    { wch: 12 }, // Alpa
    { wch: 35 }, // Catatan
    { wch: 16 }, // Status Kenaikan
  ];

  const wb = XLSX.utils.book_new();
  const sheetName = `Nilai_Rapor_Smtr_${semester}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `Format_Upload_Nilai_Rapor_Semester_${semester}_${filterClass}.xlsx`);
}

// Normalizer string key helper
function getVal(row: Record<string, any>, possibleKeys: string[]): any {
  for (const k of possibleKeys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
  }
  // Try case-insensitive and partial match
  const rowKeys = Object.keys(row);
  for (const target of possibleKeys) {
    const targetClean = target.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const rk of rowKeys) {
      const rkClean = rk.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (rkClean.includes(targetClean) || targetClean.includes(rkClean)) {
        if (row[rk] !== undefined && row[rk] !== null && String(row[rk]).trim() !== '') {
          return String(row[rk]).trim();
        }
      }
    }
  }
  return '';
}

function parseNumber(val: any, fallback = 0, min = 0, max = 100): number {
  if (val === undefined || val === null || val === '') return fallback;
  const cleaned = String(val).replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return fallback;
  if (num < min) return min;
  if (num > max) return max;
  return Number(num.toFixed(1));
}

// Parse Student file (Excel or CSV)
export async function parseStudentFile(
  file: File,
  existingStudents: Siswa[]
): Promise<{
  rows: ParsedStudentRow[];
  totalCount: number;
  validCount: number;
  duplicateCount: number;
  errorCount: number;
}> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

  const parsedList: ParsedStudentRow[] = [];
  const existingNisSet = new Set(existingStudents.map((s) => s.nis.trim().toLowerCase()));
  const seenNisInBatch = new Set<string>();

  rawRows.forEach((row, idx) => {
    const rowNumber = idx + 2; // header is row 1
    const nis = getVal(row, ['NIS (Wajib)', 'NIS', 'nis', 'Nomor Induk', 'No Induk', 'nomor_induk']);
    const namaLengkap = getVal(row, ['Nama Lengkap (Wajib)', 'Nama Lengkap', 'Nama Siswa', 'nama', 'Nama', 'nama_lengkap']);
    const nisn = getVal(row, ['NISN (10 Digit)', 'NISN', 'nisn']);
    const nik = getVal(row, ['NIK (16 Digit)', 'NIK', 'nik']);
    const namaPanggilan = getVal(row, ['Nama Panggilan', 'Panggilan', 'nama_panggilan']);
    const rawJk = getVal(row, ['Jenis Kelamin (L/P)', 'Jenis Kelamin', 'JK', 'jk', 'Gender', 'L/P']);
    let jenisKelamin: JenisKelamin = 'L';
    if (rawJk.toUpperCase().startsWith('P') || rawJk.toUpperCase().includes('PEREMPUAN') || rawJk.toUpperCase().includes('WANITA')) {
      jenisKelamin = 'P';
    }

    const tempatLahir = getVal(row, ['Tempat Lahir', 'tempat_lahir', 'Kota Lahir']);
    let tanggalLahir = getVal(row, ['Tanggal Lahir (YYYY-MM-DD)', 'Tanggal Lahir', 'tgl_lahir', 'tanggal_lahir', 'Tgl Lahir']);
    // Standardize date if formatted as Excel serial or DD/MM/YYYY
    if (tanggalLahir && !tanggalLahir.includes('-') && /^\d+$/.test(tanggalLahir)) {
      try {
        const dateObj = XLSX.SSF.parse_date_code(parseInt(tanggalLahir, 10));
        tanggalLahir = `${dateObj.y}-${String(dateObj.m).padStart(2, '0')}-${String(dateObj.d).padStart(2, '0')}`;
      } catch {
        // keep as is
      }
    } else if (tanggalLahir && tanggalLahir.includes('/')) {
      const parts = tanggalLahir.split('/');
      if (parts.length === 3) {
        if (parts[2].length === 4) {
          tanggalLahir = `${parts[2]}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
        }
      }
    }

    const rawAgama = getVal(row, ['Agama', 'agama']);
    let agama: Agama = 'Islam';
    const cleanAgama = rawAgama.toLowerCase();
    if (cleanAgama.includes('kristen') || cleanAgama.includes('protestan')) agama = 'Kristen';
    else if (cleanAgama.includes('katolik')) agama = 'Katolik';
    else if (cleanAgama.includes('hindu')) agama = 'Hindu';
    else if (cleanAgama.includes('buddha') || cleanAgama.includes('budha')) agama = 'Buddha';
    else if (cleanAgama.includes('khonghucu') || cleanAgama.includes('konghucu')) agama = 'Khonghucu';

    const rombelSaatIni = getVal(row, ['Kelas / Rombel', 'Kelas', 'Rombel', 'rombel', 'kelas']) || '7A';
    const tahunAjaranMasuk = getVal(row, ['Tahun Masuk', 'Tahun Ajaran Masuk', 'Angkatan', 'tahun_masuk']) || '2024/2025';
    const alamat = getVal(row, ['Alamat Siswa', 'Alamat', 'alamat', 'Tempat Tinggal']);
    const noHpSiswa = getVal(row, ['No HP Siswa', 'No HP', 'HP', 'Telepon']);
    const namaAyah = getVal(row, ['Nama Ayah', 'Ayah', 'nama_ayah']);
    const pekerjaanAyah = getVal(row, ['Pekerjaan Ayah', 'pekerjaan_ayah']);
    const noWaAyah = getVal(row, ['No WA Ayah', 'No Telp Ayah', 'wa_ayah', 'no_wa_ayah']);
    const namaIbu = getVal(row, ['Nama Ibu', 'Ibu', 'nama_ibu']);
    const pekerjaanIbu = getVal(row, ['Pekerjaan Ibu', 'pekerjaan_ibu']);
    const noWaIbu = getVal(row, ['No WA Ibu', 'No Telp Ibu', 'wa_ibu', 'no_wa_ibu']);
    const namaSdAsal = getVal(row, ['Asal SD', 'SD Asal', 'Nama SD', 'sd_asal']);
    const noIjazahSd = getVal(row, ['No Ijazah SD', 'Ijazah SD', 'no_ijazah_sd']);

    const validationErrors: string[] = [];
    if (!nis) {
      validationErrors.push('NIS wajib diisi');
    }
    if (!namaLengkap) {
      validationErrors.push('Nama Lengkap wajib diisi');
    }
    if (nis && seenNisInBatch.has(nis.toLowerCase())) {
      validationErrors.push('NIS terduplikasi dalam file yang diunggah');
    }

    if (nis) seenNisInBatch.add(nis.toLowerCase());

    const isExisting = nis ? existingNisSet.has(nis.toLowerCase()) : false;

    parsedList.push({
      rowNumber,
      nis: nis || `TEMP-${rowNumber}`,
      nisn: nisn || '',
      nik: nik || '',
      namaLengkap: namaLengkap || `Siswa Baris ${rowNumber}`,
      namaPanggilan: namaPanggilan || (namaLengkap ? namaLengkap.split(' ')[0] : ''),
      jenisKelamin,
      tempatLahir: tempatLahir || 'Indonesia',
      tanggalLahir: tanggalLahir || '2011-01-01',
      agama,
      rombelSaatIni,
      tahunAjaranMasuk,
      alamat: alamat || '-',
      noHpSiswa: noHpSiswa || '-',
      namaAyah: namaAyah || '-',
      pekerjaanAyah: pekerjaanAyah || '-',
      noWaAyah: noWaAyah || '-',
      namaIbu: namaIbu || '-',
      pekerjaanIbu: pekerjaanIbu || '-',
      noWaIbu: noWaIbu || '-',
      namaSdAsal: namaSdAsal || '-',
      noIjazahSd: noIjazahSd || '-',
      isExisting,
      validationErrors,
    });
  });

  const validCount = parsedList.filter((r) => r.validationErrors.length === 0).length;
  const duplicateCount = parsedList.filter((r) => r.isExisting).length;
  const errorCount = parsedList.filter((r) => r.validationErrors.length > 0).length;

  return {
    rows: parsedList,
    totalCount: parsedList.length,
    validCount,
    duplicateCount,
    errorCount,
  };
}

// Parse Academic Grade file (Excel or CSV)
export async function parseAcademicFile(
  file: File,
  existingStudents: Siswa[]
): Promise<{
  rows: ParsedAcademicRow[];
  totalCount: number;
  matchedCount: number;
  unmatchedCount: number;
  errorCount: number;
}> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];
  const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

  const parsedList: ParsedAcademicRow[] = [];

  rawRows.forEach((row, idx) => {
    const rowNumber = idx + 2;
    const nis = getVal(row, ['NIS (Kunci Siswa)', 'NIS', 'nis', 'Nomor Induk', 'nomor_induk']);
    const studentName = getVal(row, ['Nama Siswa', 'Nama Lengkap', 'Nama', 'nama']);
    const kelas = getVal(row, ['Kelas / Rombel', 'Kelas', 'Rombel', 'kelas']) || '7A';
    const semesterStr = getVal(row, ['Semester (1-6)', 'Semester', 'semester']) || '1';
    const semester = Math.max(1, Math.min(6, parseInt(semesterStr, 10) || 1));
    const tahunAjaran = getVal(row, ['Tahun Ajaran', 'tahun_ajaran']) || '2024/2025';

    // Mapel scores
    const pai = parseNumber(getVal(row, ['PAI (0-100)', 'PAI', 'Pendidikan Agama Islam']));
    const ppkn = parseNumber(getVal(row, ['PPKn (0-100)', 'PPKn', 'Pendidikan Pancasila']));
    const indonesia = parseNumber(getVal(row, ['B. Indonesia (0-100)', 'Bahasa Indonesia', 'indonesia', 'B.Indonesia']));
    const matematika = parseNumber(getVal(row, ['Matematika (0-100)', 'Matematika', 'matematika', 'MTK']));
    const ipa = parseNumber(getVal(row, ['IPA (0-100)', 'IPA', 'Ilmu Pengetahuan Alam']));
    const ips = parseNumber(getVal(row, ['IPS (0-100)', 'IPS', 'Ilmu Pengetahuan Sosial']));
    const inggris = parseNumber(getVal(row, ['B. Inggris (0-100)', 'Bahasa Inggris', 'inggris', 'B.Inggris']));
    const pjok = parseNumber(getVal(row, ['PJOK (0-100)', 'PJOK', 'Penjas']));
    const seniBudaya = parseNumber(getVal(row, ['Seni Budaya (0-100)', 'Seni Budaya', 'seni_budaya']));
    const informatika = parseNumber(getVal(row, ['Informatika (0-100)', 'Informatika', 'TIK']));
    const muatanLokal = parseNumber(getVal(row, ['Muatan Lokal (0-100)', 'Muatan Lokal', 'Mulok', 'muatan_lokal']));

    const sakit = parseNumber(getVal(row, ['Sakit (Hari)', 'Sakit', 's']), 0, 0, 365);
    const izin = parseNumber(getVal(row, ['Izin (Hari)', 'Izin', 'i']), 0, 0, 365);
    const tanpaKeterangan = parseNumber(getVal(row, ['Alpa (Hari)', 'Alpa', 'Tanpa Keterangan', 'a']), 0, 0, 365);

    const catatanPerkembangan =
      getVal(row, ['Catatan Perkembangan', 'Catatan', 'catatan']) ||
      'Menunjukkan pencapaian kompetensi belajar yang baik dan aktif dalam kegiatan kelas.';

    const rawStatus = getVal(row, ['Status Kenaikan', 'status_kenaikan']);
    let statusKenaikan: 'Naik Kelas' | 'Tinggal Kelas' | 'Lulus' | 'Sedang Berjalan' = 'Sedang Berjalan';
    if (rawStatus.toLowerCase().includes('naik')) statusKenaikan = 'Naik Kelas';
    else if (rawStatus.toLowerCase().includes('tinggal')) statusKenaikan = 'Tinggal Kelas';
    else if (rawStatus.toLowerCase().includes('lulus')) statusKenaikan = 'Lulus';

    const nilaiMapel = {
      pai,
      ppkn,
      indonesia,
      matematika,
      ipa,
      ips,
      inggris,
      pjok,
      seniBudaya,
      informatika,
      muatanLokal,
    };

    const rataRata = calculateSemesterAverage(nilaiMapel);

    // Find student in existing database
    const matchedStudent = existingStudents.find((s) => {
      if (nis && s.nis.trim().toLowerCase() === nis.trim().toLowerCase()) return true;
      if (studentName && s.namaLengkap.trim().toLowerCase() === studentName.trim().toLowerCase()) return true;
      return false;
    });

    const validationErrors: string[] = [];
    if (!nis && !studentName) {
      validationErrors.push('NIS atau Nama Siswa wajib diisi untuk mengenali siswa');
    } else if (!matchedStudent) {
      validationErrors.push(`Siswa dengan NIS "${nis || '-'}" / Nama "${studentName || '-'}" tidak ditemukan di database`);
    }

    const isExistingSemester = Boolean(
      matchedStudent?.recordsSemester?.some((r) => r.semester === semester)
    );

    parsedList.push({
      rowNumber,
      nis: nis || (matchedStudent ? matchedStudent.nis : '-'),
      studentName: studentName || (matchedStudent ? matchedStudent.namaLengkap : '-'),
      matchedStudent,
      semester,
      kelas: kelas || (matchedStudent ? matchedStudent.rombelSaatIni : '7A'),
      tahunAjaran,
      nilaiMapel,
      rataRata,
      kehadiran: {
        sakit,
        izin,
        tanpaKeterangan,
      },
      catatanPerkembangan,
      statusKenaikan,
      isExistingSemester,
      validationErrors,
    });
  });

  const matchedCount = parsedList.filter((r) => Boolean(r.matchedStudent)).length;
  const unmatchedCount = parsedList.filter((r) => !r.matchedStudent).length;
  const errorCount = parsedList.filter((r) => r.validationErrors.length > 0).length;

  return {
    rows: parsedList,
    totalCount: parsedList.length,
    matchedCount,
    unmatchedCount,
    errorCount,
  };
}
