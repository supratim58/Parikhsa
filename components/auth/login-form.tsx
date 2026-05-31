'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';

interface LoginFormProps {
  role: 'student' | 'teacher';
  onBack: () => void;
}

export function LoginForm({ role, onBack }: LoginFormProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name.trim()) {
        throw new Error('Name is required');
      }

      if (role === 'teacher') {
        if (!password.trim()) {
          throw new Error('Password is required');
        }
        await login('teacher', name, password);
      } else {
        if (!password.trim()) {
          throw new Error('Roll number is required');
        }
        await login('student', name, password);
      }

      // Navigate after successful login
      setTimeout(() => {
        if (role === 'teacher') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getLabel = () => {
    if (role === 'teacher') {
      return { name: 'Name', password: 'Password' };
    }
    return { name: 'Full Name', password: 'Roll Number' };
  };

  const labels = getLabel();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {role === 'teacher' ? 'Teacher Login' : 'Student Login'}
          </h1>
          <p className="text-gray-600">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {labels.name}
            </label>
            <Input
              id="name"
              type="text"
              placeholder={labels.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {labels.password}
            </label>
            <Input
              id="password"
              type="text"
              placeholder={labels.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 underline"
          disabled={isLoading}
        >
          Back to role selection
        </button>
      </Card>
    </div>
  );
}
