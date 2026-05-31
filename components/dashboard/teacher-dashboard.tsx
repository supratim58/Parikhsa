'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Exam } from '@/lib/types';
import { getExams, updateExam, getSubmissionsByExamId } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function TeacherDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExams = () => {
      const allExams = getExams();
      setExams(allExams);
      setIsLoading(false);
    };
    loadExams();
  }, []);

  const handleTogglePublish = (examId: string, currentPublished: boolean) => {
    updateExam(examId, { published: !currentPublished });
    setExams(exams.map((e) => (e.id === examId ? { ...e, published: !currentPublished } : e)));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading exams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Link href="/exam/create">
          <Button>Create New Exam</Button>
        </Link>
      </div>

      {exams.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No exams created yet.</p>
          <Link href="/exam/create">
            <Button>Create Your First Exam</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => {
            const submissions = getSubmissionsByExamId(exam.id);
            return (
              <Card key={exam.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{exam.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Duration:</span> {exam.durationMinutes} minutes
                      </div>
                      <div>
                        <span className="font-medium">Questions:</span> {exam.questions.length}
                      </div>
                      <div>
                        <span className="font-medium">Total Marks:</span> {exam.totalMarks}
                      </div>
                      <div>
                        <span className="font-medium">Submissions:</span> {submissions.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      onClick={() => handleTogglePublish(exam.id, exam.published)}
                      variant={exam.published ? 'default' : 'outline'}
                      size="sm"
                    >
                      {exam.published ? 'Published' : 'Publish'}
                    </Button>
                    <Link href={`/results/${exam.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Results
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
