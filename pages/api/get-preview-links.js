// disclosure-frontend/pages/api/get-preview-links.js
export default async function handler(req, res) {
  const { tenant, name, email, phone } = req.query;
  // This URL points to your backend service
  const backendUrl = `https://disclosure-backend.onrender.com/api/get-preview-links?tenant=${tenant}`;

  try {
    const backendResponse = await fetch(backendUrl);
    if (!backendResponse.ok) {
      const errorBody = await backendResponse.text();
      console.error(`Error from backend API (get-preview-links): ${backendResponse.status}`, errorBody);
      throw new Error(`Backend error: ${backendResponse.status} ${backendResponse.statusText}`);
    }
    
    const dataFromBackend = await backendResponse.json(); // This will be { previewLinks: [...] }
    
    let urls_to_send = [];
    if (dataFromBackend && dataFromBackend.pdfUrls && Array.isArray(dataFromBackend.pdfUrls)) {
      urls_to_send = dataFromBackend.pdfUrls;
    } else if (dataFromBackend && dataFromBackend.previewLinks && Array.isArray(dataFromBackend.previewLinks)) {
      // This condition should be met based on your backend code
      urls_to_send = dataFromBackend.previewLinks;
    } else if (Array.isArray(dataFromBackend)) {
      urls_to_send = dataFromBackend; // Fallback if backend just sends an array
    }

    // Ensure it's an array of strings before sending
    if (!Array.isArray(urls_to_send) || !urls_to_send.every(u => typeof u === 'string')) {
        console.warn('Preview links from backend were not in expected array format or after transformation. Original data from backend:', JSON.stringify(dataFromBackend, null, 2));
        urls_to_send = []; // Default to empty if structure is unexpected
    }

    // Crucially, respond with a "pdfUrls" key for pages/preview.jsx
    res.status(200).json({ pdfUrls: urls_to_send });

  } catch (error) {
    console.error('Error in frontend API /api/get-preview-links:', error.message);
    res.status(500).json({ error: 'Failed to fetch preview links' });
  }
}