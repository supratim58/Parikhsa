'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getExamById, getSubmissionsByExamId, getSubmissionByExamAndStudent, getStudentById } from '@/lib/storage';
import { Exam, ExamSubmission } from '@/lib/types';
import { ResultCard } from '@/components/results/result-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const { userRole, user, isLoading } = useAuth();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !userRole) {
      redirect('/login');
    }

    const loadedExam = getExamById(examId);
    if (!loadedExam) {
      redirect('/dashboard');
    }
    setExam(loadedExam);

    // For students, redirect if no submission
    if (userRole === 'student' && user) {
      const submission = getSubmissionByExamAndStudent(loadedExam.id, (user as any).id);
      if (!submission) {
        redirect('/dashboard');
      }
      setSubmissions([submission]);
    } else if (userRole === 'teacher') {
      // For teachers, show all submissions
      const loadedSubmissions = getSubmissionsByExamId(examId);
      setSubmissions(loadedSubmissions);
    }
  }, [examId, userRole, isLoading, user]);

  if (isLoading || !exam) {
    return <div className="flex items-center justify-center min-h-screen">Loading result...</div>;
  }

  if (userRole === 'student' && submissions.length === 1) {
    const submission = submissions[0];
    return (
      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{exam.name} - Result</h1>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <ResultCard submission={submission} student={user as any} questions={exam.questions} />
        </div>
      </main>
    );
  }

  // Teacher view
  const stats = {
    totalSubmissions: submissions.length,
    averageScore: submissions.length > 0 ? submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length : 0,
    highestScore: submissions.length > 0 ? Math.max(...submissions.map((s) => s.score)) : 0,
    lowestScore: submissions.length > 0 ? Math.min(...submissions.map((s) => s.score)) : 0,
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{exam.name} - Results</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-gray-600 text-sm">Total Submissions</div>
              <div className="text-3xl font-bold">{stats.totalSubmissions}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Average Score</div>
              <div className="text-3xl font-bold">{stats.averageScore.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Highest Score</div>
              <div className="text-3xl font-bold text-green-600">{stats.highestScore.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-600 text-sm">Lowest Score</div>
              <div className="text-3xl font-bold text-red-600">{stats.lowestScore.toFixed(2)}</div>
            </div>
          </div>
        </Card>

        {/* Submissions List */}
        <div>
          <h2 className="text-xl font-bold mb-4">Student Submissions</h2>
          {submissions.length === 0 ? (
            <Card className="p-8 text-center text-gray-600">
              No submissions yet.
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => {
                const student = getStudentById(submission.studentId);
                const percentage = exam.totalMarks > 0 ? (submission.score / exam.totalMarks) * 100 : 0;

                return (
                  <div key={submission.id}>
                    <button
                      onClick={() =>
                        setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id)
                      }
                      className="w-full"
                    >
                      <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div className="text-left">
                            <h3 className="font-semibold">{student?.fullName || 'Unknown'}</h3>
                            <p className="text-sm text-gray-600">Roll: {student?.rollNumber || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {submission.score.toFixed(2)} / {exam.totalMarks}
                            </div>
                            <div className="text-sm text-gray-600">{percentage.toFixed(2)}%</div>
                          </div>
                        </div>
                      </Card>
                    </button>

                    {expandedSubmission === submission.id && (
                      <div className="mt-4">
                        <ResultCard submission={submission} student={student || null} questions={exam.questions} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
