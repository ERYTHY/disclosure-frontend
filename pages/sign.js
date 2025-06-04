// src/pages/Sign.js

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SignDisclosure = () => {
  const [searchParams] = useSearchParams();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const property = searchParams.get('property') || '';

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://disclosure-backend.onrender.com/api/preview-disclosure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, property })
        });
        const data = await response.json();
        setPreviewUrl(data.previewUrl);
      } catch (err) {
        setError('Error generating preview.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [name, email, phone, property]);

  const handleSign = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://disclosure-backend.onrender.com/api/generate-disclosure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, property })
      });
      const data = await response.json();
      setSignedUrl(data.downloadUrl);
    } catch (err) {
      setError('Error signing document.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Disclosure Review & Signing</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!signedUrl && previewUrl && (
        <>
          <iframe
            src={previewUrl}
            title="Disclosure Preview"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', marginBottom: '20px' }}
          />
          <button onClick={handleSign} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Tap to Sign & Confirm
          </button>
        </>
      )}

      {signedUrl && (
        <>
          <p>✅ Document signed successfully!</p>
          <a href={signedUrl} target="_blank" rel="noopener noreferrer">
            Download Your Signed Disclosure
          </a>
        </>
      )}
    </div>
  );
};

export default SignDisclosure;
