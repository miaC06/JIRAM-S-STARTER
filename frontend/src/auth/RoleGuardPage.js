import React from 'react';
import RoleGuard from './RoleGuard';

export default function RoleGuardPage({ roles, children }) {
  return <RoleGuard roles={roles}>{children}</RoleGuard>;
}