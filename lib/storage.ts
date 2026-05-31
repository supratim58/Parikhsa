import { Exam, ExamSubmission, Student } from './types';

const EXAMS_KEY = 'exams';
const SUBMISSIONS_KEY = 'submissions';
const STUDENTS_KEY = 'students';
const SESSION_KEY = 'session';

// Exams
export function getExams(): Exam[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(EXAMS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveExams(exams: Exam[]): void {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
}

export function getExamById(id: string): Exam | undefined {
  return getExams().find((exam) => exam.id === id);
}

export function createExam(exam: Exam): void {
  const exams = getExams();
  exams.push(exam);
  saveExams(exams);
}

export function updateExam(id: string, updates: Partial<Exam>): void {
  const exams = getExams();
  const index = exams.findIndex((exam) => exam.id === id);
  if (index !== -1) {
    exams[index] = { ...exams[index], ...updates };
    saveExams(exams);
  }
}

// Submissions
export function getSubmissions(): ExamSubmission[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(SUBMISSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveSubmissions(submissions: ExamSubmission[]): void {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
}

export function getSubmissionsByExamId(examId: string): ExamSubmission[] {
  return getSubmissions().filter((sub) => sub.examId === examId);
}

export function getSubmissionsByStudentId(studentId: string): ExamSubmission[] {
  return getSubmissions().filter((sub) => sub.studentId === studentId);
}

export function getSubmissionByExamAndStudent(examId: string, studentId: string): ExamSubmission | undefined {
  return getSubmissions().find((sub) => sub.examId === examId && sub.studentId === studentId);
}

export function createSubmission(submission: ExamSubmission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);
}

// Students
export function getStudents(): Student[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STUDENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getStudentById(id: string): Student | undefined {
  return getStudents().find((student) => student.id === id);
}

export function createStudent(student: Student): void {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
}

// Session
export interface StoredSession {
  userRole: string | null;
  userId: string | null;
  userName: string | null;
  rollNumber?: string;
}

export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveSession(session: StoredSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
