'use client';

import { useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || files.length === 0) {
      setMessage('Please fill in all required fields and select at least one PDF.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('pdfs', file));
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/disclosure/upload`, formData);
      setMessage(res.data.message || 'Success! Link sent.');
    } catch (err) {
      setMessage('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Disclosure Upload Portal</h1>
      <p className="mb-6">Upload one or more PDFs and enter client information to send a signing link.</p>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="mb-4 block"
      />

      <input
        type="text"
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="tel"
        placeholder="Client Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded w-full"
      />
      <input
        type="email"
        placeholder="Client Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Sending...' : 'Send Disclosure Link'}
      </button>

      {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
    </main>
  );
}
