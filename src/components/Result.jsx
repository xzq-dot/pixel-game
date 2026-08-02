import React, { useState } from 'react';

function Result({ result, questions, onRestart }) {
  const [showReview, setShowReview] = useState(false);
  
  if (!result) return null;

  const { score, total, passed, details } = result;

  return (
    <div className="pixel-border shake">
      <h1 style={{ color: passed ? 'var(--success)' : 'var(--error)' }}>
        {passed ? 'YOU WIN!' : 'GAME OVER'}
      </h1>
      
      <img 
        src={passed ? 'https://api.dicebear.com/9.x/pixel-art/svg?seed=win' : 'https://api.dicebear.com/9.x/pixel-art/svg?seed=lose'} 
        alt="Result Face" 
        className="boss-image"
        style={{ borderColor: passed ? 'var(--success)' : 'var(--error)' }}
      />
      
      <h2>
        SCORE: {score} / {total}
      </h2>
      
      <p style={{ marginBottom: '2rem' }}>
        {passed 
          ? '太棒了！你已成功通关！' 
          : '很遗憾，你未达到通关要求，请再接再厉！'}
      </p>

      {details && details.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {!showReview ? (
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setShowReview(true); }}
              style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.8rem' }}
            >
              🔗 Click here to Review (查看错题)
            </a>
          ) : (
            <div className="review-section" style={{ textAlign: 'left', backgroundColor: '#1e293b', padding: '1rem', border: '2px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--primary)' }}>Review</h3>
              {details.map((d, index) => {
                const questionData = questions.find(q => String(q.id) === String(d.id));
                if (!questionData) return null;
                return (
                  <div key={d.id} style={{ marginBottom: '1rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                    <p style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      {index + 1}. {questionData.question}
                    </p>
                    <div style={{ fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{ color: d.isCorrect ? 'var(--success)' : 'var(--error)' }}>
                        你的回答: {d.userAnswer} {questionData.options[d.userAnswer] ? `(${questionData.options[d.userAnswer]})` : ''} 
                        {d.isCorrect ? ' ✔' : ' ✘'}
                      </span>
                      {!d.isCorrect && (
                        <span style={{ color: 'var(--success)' }}>
                          正确答案: {d.correctAnswer} {questionData.options[d.correctAnswer] ? `(${questionData.options[d.correctAnswer]})` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setShowReview(false); }}
                style={{ color: 'var(--secondary)', textDecoration: 'underline', fontSize: '0.8rem', display: 'block', textAlign: 'center', marginTop: '1rem' }}
              >
                Hide Review
              </a>
            </div>
          )}
        </div>
      )}
      
      <button onClick={onRestart}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default Result;
