"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ReviewPage() {
  const { sessionId } = useParams();
  const [pdfUrls, setPdfUrls] = useState([]);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    // Simulate fetching list of PDFs for session
    setPdfUrls([`/uploads/sample1_prefilled.pdf`, `/uploads/sample2_prefilled.pdf`]); // Replace with dynamic
  }, [sessionId]);

  const handleSign = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/sign/${sessionId}`, {
      name: "Client Name", // dynamically capture if needed
      phone: "1234567890"
    });
    setSigned(true);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Review Your Documents</h1>
      {pdfUrls.map((url, idx) => (
        <div key={idx} className="border mb-4">
          <Document file={url}><Page pageNumber={1} /></Document>
        </div>
      ))}
      {!signed ? (
        <button onClick={handleSign} className="bg-green-600 text-white px-4 py-2">Sign and Confirm</button>
      ) : (
        <p className="text-green-700 mt-4">Documents signed and sent.</p>
      )}
    </div>
  );
}