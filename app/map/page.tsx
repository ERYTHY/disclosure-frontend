'use client';

import FieldMapper from '@/components/FieldMapper'; // or '@/components/FieldMapper' if using path alias


export default function Page() {
  const pdfUrl = '/uploads/sample.pdf';
  const docId = 'sample123';

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Map Signature Fields</h1>
      <FieldMapper pdfUrl={pdfUrl} docId={docId} />
    </main>
  );
}