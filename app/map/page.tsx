// app/map/page.tsx
'use client'; // if you're using client-side features

export const dynamic = 'force-dynamic'; // ✅ disables static generation

import FieldMapper from '@/components/FieldMapper';

export default function MapPage() {
  const pdfUrl = '/uploads/sample.pdf'; // You might load this dynamically later
  const docId = 'sample123';

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Map Signature Fields</h1>
      <FieldMapper pdfUrl={pdfUrl} docId={docId} />
    </main>
  );
}