import React from 'react';

function BingoCard({ gridData, onCellClick, markedIndices }) {
  // We need to render row by row.
  // gridData is [col1, col2, col3, col4, col5]
  // We need [col1[0], col2[0], ...], [col1[1], col2[1]...]

  const rows = [];
  for(let r = 0; r < 5; r++) {
    for(let c = 0; c < 5; c++) {
      rows.push({
        value: gridData[c][r],
        index: r * 5 + c // Wait, simple index 0-24 based on row-major order
      });
    }
  }

  // Correction: The `index` passed to onCellClick needs to be consistent.
  // In the loop above:
  // r=0, c=0 -> index 0 (B1)
  // r=0, c=1 -> index 1 (I1) ...
  // This matches the grid structure.
  // Actually, let's keep it simple. The grid is 5x5.
  // We map 0..24 to the cells.

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
          {isFree ? 'LIVRE' : value}
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
