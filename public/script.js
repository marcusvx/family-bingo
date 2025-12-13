document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('bingo-card');
    const newCardBtn = document.getElementById('new-card-btn');

    // Ranges for each column
    // B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
    const columns = [
        { min: 1, max: 15 },
        { min: 16, max: 30 },
        { min: 31, max: 45 },
        { min: 46, max: 60 },
        { min: 61, max: 75 }
    ];

    function getRandomNumber(min, max, usedNumbers) {
        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(num));
        usedNumbers.add(num);
        return num;
    }

    function generateCardMarkup() {
        // Keep header cells (B I N G O) - The first 5 divs are already in HTML,
        // but we'll clear everything after them or just rebuild the grid part.
        
        // Actually, let's keep it simple: clear non-header cells
        const headers = Array.from(cardContainer.querySelectorAll('.header-cell'));
        cardContainer.innerHTML = '';
        headers.forEach(h => cardContainer.appendChild(h));

        // Generate data for 5 columns
        const gridData = [];
        for (let colIndex = 0; colIndex < 5; colIndex++) {
            const range = columns[colIndex];
            const colNumbers = new Set();
            const colValues = [];
            for (let i = 0; i < 5; i++) {
                if (colIndex === 2 && i === 2) { // Center Free Space
                    colValues.push('FREE');
                } else {
                    colValues.push(getRandomNumber(range.min, range.max, colNumbers));
                }
            }
            gridData.push(colValues);
        }

        // Transpose logic to fill row by row for CSS Grid
        // Grid fills: Row 1 (B1, I1, N1, G1, O1), Row 2...
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const value = gridData[col][row];
                const cell = document.createElement('div');
                cell.classList.add('cell');
                
                if (value === 'FREE') {
                    cell.textContent = 'LIVRE';
                    cell.classList.add('free', 'marked'); // Auto-mark free space
                } else {
                    cell.textContent = value;
                    cell.addEventListener('click', () => {
                        cell.classList.toggle('marked');
                    });
                }
                
                cardContainer.appendChild(cell);
            }
        }
    }

    newCardBtn.addEventListener('click', generateCardMarkup);

    // Initial generation
    generateCardMarkup();
});
