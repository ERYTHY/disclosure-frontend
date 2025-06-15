"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ReviewPage() {
  const { sessionId } = useParams();
  const [pdfUrls, setPdfUrls] = useState([]);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/session/${sessionId}`);
        if (res.data && res.data.pdfs) {
          setPdfUrls(res.data.pdfs);
        } else {
          setError("No PDFs found in session.");
        }
      } catch (err) {
        console.error("Failed to load session:", err);
        setError("Unable to load documents.");
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const handleSign = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/sign/${sessionId}`, {
        name: "Client Name", // replace or dynamically capture
        phone: "1234567890"
      });
      setSigned(true);
    } catch (err) {
      console.error("Signing failed:", err);
      setError("Failed to sign documents.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Review Your Documents</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {pdfUrls.map((url, idx) => (
        <div key={idx} className="mb-6 border rounded shadow">
          <Document file={url} onLoadError={e => setError("Failed to load PDF file.")}>
            <Page pageNumber={1} />
          </Document>
        </div>
      ))}

      {!signed ? (
        <button
          onClick={handleSign}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Sign and Confirm
        </button>
      ) : (
        <p className="text-green-700 mt-4">Documents signed and sent.</p>
      )}
    </div>
  );
}
