'use client';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] relative border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-center">Add New User</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter Password"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Outlet</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">Select outlet</option>
              <option value="Outlet A">Outlet A</option>
              <option value="Outlet B">Outlet B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">User Role</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

