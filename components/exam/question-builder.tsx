'use client';

import { Question } from '@/lib/types';
import { generateId } from '@/lib/exam-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface QuestionBuilderProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

export function QuestionBuilder({ questions, onQuestionsChange }: QuestionBuilderProps) {
  const addQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      marks: 1,
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onQuestionsChange(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    updateQuestion(questionId, {
      options: questions
        .find((q) => q.id === questionId)!
        .options.map((opt, idx) => (idx === optionIndex ? value : opt)) as [
        string,
        string,
        string,
        string
      ],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
        <Button type="button" onClick={addQuestion} variant="outline">
          Add Question
        </Button>
      </div>

      {questions.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          No questions added yet. Click "Add Question" to get started.
        </Card>
      )}

      {questions.map((question, index) => (
        <Card key={question.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg">Question {index + 1}</h3>
            <Button
              type="button"
              onClick={() => removeQuestion(question.id)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor={`q-text-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Question Text
              </label>
              <Input
                id={`q-text-${question.id}`}
                type="text"
                placeholder="Enter question text"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`q-marks-${question.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Marks
                </label>
                <Input
                  id={`q-marks-${question.id}`}
                  type="number"
                  min="1"
                  max="100"
                  value={question.marks}
                  onChange={(e) => updateQuestion(question.id, { marks: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      value={optionIndex}
                      checked={question.correctOptionIndex === optionIndex}
                      onChange={() =>
                        updateQuestion(question.id, {
                          correctOptionIndex: optionIndex as 0 | 1 | 2 | 3,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select the correct option using the radio button</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
