import React from 'react';
import { User } from "@/types/user";

interface TableUserListProps {
  users: User[];
}

export const TableUserList = ({ users }: TableUserListProps) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Date Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.slice(0, 15).map((user) => ( // Limiting for preview
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
              <td className="px-4 py-3 text-gray-700">{user.email}</td>
              <td className="px-4 py-3 text-gray-500 capitalize">{user.role}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(user.dateJoined).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-center text-gray-500 py-8">No users found in this region.</p>
      )}
    </div>
  );
};