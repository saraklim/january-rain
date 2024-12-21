import React, { useState } from 'react';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import FadeInText from './components/FadeInText';

const questions = [
  { question: "What animal brings blessings?", answer: "dog" },
  { question: "What animal gives the best hugs?", answer: "octopus" },
  { question: "What animal embodies the infinite complexity of a human relationship?", answer: "frog" },
];

const Authentication = ({ onAuthenticate }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [error, setError] = useState('');

  const handleContinue = () => {
    setCurrentScreen(1);
  };

  const handleAnswer = (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
      setError('');
      if (currentQuestionIndex === questions.length - 1) {
        onAuthenticate(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setAnswer('');
      }
    } else {
      setError('Incorrect answer. Try again.');
      setAnswer('');
    }
  };

  const handleReset = () => {
    setCurrentScreen(0);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setError('');
  };

  if (currentScreen === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <FadeInText delay={500}>
            <h1 className="text-3xl mb-8">Welcome friend.</h1>
          </FadeInText>
          <FadeInText delay={1500}>
            <button
              onClick={handleContinue}
              className="text-xl hover:text-blue-400 transition-colors duration-300 flex items-center"
            >
              Continue <ArrowRight className="ml-2" />
            </button>
          </FadeInText>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="max-w-md w-full px-8">
        <FadeInText delay={300}>
          <div className="text-white space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-light">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-2xl">
                {questions[currentQuestionIndex].question}
              </p>
            </div>

            <form onSubmit={handleAnswer} className="space-y-6">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full bg-transparent border-b border-gray-500 p-2 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
              
              {error && (
                <div className="text-red-400 text-center text-sm">{error}</div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-gray-500 hover:text-white flex items-center text-sm transition-colors"
                >
                  <RefreshCcw className="mr-2" size={14} />
                  Start Over
                </button>
                
                <button
                  type="submit"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Submit →
                </button>
              </div>
            </form>
          </div>
        </FadeInText>
      </div>
    </div>
  );
};

export default Authentication;