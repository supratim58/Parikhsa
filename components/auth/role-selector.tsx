'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RoleSelectorProps {
  onSelectRole: (role: 'student' | 'teacher') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onSelectRole('teacher')}
            variant="default"
            size="lg"
            className="w-full h-14 text-base"
          >
            Teacher
          </Button>
          <Button
            onClick={() => onSelectRole('student')}
            variant="outline"
            size="lg"
            className="w-full h-14 text-base"
          >
            Student
          </Button>
        </div>
      </Card>
    </div>
  );
}
