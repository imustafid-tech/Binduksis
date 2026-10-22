import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateNis,
  validateNisn,
  validateNik,
  calculateSemesterAverage,
  calculateCumulativeAverage,
  searchStudents,
  getStatistics,
  validateBackupJson,
  formatTanggalIndo,
} from './studentLogic';
import { Siswa, RaporSemester } from '../types/student';

test('validateNis checks valid and invalid NIS', () => {
  assert.equal(validateNis('2401'), true);
  assert.equal(validateNis('12345678'), true);
  assert.equal(validateNis('12'), false); // too short
  assert.equal(validateNis('ABC12'), false); // contains letters
  assert.equal(validateNis(''), false);
});

test('validateNisn enforces exactly 10 digits', () => {
  assert.equal(validateNisn('0089123456'), true);
  assert.equal(validateNisn('123456789'), false); // 9 digits
  assert.equal(validateNisn('12345678901'), false); // 11 digits
  assert.equal(validateNisn('008912345A'), false); // non-numeric
});

test('validateNik enforces exactly 16 digits', () => {
  assert.equal(validateNik('3201012005080001'), true);
  assert.equal(validateNik('320101200508000'), false); // 15 digits
  assert.equal(validateNik('32010120050800019'), false); // 17 digits
});

test('calculateSemesterAverage accurately averages scores', () => {
  const scores = {
    pai: 85,
    ppkn: 80,
    indonesia: 90,
    matematika: 75,
  };
  // (85 + 80 + 90 + 75) / 4 = 330 / 4 = 82.5
  assert.equal(calculateSemesterAverage(scores), 82.5);
  assert.equal(calculateSemesterAverage({}), 0);
});

