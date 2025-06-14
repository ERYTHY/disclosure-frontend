// app/map/page.tsx
'use client'; // ✅ Ensures this file is fully client-rendered

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically load FieldMapper so it’s excluded from SSR
const FieldMapper = dynamic(() => import('@/components/FieldMapper'), { ssr: false });

export default function MapPage() {
  const pdfUrl = '/uploads/sample.pdf'; // Replace with real backend URL later
  const docId = 'sample123'; // Replace with unique doc ID later

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">Map Signature Fields</h1>
      <Suspense fallback={<div>Loading PDF Mapper...</div>}>
        <FieldMapper pdfUrl={pdfUrl} docId={docId} />
      </Suspense>
    </main>
  );
}
