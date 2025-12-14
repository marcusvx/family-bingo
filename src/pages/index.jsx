import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import BingoCard from '../components/BingoCard';

// Modal needs to bind to the app element
Modal.setAppElement('#__next');

const STORAGE_KEY = 'family_bingo_state_v1';
const CONFIRM_MODAL_STYLES = {
  content: {},
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  }
};

const COLUMNS = [
  { min: 1, max: 15 },    // B
  { min: 16, max: 30 },   // I
  { min: 31, max: 45 },   // N
  { min: 46, max: 60 },   // G
  { min: 61, max: 75 }    // O
];

function App() {
  const [gridData, setGridData] = useState([]);
  const [markedIndices, setMarkedIndices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { gridData, markedIndices } = JSON.parse(saved);
      setGridData(gridData);
      setMarkedIndices(markedIndices);
    } else {
      generateNewCard();
    }
  }, []);

  useEffect(() => {
    if (gridData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ gridData, markedIndices }));
    }
  }, [gridData, markedIndices]);

  const getRandomNumber = (min, max, usedNumbers) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (usedNumbers.has(num));
    usedNumbers.add(num);
    return num;
  };

  // Fallback local generation
  const generateLocalCard = useCallback(() => {
    console.log('Using local fallback generation');
    const newGridData = [];
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const range = COLUMNS[colIndex];
      const colNumbers = new Set();
      const colValues = [];
      for (let i = 0; i < 5; i++) {
        if (colIndex === 2 && i === 2) {
          colValues.push('FREE');
        } else {
          colValues.push(getRandomNumber(range.min, range.max, colNumbers));
        }
      }
      newGridData.push(colValues);
    }
    return newGridData;
  }, []);

  const generateNewCard = async () => {
    try {
      const response = await fetch('/api/generate-card');
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      setGridData(data.gridData);
    } catch (error) {
      console.warn('Falling back to local generation due to API error:', error);
      const localData = generateLocalCard();
      setGridData(localData);
    }
    setMarkedIndices([]); // Clear marks
  };

  const handleCellClick = (index) => {
    setMarkedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const confirmNewCard = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    generateNewCard();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <header>
        <h1>BINGO</h1>
      </header>

      <main>
        {gridData.length > 0 && (
          <BingoCard
            gridData={gridData}
            markedIndices={markedIndices}
            onCellClick={handleCellClick}
          />
        )}
      </main>

      <footer>
        <button className="new-card-btn" onClick={confirmNewCard}>
          Nova Cartela
        </button>
      </footer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        contentLabel="Confirm New Card"
        className="modal-content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2>Nova Cartela</h2>
        <p>Tem certeza que deseja criar uma nova cartela? A cartela atual será perdida.</p>
        <div className="modal-actions">
          <button className="modal-btn btn-cancel" onClick={handleCancel}>Cancelar</button>
          <button className="modal-btn btn-confirm" onClick={handleConfirm}>Criar Nova</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
