import React from 'react';
import free from '../assets/leia.png';

function BingoCard({ gridData, onCellClick, markedIndices }) {
  // ... (keeping existing logic) ...

  const rows = [];
  // (omitted loop logic as we don't need to change it, just the rendering part below)
  
  // Re-write the rendering loop to use the image
  const cells = [];
  let cellIndex = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const value = gridData[col][row];
      const currentIndex = cellIndex;
      const isMarked = markedIndices.includes(currentIndex);
      const isFree = value === 'FREE';

      cells.push(
        <div 
          key={currentIndex}
          className={`cell ${isMarked ? 'marked' : ''} ${isFree ? 'free' : ''}`}
          onClick={() => !isFree && onCellClick(currentIndex)}
        >
          {isFree ? <img src={free} alt="LIVRE" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : value}
        </div>
      );
      cellIndex++;
    }
  }

  return (
    <div className="bingo-card">
        <div className="header-cell">B</div>
        <div className="header-cell">I</div>
        <div className="header-cell">N</div>
        <div className="header-cell">G</div>
        <div className="header-cell">O</div>
        {cells}
    </div>
  );
}

export default BingoCard;
