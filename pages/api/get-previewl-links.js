export default async function handler(req, res) {
  const { tenant } = req.query;

  try {
    const response = await fetch(
      `https://disclosure-backend.onrender.com/api/get-preview-links?tenant=${tenant}`
    );

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching preview links:', error);
    res.status(500).json({ error: 'Failed to fetch preview links' });
  }
}
