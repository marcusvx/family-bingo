
/**
 * Internal helper to interact with Random.org API.
 * Replaces the 'randomorg-js' dependency.
 */
export async function generateBingoNumbers(apiKey) {
    const url = 'https://api.random.org/json-rpc/4/invoke';

    // Bingo ranges
    // B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
    const payload = {
        "jsonrpc": "2.0",
        "method": "generateIntegerSequences",
        "params": {
            "apiKey": apiKey,
            "n": 5, // 5 columns
            "length": [5, 5, 5, 5, 5], // 5 numbers per column
            "min": [1, 16, 31, 46, 61],
            "max": [15, 30, 45, 60, 75],
            "replacement": [false, false, false, false, false], // No duplicates in a column
            "base": 10
        },
        "id": Date.now()
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Random.org API HTTP Error: ${response.status}`);
        }

        const json = await response.json();

        if (json.error) {
            throw new Error(`Random.org API Error: ${json.error.message} (Code: ${json.error.code})`);
        }

        // Result structure: result.random.data is an array of arrays [[B...], [I...], ...]
        if (!json.result || !json.result.random || !json.result.random.data) {
            throw new Error('Invalid Random.org response structure');
        }

        return json.result.random.data;

    } catch (error) {
        console.error('generateBingoNumbers failed:', error);
        throw error;
    }
}
