'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SessionReviewPage() {
  const router = useRouter();
  const { sessionId } = router.query;
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
