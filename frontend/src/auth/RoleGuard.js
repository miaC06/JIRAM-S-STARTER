import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RoleGuard({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' />;
  return roles.includes(user.roles[0]) ? children : <Navigate to='/' />;
}