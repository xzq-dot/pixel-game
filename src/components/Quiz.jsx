import React, { useState, useEffect } from 'react';

function Quiz({ questions, bossImages, onSubmit, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const bossUrl = bossImages[currentIndex % bossImages.length];

  const handleOptionClick = (optionKey) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionKey
    };
    
    setAnswers(newAnswers);

    // Auto next after a tiny delay for better UX
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Automatically submit when the last question is answered
        setIsSubmitting(true);
        onSubmit(newAnswers);
      }
    }, 300);
  };

  if (isLoading || isSubmitting) {
    return (
      <div className="pixel-border">
        <h2>计算成绩中...</h2>
        <div className="loading" style={{ fontSize: '2rem', marginTop: '2rem' }}>...</div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="pixel-border">
      <div className="progress">
        <p>STAGE {currentIndex + 1} / {questions.length}</p>
      </div>
      
      <img src={bossUrl} alt="Boss" className="boss-image" />
      
      <h2>{currentQuestion.question}</h2>
      
      <div className="options-grid">
        {['A', 'B', 'C', 'D'].map((key) => {
          const optionText = currentQuestion.options[key];
          if (!optionText) return null; // In case some options are empty
          
          const isSelected = answers[currentQuestion.id] === key;
          
          return (
            <button 
              key={key} 
              className={`option-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleOptionClick(key)}
            >
              {key}. {optionText}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Quiz;
