/**
 * Logic to detect a Bingo win (5 in a row/column/diagonal).
 * 
 * @param {Array<number>} markedIndices - Array of marked cell indices (0-24).
 * @returns {Array<number>|null} - Array of winning indices or null.
 */
export function checkWin(markedIndices) {
    // All possible winning lines (indices 0-24)
    const winningLines = [
        // Rows
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],

        // Columns
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],

        // Diagonals
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    // Check if any line is fully contained in markedIndices
    for (const line of winningLines) {
        if (line.every(index => markedIndices.includes(index))) {
            return line;
        }
    }

    return null;
}

/**
 * Checks for a full bingo (blackout).
 * Assumes index 12 is free and not in markedIndices.
 * A full win requires 24 marked numbers.
 * @param {Array<number>} markedIndices 
 * @returns {boolean}
 */
export function checkFullBingo(markedIndices) {
    // Normal bingo card has 25 slots, 1 is free (index 12).
    // So 24 marks means full board.
    return markedIndices.length === 24;
}

export const FUN_MESSAGES = [
    "Muito bem!",
    "Hoje está com sorte!",
    "Sabe o ditado né? Sorte no jogo, azar no amor...",
    "Hmm... suspeito...",
    "Tá sentindo o cheirinho de prêmio?",
    "Vai que é tua!",
    "Só mais um pouquinho...",
    "Eita, esse número eu não tinha!",
    "Anotou a placa?",
    "Esse jogo tá marcado hein!",
    "Olha a pressão!"
];
