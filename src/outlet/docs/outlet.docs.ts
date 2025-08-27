export const OutletDocs = {
  getAllOutlets: {
    summary: 'Get all outlets',
    description:
      'Mengambil seluruh data outlet yang tersedia dalam sistem. ' +
      'Data yang dikembalikan mencakup informasi lengkap outlet seperti ID, ' +
      'nama outlet. Endpoint ini dapat digunakan ' +
      'untuk menampilkan daftar outlet dalam dropdown atau list.',
  },

  storeOutlets: {
    summary: 'Create a new outlet',
    description:
      'Menambahkan data outlet baru ke dalam sistem. Sistem akan memvalidasi ' +
      'bahwa nama outlet belum ada sebelumnya untuk menghindari duplikasi.',
  },

  updateOutlets: {
    summary: 'Update outlet by ID',
    description:
      'Memperbarui data outlet berdasarkan ID yang diberikan. Sistem akan ' +
      'memvalidasi bahwa outlet dengan ID tersebut ada, dan jika nama outlet ' +
      'diubah, akan memastikan nama baru tidak konflik dengan outlet lain. ' +
      'Update outlet akan mempengaruhi semua data terkait seperti antrian pasien ' +
      'dan assignment user.',
  },

  deleteOutlets: {
    summary: 'Delete outlet by ID',
    description:
      'Menghapus outlet berdasarkan ID yang diberikan. Sistem akan memvalidasi ' +
      'bahwa outlet tidak memiliki data terkait aktif seperti antrian pasien ' +
      'yang sedang berjalan atau user yang masih di-assign ke outlet tersebut. ' +
      'Operasi ini bersifat permanent dan tidak dapat di-undo.',
  },
};
