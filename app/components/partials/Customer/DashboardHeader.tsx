import React from 'react';
import { User } from '../../atoms/types/CustomerTypes';

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-4">
      <img
        src={user.avatar}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border-4 border-pink-100"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};
