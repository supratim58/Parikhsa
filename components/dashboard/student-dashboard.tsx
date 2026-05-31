'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Exam } from '@/lib/types';
import { getExams, getSubmissionsByStudentId, getSubmissionByExamAndStudent } from '@/lib/storage';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function StudentDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExams = () => {
      const allExams = getExams().filter((exam) => exam.published);
      setExams(allExams);
      setIsLoading(false);
    };
    loadExams();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Loading exams...</div>;
  }

  const studentId = (user as any)?.id || '';

  const getExamStatus = (examId: string) => {
    const submission = getSubmissionByExamAndStudent(examId, studentId);
    return submission ? 'completed' : 'available';
  };

  const getExamScore = (examId: string) => {
    const submission = getSubmissionByExamAndStudent(examId, studentId);
    return submission ? submission.score : null;
  };

  const availableExams = exams.filter((e) => getExamStatus(e.id) === 'available');
  const completedExams = exams.filter((e) => getExamStatus(e.id) === 'completed');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Welcome, {(user as any)?.fullName || 'Student'}</h1>
      </div>

      {availableExams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Exams</h2>
          <div className="grid gap-4">
            {availableExams.map((exam) => (
              <Card key={exam.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{exam.name}</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Duration:</span> {exam.durationMinutes} minutes
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {exam.questions.length}
                      </div>
                      <div>
                        <span className="font-medium">Total Marks:</span> {exam.totalMarks}
                      </div>
                    </div>
                    {exam.instructions && (
                      <p className="mt-3 text-sm text-gray-700">{exam.instructions}</p>
                    )}
                  </div>
                  <Link href={`/exam/${exam.id}`} className="ml-4">
                    <Button>Start Exam</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completedExams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Exams</h2>
          <div className="grid gap-4">
            {completedExams.map((exam) => {
              const score = getExamScore(exam.id);
              return (
                <Card key={exam.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{exam.name}</h3>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Score:</span> {score?.toFixed(2)} / {exam.totalMarks}
                        </div>
                        <div>
                          <span className="font-medium">Percentage:</span>{' '}
                          {score && exam.totalMarks ? (((score / exam.totalMarks) * 100).toFixed(2) + '%') : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <Link href={`/results/${exam.id}`}>
                      <Button variant="outline">View Result</Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {availableExams.length === 0 && completedExams.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-600">No exams available yet.</p>
        </Card>
      )}
    </div>
  );
}
