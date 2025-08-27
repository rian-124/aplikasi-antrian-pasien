export const AuthDocs = {
  login: {
    summary: 'User authentication',
    description:
      'Melakukan autentikasi user dengan username dan password. ' +
      'Sistem akan memvalidasi kredensial dan mengembalikan JWT token yang dapat ' +
      'digunakan untuk mengakses endpoint yang membutuhkan autentikasi. ' +
      'Token berisi informasi user, role, outlet, dan permission.',
  },

  checkUsername: {
    summary: 'Verify username for password reset',
    description:
      'Memverifikasi apakah username terdaftar dalam sistem untuk proses reset password. ' +
      'Jika username valid, sistem akan mengembalikan temporary token yang berlaku 15 menit ' +
      'untuk digunakan dalam proses reset password. Token ini memiliki akses terbatas ' +
      'dan hanya dapat digunakan untuk endpoint reset password.',
  },

  resetPassword: {
    summary: 'Reset user password',
    description:
      'Mengubah password user menggunakan token yang diperoleh dari endpoint check-username. ' +
      'Token harus masih valid (belum expired dalam 15 menit) dan password baru akan ' +
      'di-hash sebelum disimpan ke database. Setelah berhasil reset, user dapat login ' +
      'dengan password baru.',
  },
};
