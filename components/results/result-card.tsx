'use client';

import { Student, ExamSubmission, Question } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface ResultCardProps {
  submission: ExamSubmission;
  student: Student | null;
  questions: Question[];
}

export function ResultCard({ submission, student, questions }: ResultCardProps) {
  const percentage = submission.totalMarks > 0 ? (submission.score / submission.totalMarks) * 100 : 0;

  const getAnswerStatus = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    const answer = submission.answers.find((a) => a.questionId === questionId);

    if (!question || !answer) return 'not-answered';
    return question.correctOptionIndex === answer.selectedOptionIndex ? 'correct' : 'incorrect';
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Score Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{submission.score.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{submission.totalMarks}</div>
          <div className="text-sm text-gray-600">Total Marks</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{percentage.toFixed(2)}%</div>
          <div className="text-sm text-gray-600">Percentage</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-600">{submission.answers.length}</div>
          <div className="text-sm text-gray-600">Answered</div>
        </div>
      </div>

      {/* Student Info */}
      {student && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {student.fullName}
            </div>
            <div>
              <span className="font-medium">Roll Number:</span> {student.rollNumber}
            </div>
          </div>
        </div>
      )}

      {/* Answer Review */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4">Answer Review</h3>
        <div className="space-y-4">
          {questions.map((question, index) => {
            const status = getAnswerStatus(question.id);
            const answer = submission.answers.find((a) => a.questionId === question.id);
            const statusColor =
              status === 'correct'
                ? 'bg-green-50 border-green-200'
                : status === 'incorrect'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200';

            return (
              <div key={question.id} className={`p-4 border rounded-lg ${statusColor}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">Question {index + 1}</h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      status === 'correct'
                        ? 'bg-green-200 text-green-800'
                        : status === 'incorrect'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {status === 'correct' ? '✓ Correct' : status === 'incorrect' ? '✗ Incorrect' : 'Not Answered'}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{question.text}</p>

                <div className="space-y-2 mb-3">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = question.correctOptionIndex === optionIndex;
                    const isSelected = answer?.selectedOptionIndex === optionIndex;

                    return (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded border ${
                          isCorrect ? 'border-green-400 bg-green-100' : isSelected ? 'border-red-400 bg-red-100' : ''
                        }`}
                      >
                        <span className="text-gray-700">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </span>
                        {isCorrect && <span className="ml-2 text-green-600 font-semibold">(Correct Answer)</span>}
                        {isSelected && !isCorrect && <span className="ml-2 text-red-600 font-semibold">(Your Answer)</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
