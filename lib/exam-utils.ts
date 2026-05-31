import { Exam, Question, StudentAnswer } from './types';

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function calculateScore(answers: StudentAnswer[], questions: Question[]): number {
  let score = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && question.correctOptionIndex === answer.selectedOptionIndex) {
      score += question.marks;
    }
  });

  return Math.round(score * 100) / 100;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export function getExamStatus(exam: Exam): 'draft' | 'published' {
  return exam.published ? 'published' : 'draft';
}

export function getTotalMarks(questions: Question[]): number {
  return questions.reduce((sum, q) => sum + q.marks, 0);
}
