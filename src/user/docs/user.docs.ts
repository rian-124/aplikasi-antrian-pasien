export const UserDocs = {
  getAllUsers: {
    summary: 'Get all users',
    description: 'Mengambil seluruh data user yang terdaftar di sistem.',
  },

  searchUser: {
    summary: 'Search user by keyword',
    description:
      'Cari user berdasarkan nama, email, atau nomor registrasi yang sesuai dengan kata kunci.',
  },

  getUsersByRole: {
    summary: 'Get users by role',
    description: 'Mengambil user berdasarkan peran admin atau adminuser.',
  },

  updateUser: {
    summary: 'Update user data',
    description: 'Melakukan pembaruan terhadap data user berdasarkan ID-nya.',
  },

  updateUserByLokets: {
    summary: 'Choose loket for users',
    description: 'Memilih loket user berdasarkan outlet users.',
  },

  checkoutUserByLokets: {
    summary: 'Checkout loket user',
    description: 'Melakukan checkout user outlet jika sudah selesai duty.',
  },

  deleteUser: {
    summary: 'Delete user',
    description:
      'Menghapus user berdasarkan ID. Hanya dapat dilakukan oleh admin.',
  },

  register: {
    summary: 'Register new user',
    description:
      'Mendaftarkan user baru ke sistem. Hanya bisa dilakukan oleh admin.',
  },
};
