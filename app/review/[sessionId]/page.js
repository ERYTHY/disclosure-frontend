// app/review/[sessionId]/page.js
'use client';

import { useEffect, useState } from 'react';

export default function SessionReviewPage({ params }) {
  const { sessionId } = params;
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

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
      {!session.signed && (
  <button
    onClick={async () => {
      try {
        const res = await fetch(`https://disclosure-backend.onrender.com/api/disclosure/sign/${sessionId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: session.name, phone: session.phone })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Documents signed! You can now download your copy.');
          setSession(prev => ({ ...prev, signed: true, pdfs: data.signedPdfs }));
        } else {
          alert(`Sign failed: ${data.error}`);
        }
      } catch (err) {
        alert('An error occurred during signing.');
        console.error(err);
      }
    }}
    className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
  >
    Sign and Confirm
  </button>
)}
{session.signed && (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Download Signed Documents:</h2>
    {session.pdfs.map((pdfUrl, i) => (
      <a
        key={i}
        href={pdfUrl.startsWith('http') ? pdfUrl : `https://disclosure-backend.onrender.com${pdfUrl}`}
        className="text-blue-600 underline block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Signed Document {i + 1}
      </a>
    ))}
  </div>
)}


    };

    fetchSession();
  }, [sessionId]);

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
    </div>
  );
}
