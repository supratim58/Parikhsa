'use client';

import { useAuth } from '@/context/auth-context';
import { ExamForm } from '@/components/exam/exam-form';
import { redirect } from 'next/navigation';

export default function CreateExamPage() {
  const { userRole, isLoading } = useAuth();

  if (!isLoading && userRole !== 'teacher') {
    redirect('/login');
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <ExamForm />
      </div>
    </main>
  );
}
