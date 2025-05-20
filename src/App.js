import React, { useState } from 'react';
import { MathComponent } from 'mathjax-react';
import { solveEquation } from './api';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 15
};

function App() {
  const [page, setPage] = useState('welcome');
  const [equation, setEquation] = useState('');
  const [steps, setSteps] = useState([]);
  const [solution, setSolution] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSteps([]);
    setSolution(null);
    try {
      const result = await solveEquation(equation);
      setSteps(result.steps || []);
      setSolution(result.solution || '');
    } catch (err) {
      console.error(err);
      setSteps([{ type: 'text', content: 'Произошла ошибка на сервере' }]);
      setSolution('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans">
      <AnimatePresence mode="wait">
        {page === 'welcome' && (
          <motion.div
            key="welcome"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 text-center"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Решатель дифференциальных уравнений
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mb-8">
              Умное пошаговое решение с визуализацией и разбором. Простой ввод. Мгновенные результаты.
            </p>
            <button
              onClick={() => setPage('solver')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transition"
            >
              Начать!
            </button>
          </motion.div>
        )}

        {page === 'solver' && (
          <motion.div
            key="solver"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="max-w-5xl mx-auto px-4 py-10"
          >
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Пошаговое решение</h1>
                <button
                  onClick={() => setPage('welcome')}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  ← На главную
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Пример: y.diff(x) - y = 0"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl p-4 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
                >
                  Решить
                </button>
              </form>

              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-indigo-500 hover:text-indigo-700 text-sm mb-6 transition"
              >
                {showHelp ? 'Скрыть подсказки' : 'Показать подсказки по синтаксису'}
              </button>

              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-50 border border-indigo-300 rounded-xl p-6 mb-6 text-sm text-indigo-800"
                >
                  <p className="font-semibold mb-2">Поддерживаемый синтаксис:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><code>y.diff(x) - y = 0</code> — линейное ОДУ первого порядка</li>
                    <li><code>y.diff(x, 2) + y = 0</code> — уравнение второго порядка</li>
                    <li><code>y.diff(x) = x*y</code> — разделяющиеся переменные</li>
                    <li><code>Derivative(y(x), x) - sin(x) = 0</code> — символьный ввод</li>
                  </ul>
                </motion.div>
              )}

              {steps.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-gray-700 mb-4">Пошаговое решение:</h2>
                  <ol className="list-decimal list-inside space-y-4">
                    {steps.map((step, index) => (
                      <li key={index}>
                        {step.type === 'math' ? (
                          <MathComponent tex={step.content} display={true} />
                        ) : (
                          <p className="text-gray-600 text-base">{step.content}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {solution && (
                <div className="mt-10 border-t pt-6">
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">Итоговое решение:</h3>
                  <MathComponent tex={solution} display={true} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
