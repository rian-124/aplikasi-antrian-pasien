"use client";

import { useEffect, useState } from 'react';
import { User } from '../classes/User';
import { UserService } from '../classes/UserService';
import AddUserModal from './AddUserModal';
import { UserPlus2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthService } from '../classes/AuthService';
import EditUserModal from './EditUserModal';
import { Outlet } from '../classes/UserModel';

export default function UserTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.fetchUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = AuthService.getToken();
    console.log('Auth Token:', token);
    if (!token) {
      toast.error("Authentication required. Please log in.");
      return;
    }
    fetchUsers();
  }, []);

  const getRoleName = (roleId: number) => {
    return roleId === 1 ? "Admin" : "Table";
  };

  const handleDelete = async (userId: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await UserService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete user");
    }
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
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.message || "Failed to update user");
    }
  };

  const filteredUsers = users.filter(user => {
    const searchMatch =
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.outlet_id?.toString().includes(searchText);

    const roleMatch =
      roleFilter === "" ||
      (roleFilter === "Admin" && getRoleName(user.role_id) === "Admin") ||
      (roleFilter === "Table" && getRoleName(user.role_id) === "Table");

    return searchMatch && roleMatch;
  });

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
            Users List
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition"
          >
            + Add New User
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search Email / Name / Outlet ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-md text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 bg-white rounded-md px-4 py-2 text-sm"
          >
            <option value="">User Permissions</option>
            <option value="Admin">Admin</option>
            <option value="Table">Table</option>
          </select>
          <button
            onClick={() => { setSearchText(""); setRoleFilter(""); }}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition"
          >
            Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-600 px-4 py-2">Loading users...</p>
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
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Outlet</th>
                  <th className="px-6 py-3">User Permissions</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="border-t border-gray-200">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.outlet_id}</td>
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
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
    </>
  );
}
