'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Teacher, UserRole } from '@/lib/types';
import { saveSession, getSession, clearSession, getStudentById, createStudent, getStudents } from '@/lib/storage';
import { generateId } from '@/lib/exam-utils';

interface AuthContextType {
  userRole: UserRole | null;
  user: Student | Teacher | null;
  login: (role: UserRole, name: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<Student | Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.userRole && session.userId && session.userName) {
      setUserRole(session.userRole as UserRole);
      if (session.userRole === 'student') {
        setUser({
          id: session.userId,
          fullName: session.userName,
          rollNumber: session.rollNumber || '',
          loginTime: new Date(),
        });
      } else if (session.userRole === 'teacher') {
        setUser({
          id: session.userId,
          name: session.userName,
          loginTime: new Date(),
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (role: UserRole, name: string, password?: string) => {
    // Teacher login: requires password
    if (role === 'teacher') {
      if (password !== 'teacher123') {
        throw new Error('Invalid password');
      }
      const teacherId = generateId();
      const teacher: Teacher = {
        id: teacherId,
        name,
        loginTime: new Date(),
      };
      setUserRole('teacher');
      setUser(teacher);
      saveSession({
        userRole: 'teacher',
        userId: teacherId,
        userName: name,
      });
    }
    // Student login: name + roll number
    else if (role === 'student') {
      const rollNumber = password || '';
      const studentId = generateId();
      const student: Student = {
        id: studentId,
        fullName: name,
        rollNumber,
        loginTime: new Date(),
      };
      setUserRole('student');
      setUser(student);
      createStudent(student);
      saveSession({
        userRole: 'student',
        userId: studentId,
        userName: name,
        rollNumber,
      });
    }
  };

  const logout = () => {
    setUserRole(null);
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
