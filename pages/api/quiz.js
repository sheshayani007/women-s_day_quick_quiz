import fs from 'fs';
import path from 'path';

const quizFilePath = path.join(process.cwd(), 'public', 'womens_day_quiz.json');

let currentQuizSetIndex = 0; // Global tracking of quiz set

export default function handler(req, res) {
  try {
    const quizData = JSON.parse(fs.readFileSync(quizFilePath, 'utf8'));

    const quizSets = Object.keys(quizData);
    if (quizSets.length === 0) {
      return res.status(500).json({ error: 'No quiz sets available' });
    }

    const currentSetKey = quizSets[currentQuizSetIndex % quizSets.length];
    currentQuizSetIndex++;

    res.status(200).json({ questions: quizData[currentSetKey] });
  } catch (error) {
    res.status(500).json({ error: 'Error loading quiz data' });
  }
}
