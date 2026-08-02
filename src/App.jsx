import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  const [view, setView] = useState('home'); // 'home', 'quiz', 'result'
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [bossImages, setBossImages] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [scoreResult, setScoreResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Preload boss images
  useEffect(() => {
    const preloadImages = () => {
      const urls = [];
      const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || 5);
      
      for (let i = 0; i < questionCount; i++) {
        // Use DiceBear pixel-art API
        const seed = Math.random().toString(36).substring(7);
        urls.push(`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`);
      }
      setBossImages(urls);
      
      // Optionally preload them in browser memory
      urls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    preloadImages();
  }, []);

  const startGame = async (id) => {
    if (!id.trim()) {
      setError('请输入 ID');
      return;
    }
    
    setUserId(id);
    setError(null);
    setIsLoading(true);
    
    try {
      const questionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || 5);
      const apiUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      
      if (!apiUrl || apiUrl.includes('YOUR_SCRIPT_ID')) {
        // Fallback to mock data for local testing if API not set up
        console.warn('API URL not configured, using mock data');
        setTimeout(() => {
          setQuestions([
            { id: 'Q1', question: 'React 是一种什么技术？', options: { A: '库', B: '框架', C: '语言', D: '数据库' } },
            { id: 'Q2', question: 'Vite 的特点是什么？', options: { A: '慢', B: '极速', C: '体积大', D: '难用' } },
            { id: 'Q3', question: 'CSS 中代表像素的单位？', options: { A: 'em', B: 'rem', C: 'px', D: 'vh' } }
          ]);
          setIsLoading(false);
          setView('quiz');
        }, 1000);
        return;
      }

      // We use fetch with POST text/plain to avoid CORS preflight issues 
      // if the GAS is not handling OPTIONS properly.
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'getQuestions',
          count: questionCount
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setQuestions(result.data);
        setView('quiz');
      } else {
        setError(result.error || '获取题目失败');
      }
    } catch (err) {
      console.error(err);
      setError('网络错误：' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitGame = async (answers) => {
    setUserAnswers(answers);
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
      
      if (!apiUrl || apiUrl.includes('YOUR_SCRIPT_ID')) {
        // Mock result
        setTimeout(() => {
          const details = questions.map(q => {
            const isCorrect = answers[q.id] === 'A'; // 模拟逻辑：全选 A 算对
            return {
              id: q.id,
              userAnswer: answers[q.id] || '-',
              correctAnswer: 'A',
              isCorrect: isCorrect
            };
          });
          const score = details.filter(d => d.isCorrect).length;
          setScoreResult({
            score: score,
            passed: score >= passThreshold,
            total: questions.length,
            details: details
          });
          setIsLoading(false);
          setView('result');
        }, 1500);
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'submitAnswers',
          userId: userId,
          answers: answers,
          passThreshold: passThreshold
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setScoreResult({
          score: result.score,
          passed: result.passed,
          total: result.total,
          details: result.details
        });
        setView('result');
      } else {
        setError(result.error || '提交失败');
      }
    } catch (err) {
      console.error(err);
      setError('网络错误：' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = () => {
    setView('home');
    setUserAnswers({});
    setScoreResult(null);
    setQuestions([]);
  };

  return (
    <div className="app-container">
      {view === 'home' && (
        <Home 
          onStart={startGame} 
          isLoading={isLoading} 
          error={error} 
        />
      )}
      
      {view === 'quiz' && (
        <Quiz 
          questions={questions}
          bossImages={bossImages}
          onSubmit={submitGame}
          isLoading={isLoading}
        />
      )}
      
      {view === 'result' && (
        <Result 
          result={scoreResult} 
          questions={questions}
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}

export default App;
