import React, { useState } from 'react';

function Home({ onStart, isLoading, error }) {
  const [idInput, setIdInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(idInput);
  };

  return (
    <div className="pixel-border shake">
      <h1>Pixel Quiz</h1>
      <p>准备好迎接挑战了吗？请输入你的 ID 开始游戏！</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="ENTER YOUR ID" 
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          disabled={isLoading}
        />
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? <span className="loading">LOADING...</span> : 'START GAME'}
        </button>
      </form>
      
      {error && <p style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default Home;
