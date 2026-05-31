'use client';

import { useState } from 'react';
import { RoleSelector } from '@/components/auth/role-selector';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (selectedRole) {
    return <LoginForm role={selectedRole} onBack={() => setSelectedRole(null)} />;
  }

  return <RoleSelector onSelectRole={setSelectedRole} />;
}
