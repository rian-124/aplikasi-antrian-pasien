"use client";

import { useEffect, useState } from "react";
import { User } from "@/classes/User";
import { UserService } from "@/classes/UserService";
import AddUserModal from "./AddUserModal";
import { UserPlus2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthService } from "@/classes/AuthService";
import EditUserModal from "./EditUserModal";
import { Outlet } from "@/classes/UserModel";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { io, Socket } from "socket.io-client";

export default function UserTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [allLokets, setAllLokets] = useState<
    { id: number; nama_loket: string }[]
  >([]);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  //  // ---------- WEBSOCKET ----------
    useEffect(() => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
  
      const socket: Socket = io("http://192.168.50.222:4000", {
        auth: { token },
        transports: ["websocket"],
      });
  
      socket.on("connect", () => {
        console.log("✅ Connected to WebSocket:", socket.id);
  
        // Join sesuai role (ADMIN atau ADMINUSERS)
        socket.emit("join_room", { role: "ADMIN" });
      });
  
      socket.on("joined: ", (msg) => {
        console.log("ℹ️ Server message:", msg);
      });
  
      // update user realtime
      socket.on("users_update", (data) => {
        console.log("📥 Update dari WS (users_update):", data);
        // setelah terima update → refresh user
        fetchUsers();
      });
  
      socket.on("disconnect", () => {
        console.log("❌ Disconnected from WebSocket");
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = AuthService.getToken();
      const res = await fetch("http://192.168.50.222:4000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      setUsers(json.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil data pengguna:", err);
      setError(err.message || "Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = AuthService.getToken();
    if (!token) {
      toast.error("Autentikasi diperlukan. Silakan login terlebih dahulu.");
      return;
    }
    fetchUsers();
  }, []);

  const getRoleName = (roleId: number) => {
    return roleId === 1 ? "Admin" : "Table";
  };

  const handleDelete = async (userId: number) => {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus pengguna ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await UserService.deleteUser(userId);
          Swal.fire("Berhasil", "Pengguna berhasil dihapus.", "success");
          fetchUsers();
        } catch (error: any) {
          console.error("Error hapus:", error);
          Swal.fire(
            "Gagal",
            error.message || "Gagal menghapus pengguna",
            "error"
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchOutlets = async () => {
      const outletData = await UserService.fetchOutlets();
      setOutlets(outletData);
    };
    fetchOutlets();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedUser: User) => {
    try {
      await UserService.updateUser(updatedUser);
      toast.success("Pengguna berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Error update:", err);
      toast.error(err.message || "Gagal memperbarui pengguna");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.outlet_id?.toString().includes(searchText);

    const roleMatch =
      roleFilter === "" ||
      (roleFilter === "Admin" && getRoleName(user.role_id) === "Admin") ||
      (roleFilter === "Table" && getRoleName(user.role_id) === "Table");

    return searchMatch && roleMatch;
  });

  useEffect(() => {
    const fetchLokets = async () => {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://192.168.50.222:4000/api/lokets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setAllLokets(json.data || []);
    };
    fetchLokets();
  }, []);

  return (
    <>
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        userData={selectedUser}
        onSave={(updatedUser) => {
          handleSaveEdit(updatedUser);
        }}
        outlets={outlets}
      />

      <div className="rounded-xl p-4 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <UserPlus2 className="w-6 h-6 mr-2 text-gray-700" />
            Daftar Pengguna
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            + Tambah Pengguna Baru
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari Username / Nama / Outlet ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm"
          >
            <option value="">Hak Akses</option>
            <option value="Admin">Admin</option>
            <option value="Table">Table</option>
          </select>
          <button
            onClick={() => {
              setSearchText("");
              setRoleFilter("");
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-600 px-4 py-2">
              Memuat data pengguna...
            </p>
          ) : error ? (
            <p className="text-sm text-red-500 px-4 py-2">{error}</p>
          ) : (
            <table className="min-w-full table-fixed text-sm text-left bg-white border border-gray-200 rounded-md overflow-hidden">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[25%]" />
                <col className="w-[20%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead className="bg-gray-200 text-gray-700 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3">No.</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Nama</th>
                  <th className="px-6 py-3">Outlet</th>
                  <th className="px-6 py-3">Loket</th>
                  <th className="px-6 py-3">Hak Akses</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-t border-gray-200">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.outlet_id}</td>
                    <td className="px-6 py-4">
                      {user.lokets?.nama_loket || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {getRoleName(user.role_id)}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}
