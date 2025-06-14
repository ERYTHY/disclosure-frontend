'use client';

import { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pdfFiles.length === 0) {
      setMessage('Please select at least one PDF.');
      return;
    }

    const formData = new FormData();
pdfFiles.forEach((file) => formData.append('pdfs', file)); // ✅ "pdfs" must match multer config
formData.append('name', 'Test User');
formData.append('phone', '+15555555555');
formData.append('email', 'test@example.com');
formData.append('agentName', 'Agent Smith');
formData.append('agentPhone', '+15555555556');


    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/upload`,
        formData
      );
      setMessage(res.data.message);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setMessage('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">Upload Disclosures</h2>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      <ul className="mb-4">
        {pdfFiles.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>

      <button type="submit" className="btn btn-primary">Send</button>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </form>
  );
}