test('calculateCumulativeAverage handles multiple semesters', () => {
  const records: RaporSemester[] = [
    {
      semester: 1,
      kelas: '7A',
      tahunAjaran: '2023/2024',
      rataRata: 84.0,
      nilaiMapel: {} as any,
      kehadiran: { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      ekstrakurikuler: [],
    },
    {
      semester: 2,
      kelas: '7A',
      tahunAjaran: '2023/2024',
      rataRata: 88.0,
      nilaiMapel: {} as any,
      kehadiran: { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      ekstrakurikuler: [],
    },
  ];
  // (84 + 88) / 2 = 86
  assert.equal(calculateCumulativeAverage(records), 86);
  assert.equal(calculateCumulativeAverage([]), 0);
});

test('searchStudents filters by keyword and properties', () => {
  const mockStudents: Siswa[] = [
    {
      id: '1',
      nis: '2301',
      nisn: '0091234567',
      nik: '3201012009010001',
      namaLengkap: 'Ahmad Faiz Pratama',
      namaPanggilan: 'Faiz',
      jenisKelamin: 'L',
      tempatLahir: 'Jakarta',
      tanggalLahir: '2010-05-14',
      agama: 'Islam',
      kewarganegaraan: 'WNI',
      anakKe: 1,
      jumlahSaudaraKandung: 2,
      bahasaRumah: 'Indonesia',
      golonganDarah: 'O',
      alamat: 'Jl. Merdeka No. 10',
      rtRw: '02/05',
      kelurahan: 'Menteng',
      kecamatan: 'Menteng',
      kabupatenKota: 'Jakarta Pusat',
      provinsi: 'DKI Jakarta',
      kodePos: '10310',
      tinggalBersama: 'Orang Tua',
      transportasi: 'Sepeda Motor',
      noHpSiswa: '081234567890',
      dataAyah: {
        nama: 'Bambang Pratama',
        nik: '3201010101750001',
        tempatLahir: 'Jakarta',
        tanggalLahir: '1975-01-01',
        agama: 'Islam',
        pendidikan: 'S1',
        pekerjaan: 'Pegawai Negeri Sipil',
        penghasilanBulanan: '5 - 10 Juta',
        noTeleponWa: '081298765432',
        alamat: 'Jl. Merdeka No. 10',
        statusHidup: 'Masih Hidup',
      },
      dataIbu: {
        nama: 'Siti Rahmawati',
        nik: '3201010202780002',
        tempatLahir: 'Bandung',
        tanggalLahir: '1978-02-02',
        agama: 'Islam',
        pendidikan: 'S1',
        pekerjaan: 'Guru',
        penghasilanBulanan: '3 - 5 Juta',
        noTeleponWa: '081398765431',
        alamat: 'Jl. Merdeka No. 10',
        statusHidup: 'Masih Hidup',
      },
      statusMasuk: 'Siswa Baru',
      tanggalMasuk: '2023-07-15',
      diterimaDiKelas: '7A',
      namaSdAsal: 'SD Negeri 01 Menteng',
      noIjazahSd: 'DN-01/D-SD/23/001234',
      tanggalIjazahSd: '2023-06-20',
      rombelSaatIni: '8A',
      tahunAjaranMasuk: '2023/2024',
      recordsSemester: [],
      prestasi: [
        {
          id: 'p1',
          namaPrestasi: 'OSN Matematika',
          bidang: 'Akademik',
          tingkat: 'Kabupaten/Kota',
          peringkat: 'Juara 1',
          tahun: 2024,
          penyelenggara: 'Disdik',
        },
      ],
      statusSiswa: 'Aktif',
    },
    {
      id: '2',
      nis: '2302',
      nisn: '0097654321',
      nik: '3201012009020002',
      namaLengkap: 'Citra Kirana Dewi',
      namaPanggilan: 'Citra',
      jenisKelamin: 'P',
      tempatLahir: 'Surabaya',
      tanggalLahir: '2010-09-20',
      agama: 'Islam',
      kewarganegaraan: 'WNI',
      anakKe: 2,
      jumlahSaudaraKandung: 1,
      bahasaRumah: 'Indonesia',
      golonganDarah: 'A',
      alamat: 'Jl. Pemuda No. 45',
      rtRw: '01/03',
      kelurahan: 'Rawamangun',
      kecamatan: 'Pulogadung',
      kabupatenKota: 'Jakarta Timur',
      provinsi: 'DKI Jakarta',
      kodePos: '13220',
      tinggalBersama: 'Orang Tua',
      transportasi: 'Angkutan Umum',
      noHpSiswa: '081299998888',
      dataAyah: {
        nama: 'Agus Santoso',
        nik: '3201010303720003',
        tempatLahir: 'Surabaya',
        tanggalLahir: '1972-03-03',
        agama: 'Islam',
        pendidikan: 'SMA/SMK',
        pekerjaan: 'Wiraswasta',
        penghasilanBulanan: '3 - 5 Juta',
        noTeleponWa: '081211112222',
        alamat: 'Jl. Pemuda No. 45',
        statusHidup: 'Masih Hidup',
      },
      dataIbu: {
        nama: 'Dewi Lestari',
        nik: '3201010404760004',
        tempatLahir: 'Semarang',
        tanggalLahir: '1976-04-04',
        agama: 'Islam',
        pendidikan: 'SMA/SMK',
        pekerjaan: 'Ibu Rumah Tangga',
        penghasilanBulanan: 'Tidak Berpenghasilan',
        noTeleponWa: '081233334444',
        alamat: 'Jl. Pemuda No. 45',
        statusHidup: 'Masih Hidup',
      },
      statusMasuk: 'Siswa Baru',
      tanggalMasuk: '2023-07-15',
      diterimaDiKelas: '7B',
      namaSdAsal: 'SD Negeri Rawamangun 05',
      noIjazahSd: 'DN-01/D-SD/23/005678',
      tanggalIjazahSd: '2023-06-20',
      rombelSaatIni: '8B',
      tahunAjaranMasuk: '2023/2024',
      recordsSemester: [],
      prestasi: [],
      statusSiswa: 'Aktif',
    },
  ];

  // Search by name
  assert.equal(searchStudents(mockStudents, 'Faiz').length, 1);
  // Search by NIS
  assert.equal(searchStudents(mockStudents, '2302').length, 1);
  // Search by parent name
  assert.equal(searchStudents(mockStudents, 'Dewi Lestari').length, 1);
  // Filter by gender
  assert.equal(searchStudents(mockStudents, '', { gender: 'P' }).length, 1);
  // Filter by class
  assert.equal(searchStudents(mockStudents, '', { kelas: '8A' }).length, 1);
});

test('getStatistics calculates tallies accurately', () => {
  const stats = getStatistics([
    {
      id: '1',
      statusSiswa: 'Aktif',
      jenisKelamin: 'L',
      rombelSaatIni: '7A',
      prestasi: [{ id: '1' } as any, { id: '2' } as any],
    } as any,
    {
      id: '2',
      statusSiswa: 'Lulus',
      jenisKelamin: 'P',
      rombelSaatIni: '9A',
      prestasi: [{ id: '3' } as any],
    } as any,
  ]);

  assert.equal(stats.total, 2);
  assert.equal(stats.aktif, 1);
  assert.equal(stats.lulus, 1);
  assert.equal(stats.totalLakiLaki, 1);
  assert.equal(stats.totalPerempuan, 1);
  assert.equal(stats.totalPrestasi, 3);
  assert.equal(stats.distributionKelas['7A'], 1);
});

test('validateBackupJson identifies valid and invalid JSON backups', () => {
  assert.equal(validateBackupJson(null).valid, false);
  assert.equal(validateBackupJson({ foo: 'bar' }).valid, false);
  assert.equal(validateBackupJson({ daftarSiswa: [] }).valid, false);
  assert.equal(
    validateBackupJson({
      daftarSiswa: [{ nis: '1001', namaLengkap: 'Budi' }],
    }).valid,
    true
  );
});

test('formatTanggalIndo formats dates correctly', () => {
  assert.equal(formatTanggalIndo('2010-08-17'), '17 Agustus 2010');
  assert.equal(formatTanggalIndo(''), '-');
});

test('authenticateAdmin validates correct credentials and rejects invalid ones', async () => {
  const { authenticateAdmin } = await import('./studentLogic');
  // Valid credentials
  assert.equal(authenticateAdmin('admin', 'admin123').success, true);
  assert.equal(authenticateAdmin('tatausaha', 'admin123').success, true);
  assert.equal(authenticateAdmin('197908152005012007', 'admin123').success, true);

  // Invalid password
  assert.equal(authenticateAdmin('admin', 'wrongpass').success, false);
  // Invalid username
  assert.equal(authenticateAdmin('unknownuser', 'admin123').success, false);
  // Empty
  assert.equal(authenticateAdmin('', '').success, false);
});

test('authenticateStudent validates matching student identifier and birthdate/PIN', async () => {
  const { authenticateStudent } = await import('./studentLogic');
  const mockSiswa: any = [
    {
      id: 'sis-1',
      nis: '230101',
      nisn: '0098273641',
      namaLengkap: 'Muhammad Raditya Pratama',
      tanggalLahir: '2010-05-14',
    },
  ];

  // Match by NIS and exact birthdate
  const res1 = authenticateStudent(mockSiswa, '230101', '2010-05-14');
  assert.equal(res1.success, true);
  assert.equal(res1.student?.namaLengkap, 'Muhammad Raditya Pratama');

  // Match by NISN and master PIN
  const res2 = authenticateStudent(mockSiswa, '0098273641', 'siswa123');
  assert.equal(res2.success, true);

  // Match by birthdate without dashes
  const res3 = authenticateStudent(mockSiswa, '230101', '20100514');
  assert.equal(res3.success, true);

  // Wrong birthdate
  const res4 = authenticateStudent(mockSiswa, '230101', '2011-01-01');
  assert.equal(res4.success, false);

  // Unknown NIS
  const res5 = authenticateStudent(mockSiswa, '999999', 'siswa123');
  assert.equal(res5.success, false);
});

test('validateNewUsername checks username length and characters', async () => {
  const { validateNewUsername } = await import('./studentLogic');
  assert.equal(validateNewUsername('admin_baru').valid, true);
  assert.equal(validateNewUsername('tu.smp1').valid, true);
  assert.equal(validateNewUsername('ab').valid, false); // < 3 chars
  assert.equal(validateNewUsername('').valid, false);
  assert.equal(validateNewUsername('admin#$!').valid, false);
});

test('validateNewPassword checks length and calculates strength', async () => {
  const { validateNewPassword } = await import('./studentLogic');
  assert.equal(validateNewPassword('12345').valid, false); // < 6 chars
  assert.equal(validateNewPassword('123456').valid, true);
  assert.equal(validateNewPassword('123456').strength, 'medium');
  assert.equal(validateNewPassword('Admin2024!').strength, 'strong');
});

test('authenticateAdmin supports updated custom credentials', async () => {
  const { authenticateAdmin } = await import('./studentLogic');
  const custom = {
    username: 'kepalatu',
    passwordHashOrPlain: 'RahasiaSMP2024!',
  };

  // Should succeed with the new custom username and password
  assert.equal(authenticateAdmin('kepalatu', 'RahasiaSMP2024!', custom).success, true);
  // Should fail with wrong password for new custom username
  assert.equal(authenticateAdmin('kepalatu', 'wrong', custom).success, false);
});

test('authenticateStudent supports student custom password', async () => {
  const { authenticateStudent } = await import('./studentLogic');
  const mockSiswa: any = [
    {
      id: 'sis-10',
      nis: '240501',
      namaLengkap: 'Anisa Rahma',
      tanggalLahir: '2011-03-15',
    },
  ];

  const customPasswords = {
    'sis-10': 'anisa_rahasia_123',
  };

  // Custom password works
  const res1 = authenticateStudent(mockSiswa, '240501', 'anisa_rahasia_123', customPasswords);
  assert.equal(res1.success, true);
  // Birthdate still works as fallback
  const res2 = authenticateStudent(mockSiswa, '240501', '2011-03-15', customPasswords);
  assert.equal(res2.success, true);
});

