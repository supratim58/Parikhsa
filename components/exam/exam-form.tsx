'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exam, Question } from '@/lib/types';
import { generateId, getTotalMarks } from '@/lib/exam-utils';
import { createExam } from '@/lib/storage';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { QuestionBuilder } from './question-builder';

interface ExamFormProps {
  initialExam?: Exam;
  isEditing?: boolean;
}

export function ExamForm({ initialExam, isEditing = false }: ExamFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState(initialExam?.name || '');
  const [instructions, setInstructions] = useState(initialExam?.instructions || '');
  const [durationMinutes, setDurationMinutes] = useState(initialExam?.durationMinutes || 60);
  const [questions, setQuestions] = useState<Question[]>(initialExam?.questions || []);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error('Exam name is required');
      }

      if (questions.length === 0) {
        throw new Error('Add at least one question');
      }

      const totalMarks = getTotalMarks(questions);
      if (totalMarks === 0) {
        throw new Error('Total marks must be greater than 0');
      }

      const exam: Exam = {
        id: initialExam?.id || generateId(),
        name: name.trim(),
        instructions: instructions.trim(),
        durationMinutes,
        totalMarks,
        questions,
        createdBy: (user as any)?.id || '',
        createdAt: initialExam?.createdAt || new Date().toISOString(),
        published: publish || initialExam?.published || false,
      };

      if (isEditing && initialExam) {
        // Update existing exam logic would go here
        router.push('/dashboard');
      } else {
        createExam(exam);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMarks = getTotalMarks(questions);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Exam' : 'Create Exam'}</h2>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <div>
            <label htmlFor="exam-name" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Name *
            </label>
            <Input
              id="exam-name"
              type="text"
              placeholder="Enter exam name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="exam-instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              id="exam-instructions"
              placeholder="Enter exam instructions (optional)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="480"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks
              </label>
              <Input type="text" value={totalMarks} disabled className="bg-gray-100" />
            </div>
          </div>

          <QuestionBuilder questions={questions} onQuestionsChange={setQuestions} />

          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              onClick={() => router.push('/dashboard')}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Save & Publish'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
