'use client';

import { useAuth } from '@/context/auth-context';
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { userRole, isLoading, logout } = useAuth();
  const router = useRouter();

  if (!isLoading && !userRole) {
    redirect('/login');
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Exam System</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {userRole === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    </main>
  );
}
