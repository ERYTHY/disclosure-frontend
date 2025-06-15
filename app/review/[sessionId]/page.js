'use client';

import { useEffect, useState } from 'react';

export default function SessionReviewPage({ params }) {
  const sessionId = params.sessionId;
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`https://disclosure-backend.onrender.com/api/disclosure/session/${sessionId}`);
        if (!res.ok) throw new Error('Session not found.');
        const data = await res.json();
        setSession(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  const handleSign = async () => {
    if (!session) return;
    setSigning(true);
    try {
      const res = await fetch(`https://disclosure-backend.onrender.com/api/disclosure/sign/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.name,
          phone: session.phone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSigned(true);
        setDownloadUrl(data.downloadUrl);
      } else {
        throw new Error(data.error || 'Signing failed.');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSigning(false);
    }
  };

  if (loading) return <div className="p-4">Loading session...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!session || !session.pdfs || session.pdfs.length === 0) {
    return <div className="p-4">No PDFs found for this session.</div>;
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Review Disclosures</h1>
      <p className="text-gray-700">Please review the documents below:</p>

      {session.pdfs.map((pdfUrl, i) => (
        <iframe
          key={i}
          src={pdfUrl.startsWith('http') ? pdfUrl : `https://disclosure-backend.onrender.com${pdfUrl}`}
          width="100%"
          height="800px"
          className="border shadow"
          title={`PDF ${i + 1}`}
        />
      ))}

      {!signed && (
        <button
          onClick={handleSign}
          disabled={signing}
          className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          {signing ? 'Signing...' : 'Sign and Confirm'}
        </button>
      )}

      {signed && (
        <div className="mt-6 text-green-600 font-medium">
          Document signed!{' '}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            Download your signed disclosure
          </a>
        </div>
      )}
    </div>
  );
}
