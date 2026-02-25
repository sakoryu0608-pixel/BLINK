
import React, { useState, useMemo, useCallback } from 'react';
import { Scores } from '../types';
import { ENNEAGRAM_TYPES, ANSWER_OPTIONS } from '../constants';

interface QuestionnaireProps {
  onFinish: (scores: Scores) => void;
  onRestart: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onFinish, onRestart }) => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [scores, setScores] = useState<Scores>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentType = ENNEAGRAM_TYPES[currentTypeIndex];
  const currentQuestion = currentType.questions[currentQuestionIndex];

  const questionNumberInfo = useMemo(() => {
    const total = ENNEAGRAM_TYPES.reduce((sum, type) => sum + type.questions.length, 0);
    let current = 0;
    for (let i = 0; i < currentTypeIndex; i++) {
      current += ENNEAGRAM_TYPES[i].questions.length;
    }
    current += currentQuestionIndex + 1;
    return { current, total };
  }, [currentTypeIndex, currentQuestionIndex]);
  
  const handleAnswerSelect = useCallback((score: number) => {
    if (isTransitioning) return;

    const newAnswers = {
        ...answers,
        [`${currentTypeIndex}-${currentQuestionIndex}`]: score,
    };
    setAnswers(newAnswers);
    setIsTransitioning(true);

    const isLastQuestionInType = currentQuestionIndex === currentType.questions.length - 1;
    const isLastType = currentTypeIndex === ENNEAGRAM_TYPES.length - 1;

    setTimeout(() => {
        if (isLastQuestionInType) {
            let typeScore = 0;
            currentType.questions.forEach((_, qIndex) => {
                typeScore += newAnswers[`${currentTypeIndex}-${qIndex}`] || 0;
            });
            
            const updatedScores = {
                ...scores,
                [`type${currentType.id}`]: typeScore,
            };
            setScores(updatedScores); // スコアを更新

            if (isLastType) {
                onFinish(updatedScores);
            } else {
                setCurrentTypeIndex(prev => prev + 1);
                setCurrentQuestionIndex(0);
                setIsTransitioning(false);
            }
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsTransitioning(false);
        }
    }, 300); // 300ms for user to see their selection
  }, [answers, scores, currentTypeIndex, currentQuestionIndex, currentType, isTransitioning, onFinish]);

  const handleBack = useCallback(() => {
      if (isTransitioning) return;

      if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
      } else if (currentTypeIndex > 0) {
          const prevTypeIndex = currentTypeIndex - 1;
          const prevType = ENNEAGRAM_TYPES[prevTypeIndex];
          setCurrentTypeIndex(prevTypeIndex);
          setCurrentQuestionIndex(prevType.questions.length - 1);
      }
  }, [currentTypeIndex, currentQuestionIndex, isTransitioning]);
  
  const progress = (questionNumberInfo.current / questionNumberInfo.total) * 100;
  const isFirstQuestion = currentTypeIndex === 0 && currentQuestionIndex === 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-indigo-600">プログレス</span>
            <span className="text-sm font-semibold text-indigo-600">{questionNumberInfo.current} / {questionNumberInfo.total}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="p-5 bg-white/80 rounded-lg shadow-sm border border-slate-200 min-h-[280px]">
        <p className="font-semibold mb-4 text-slate-800 leading-relaxed text-lg">Q{questionNumberInfo.current}: {currentQuestion}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {ANSWER_OPTIONS.map((option) => {
            const isSelected = answers[`${currentTypeIndex}-${currentQuestionIndex}`] === option.score;
            return (
              <button
                key={option.score}
                onClick={() => handleAnswerSelect(option.score)}
                disabled={isTransitioning}
                className={`p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-md transform -translate-y-1'
                    : 'bg-white hover:bg-indigo-50 hover:border-indigo-400 border-slate-300'
                } disabled:cursor-wait disabled:opacity-75`}
              >
                <span className="font-bold">{option.text}</span>
                <span className="text-xs ml-1 opacity-80">{option.description}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isFirstQuestion || isTransitioning}
          className="text-slate-600 hover:text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &larr; 前に戻る
        </button>
        <button
          onClick={onRestart}
          className="text-red-600 hover:text-red-800 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;