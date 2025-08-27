export const AntrianPasienDocs = {
  getAll: {
    summary: 'Get all patient queue data',
    description:
      'Mengambil semua data antrian pasien berdasarkan outlet user yang sedang login. ' +
      'Data yang dikembalikan mencakup informasi lengkap pasien, status antrian, ' +
      'loket, dan petugas yang menangani.',
  },
  getRecap: {
    summary: 'Get Recap patient queue data',
    description:
      'Mengambil data total penanganan dari admin user berdasarkan perhari, perbulan, dan pertahun. ' +
      'Data yang dikembalikan mencakup informasi total pasien yang di handle oleh admin user, perhari, perbulan dan pertahun.',
  },

  getNomorAntrian: {
    summary: 'Get queue numbers with basic info',
    description:
      'Mengambil data nomor antrian dengan informasi dasar seperti nama petugas ' +
      'dan jenis registrasi (UMUM/JAMINAN). Data difilter berdasarkan outlet user.',
  },

  getDailyNomorAntrian: {
    summary: 'Get daily queue numbers with basic info',
    description:
      'Mengambil data nomor antrian harian dengan informasi dasar. ' +
      'Jika parameter date tidak diberikan, akan mengambil data hari ini. ' +
      'Format date: YYYY-MM-DD (contoh: 2025-08-26).',
  },

  getDailyAntrianPasien: {
    summary: 'Get daily patient queue data',
    description:
      'Mengambil semua data antrian pasien untuk tanggal tertentu dengan informasi lengkap. ' +
      'Jika parameter date tidak diberikan, akan mengambil data hari ini. ' +
      'Format date: YYYY-MM-DD (contoh: 2025-08-26).',
  },

  search: {
    summary: 'Search patient queue by keyword',
    description:
      'Mencari data antrian pasien berdasarkan keyword. Pencarian dilakukan pada ' +
      'nomor antrian dan nomor registrasi. Hasil pencarian akan menampilkan data ' +
      'lengkap antrian yang sesuai dengan keyword.',
  },

  update: {
    summary: 'Update patient queue status',
    description:
      'Mengubah status antrian pasien berdasarkan ID. Sistem akan memvalidasi:' +
      '\n• Perubahan status harus mengikuti flow yang benar (WAITING → CALL → COMPLETE/SKIPPED/CANCELED)' +
      '\n• Status final (COMPLETE/CANCELED) tidak dapat diubah lagi' +
      '\n• Auto-cancel jika pasien sudah dipanggil 3 kali (bintang >= 3)' +
      '\n• User harus memiliki loket untuk melakukan update' +
      '\n• Sistem akan broadcast update ke admin users melalui WebSocket',
  },
};
