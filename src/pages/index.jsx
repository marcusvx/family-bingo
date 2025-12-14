import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Modal from 'react-modal';
import confetti from 'canvas-confetti';
import BingoCard from '../components/BingoCard';
import { checkWin, FUN_MESSAGES } from '../lib/winLogic';

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
  const [isLoading, setIsLoading] = useState(true); // Start loading on mount
  const [winningIndices, setWinningIndices] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [showVictory, setShowVictory] = useState(false);

  // Ref to prevent victory effects on initial load
  const isInitialLoad = React.useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { gridData, markedIndices } = JSON.parse(saved);
      setGridData(gridData);
      setMarkedIndices(markedIndices);
      setIsLoading(false);
      // Re-check win on load just in case
      const win = checkWin(markedIndices);
      if (win) {
        setWinningIndices(win);
        // Ensure initial load doesn't trigger confetti
        isInitialLoad.current = true;
      }
    } else {
      generateNewCard();
      isInitialLoad.current = false;
    }
    // After mount, disable initial load check after a short delay or just let the effect handle it
    setTimeout(() => { isInitialLoad.current = false; }, 500);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
    setMarkedIndices([]); // Clear marks
    setWinningIndices([]);
    setShowVictory(false);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const showRandomToast = () => {
    // 30% chance to show a message
    if (Math.random() < 0.3) {
      const msg = FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCellClick = (index) => {
    let newMarked;
    if (markedIndices.includes(index)) {
      newMarked = markedIndices.filter(i => i !== index);
    } else {
      newMarked = [...markedIndices, index];
      // Only show random toast if it's NOT a win
      if (!checkWin(newMarked)) {
        showRandomToast();
      }
    }
    setMarkedIndices(newMarked);
  };

  // Effect to check win when marked indices change
  useEffect(() => {
    if (markedIndices.length < 5) {
      setWinningIndices([]);
      setShowVictory(false);
      return;
    }

    const winLine = checkWin(markedIndices);
    if (winLine) {
      // If loading from storage, skip effects
      if (isInitialLoad.current) {
        setWinningIndices(winLine);
        return;
      }

      if (winningIndices.length === 0) { // First time winning this game
        setWinningIndices(winLine);
        setShowVictory(true);
        triggerConfetti();
        // Auto-dismiss victory message after 5 seconds
        setTimeout(() => setShowVictory(false), 5000);
      }
    } else {
      setWinningIndices([]);
      setShowVictory(false);
    }
  }, [markedIndices]);

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
      <Head>
        <title>Family Bingo</title>
        <meta name="description" content="Bingo card generator for family fun" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header>
        <h1>BINGO</h1>
      </header>

      <main>
        {isLoading ? (
          <div className="bingo-card loading-placeholder">
            <div className="spinner"></div>
            <p>Gerando números...</p>
          </div>
        ) : (
          gridData.length > 0 && (
            <BingoCard
              gridData={gridData}
              markedIndices={markedIndices}
              winningIndices={winningIndices}
              onCellClick={handleCellClick}
            />
          )
        )}
      </main>

      {/* Victory Overlay */}
      {/* Victory Toast */}
      {showVictory && (
        <div className="toast-message victory-toast">
          Cinquina, parabéns!!!
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && (
        <div className="toast-message">
          {toastMessage}
        </div>
      )}

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
