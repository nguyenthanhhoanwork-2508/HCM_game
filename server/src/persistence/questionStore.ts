import fs from 'fs';
import path from 'path';
import { Question } from '../types';

const configuredPath = process.env.QUESTIONS_FILE?.trim();
export const questionsFilePath = path.resolve(
  configuredPath || path.join(__dirname, '../../data/questions.json')
);

function isQuestion(value: unknown): value is Question {
  if (!value || typeof value !== 'object') return false;
  const question = value as Partial<Question>;
  return (
    Number.isInteger(question.id) &&
    typeof question.question === 'string' &&
    question.question.trim().length > 0 &&
    typeof question.answer === 'string' &&
    question.answer.trim().length > 0 &&
    typeof question.displayAnswer === 'string' &&
    (question.type === 'first' || question.type === 'normal') &&
    (question.phase === 0 || question.phase === 1 || question.phase === 2)
  );
}

export function loadQuestions(fallback: Question[]): Question[] {
  try {
    if (!fs.existsSync(questionsFilePath)) {
      console.log(`[questions] No saved JSON found; initializing ${questionsFilePath}.`);
      return fallback.map((question) => ({ ...question }));
    }

    const parsed: unknown = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.every(isQuestion)) {
      throw new Error('Question file must contain a non-empty array of valid questions.');
    }
    console.log(`[questions] Loaded ${parsed.length} questions from ${questionsFilePath}.`);
    return parsed.map((question) => ({ ...question }));
  } catch (error) {
    console.error(`[questions] Could not load ${questionsFilePath}; using defaults instead.`, error);
    return fallback.map((question) => ({ ...question }));
  }
}

export function saveQuestions(questions: Question[]): void {
  try {
    fs.mkdirSync(path.dirname(questionsFilePath), { recursive: true });
    fs.writeFileSync(questionsFilePath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
  } catch (error) {
    console.error(`[questions] Could not save ${questionsFilePath}.`, error);
  }
}
