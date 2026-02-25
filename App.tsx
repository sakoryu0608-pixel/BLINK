
import React, { useState, useCallback } from 'react';
import Introduction from './components/Introduction';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import { AppState, Scores } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Introduction);
  const [scores, setScores] = useState<Scores>({});

  const handleStart = useCallback(() => {
    setAppState(AppState.Questionnaire);
  }, []);

  const handleFinish = useCallback((finalScores: Scores) => {
    setScores(finalScores);
    setAppState(AppState.Results);
  }, []);

  const handleRestart = useCallback(() => {
    setScores({});
    setAppState(AppState.Introduction);
  }, []);


  const renderContent = () => {
    switch (appState) {
      case AppState.Introduction:
        return <Introduction onStart={handleStart} />;
      case AppState.Questionnaire:
        return <Questionnaire onFinish={handleFinish} onRestart={handleRestart} />;
      case AppState.Results:
        return <Results scores={scores} onRestart={handleRestart} />;
      default:
        return <Introduction onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-100 min-h-screen text-slate-800 antialiased">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">BLINK式エニアグラム診断</h1>
        </header>
        <main className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-10">
            {renderContent()}
        </main>
        <footer className="text-center mt-8 text-sm text-slate-500">
            <p>&copy; 2024 BLINK Enneagram Personality Test. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;