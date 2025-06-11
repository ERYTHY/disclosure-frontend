// pages/api/admin/tenants.js
export default async function handler(req, res) {
  // This API route will fetch data from your backend's /api/admin/tenants endpoint
  const backendUrl = 'https://disclosure-backend.onrender.com/api/admin/tenants';

  try {
    const backendResponse = await fetch(backendUrl);

    if (!backendResponse.ok) {
      const errorBody = await backendResponse.text(); // Get more details from backend error
      console.error(`Error from backend API (/api/admin/tenants): ${backendResponse.status}`, errorBody);
      throw new Error(`Backend error: ${backendResponse.status} ${backendResponse.statusText}`);
    }

    const data = await backendResponse.json();
    // The data from the backend is expected to be in the format:
    // { default: "some_tenant_key", tenants: [ { key: "...", config: {...}, issues: [] }, ... ] }
    // This frontend API route will pass this data through directly.
    // The components (pages/start.jsx, pages/sign.jsx) will handle any necessary mapping.
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in frontend API /api/admin/tenants:', error.message);
    res.status(500).json({ error: 'Failed to fetch tenant configurations' });
  }
}
