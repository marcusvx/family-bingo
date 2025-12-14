
import { generateBingoNumbers } from '../../lib/random';

export default async function handler(req, res) {
  const apiKey = process.env.RANDOM_ORG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY_MISSING' });
  }

  try {
    // Generates 5 columns in one request
    const gridData = await generateBingoNumbers(apiKey);

    // Handle N column (index 2): middle number (index 2) is FREE
    gridData[2][2] = 'FREE';

    res.status(200).json({ gridData });
  } catch (error) {
    console.error('Random.org API Error:', error);
    res.status(500).json({ error: 'API_ERROR', details: error.message });
  }
}
