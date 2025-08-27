export const PasiensDocs = {
  store: {
    summary: 'Create new patient registration',
    description:
      'Membuat registrasi pasien baru dan menambahkannya ke antrian. Sistem akan:\n' +
      '• Memvalidasi jenis registrasi (UMUM/JAMINAN)\n' +
      '• Generate nomor registrasi otomatis dengan format berdasarkan tanggal\n' +
      '• Generate nomor antrian sesuai dengan outlet dan jenis registrasi\n' +
      '• Menambahkan pasien ke antrian dengan status WAITING\n' +
      '• Broadcast update ke admin users melalui WebSocket\n' +
      '• Nomor antrian: U00001 (UMUM) atau J00001 (JAMKES)',
  },

  update: {
    summary: 'Update patient insurance information',
    description:
      'Memperbarui informasi penjamin pasien berdasarkan jenis registrasi yang dipilih. ' +
      'Endpoint ini digunakan untuk melengkapi data pasien setelah registrasi awal, ' +
      'terutama untuk menambahkan detail penjamin atau umum. ' +
      'Update akan mempengaruhi data pasien tanpa mengubah status antrian.',
  },
};
