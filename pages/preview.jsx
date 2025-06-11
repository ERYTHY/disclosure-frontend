import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PreviewPage = () => {
  const router = useRouter();
  const { name, email, phone, tenant } = router.query;
  const [loading, setLoading] = useState(true);
  const [pdfLinks, setPdfLinks] = useState([]);

  useEffect(() => {
    if (!name || !email || !phone || !tenant) {
      setLoading(false); // Stop loading if essential params are missing
      return;
    }

    const fetchPDFs = async () => {
      try {
        const response = await fetch(`/api/get-preview-links?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&tenant=${tenant}`);
        const data = await response.json();
        setPdfLinks(data.pdfUrls); 
      } catch (err) {
        console.error('Failed to load PDF previews:', err);
        // setLoading(false) is already in finally
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, [name, email, phone, tenant]);

  const handleSign = () => {
    router.push({
      pathname: '/sign',
      query: { name, email, phone, tenant }
    });
  };

  if (loading) return <p>Loading your disclosure preview...</p>;
  

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Disclosure Preview for {name}</h1>
      <p>Please review the following documents before signing:</p>

      {pdfLinks.length > 0 ? (
        pdfLinks.map((url, idx) => (
          <div key={idx} style={{ marginBottom: '2rem' }}>
            <iframe
              src={url}
              width="100%"
              height="600px"
              style={{ border: '1px solid #ccc' }}
              title={`Disclosure ${idx + 1}`}
            />
          </div>
        ))
      ) : (
        <p>No preview PDFs available.</p>
      )}

      <button
        onClick={handleSign}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Click to Sign and Confirm
      </button>
    </div>
  );
};

export default PreviewPage;
