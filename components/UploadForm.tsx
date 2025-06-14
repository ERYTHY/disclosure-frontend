'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(Array.from(e.target.files));
    }
  };

  return (
    <form>
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
    </form>
  );
}