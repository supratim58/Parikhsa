'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getExamById, getSubmissionByExamAndStudent, createSubmission } from '@/lib/storage';
import { calculateScore, generateId } from '@/lib/exam-utils';
import { Exam, StudentAnswer } from '@/lib/types';
import { ExamTimer } from '@/components/exam/exam-timer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const { userRole, user, isLoading } = useAuth();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!isLoading && userRole !== 'student') {
      redirect('/login');
    }

    const loadedExam = getExamById(examId);
    if (!loadedExam) {
      redirect('/dashboard');
    }
    setExam(loadedExam);

    // Check if already submitted
    if (loadedExam && user) {
      const submission = getSubmissionByExamAndStudent(loadedExam.id, (user as any).id);
      if (submission) {
        redirect(`/results/${examId}`);
      }
    }
  }, [examId, userRole, isLoading, user]);

  if (isLoading || !exam) {
    return <div className="flex items-center justify-center min-h-screen">Loading exam...</div>;
  }

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOptionIndex: optionIndex } : a
        );
      }
      return [...prev, { questionId, selectedOptionIndex: optionIndex }];
    });
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const score = calculateScore(answers, exam.questions);
      const submission = {
        id: generateId(),
        examId: exam.id,
        studentId: (user as any).id,
        answers,
        submittedAt: new Date().toISOString(),
        score,
        totalMarks: exam.totalMarks,
      };

      createSubmission(submission);
      router.push(`/results/${exam.id}`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{exam.name}</h1>
          <ExamTimer
            durationMinutes={exam.durationMinutes}
            onTimeUp={handleTimeUp}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Instructions */}
        {exam.instructions && (
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="font-semibold mb-2">Instructions</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{exam.instructions}</p>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {exam.questions.map((question, index) => {
            const selectedAnswer = answers.find((a) => a.questionId === question.id);
            return (
              <Card key={question.id} className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Question {index + 1} ({question.marks} marks)
                  </h3>
                  <p className="text-gray-700">{question.text}</p>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        checked={selectedAnswer?.selectedOptionIndex === optionIndex}
                        onChange={() => handleSelectAnswer(question.id, optionIndex)}
                        disabled={isSubmitting}
                        className="w-4 h-4 mr-3"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </Button>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="p-6 max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit? You cannot change your answers after submission.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Submit
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
