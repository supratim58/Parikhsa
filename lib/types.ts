export type UserRole = 'student' | 'teacher';

export interface Student {
  id: string;
  fullName: string;
  rollNumber: string;
  loginTime: Date;
}

export interface Teacher {
  id: string;
  name: string;
  loginTime: Date;
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  marks: number;
}

export interface Exam {
  id: string;
  name: string;
  instructions: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  published: boolean;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: StudentAnswer[];
  submittedAt: string;
  score: number;
  totalMarks: number;
}

export interface SessionState {
  userRole: UserRole | null;
  user: Student | Teacher | null;
}
