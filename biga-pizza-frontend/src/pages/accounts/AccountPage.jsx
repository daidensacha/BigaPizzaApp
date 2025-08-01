import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UserDashboard from '@accounts/UserDashboard';
import UserAccount from '@accounts/UserAccount';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <UserAccount />
      {user?.isAdmin && <UserDashboard />}
    </div>
  );
}
