'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import axios from 'axios';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Field {
  id: string;
  x: number;
  y: number;
  label: string;
}

export default function FieldMapper({ pdfUrl, docId }: { pdfUrl: string; docId: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);

  useEffect(() => {
    // Fetch saved mappings
    axios.get(`/api/mappings/${docId}`).then(res => {
      setFields(res.data.fields || []);
    });
  }, [docId]);

  const addField = () => {
    setFields(prev => [
      ...prev,
      { id: crypto.randomUUID(), x: 50, y: 50, label: 'Signature' }
    ]);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const saveMapping = async () => {
    await axios.post(`/api/mappings/${docId}`, { fields });
    alert('Field mapping saved!');
  };

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
        <Page pageNumber={selectedPage} width={600} />
        {fields.map(field => (
          <Draggable
            key={field.id}
            defaultPosition={{ x: field.x, y: field.y }}
            onStop={(_, data) => {
              setFields(prev =>
                prev.map(f =>
                  f.id === field.id ? { ...f, x: data.x, y: data.y } : f
                )
              );
            }}
          >
            <div
              style={{
                position: 'absolute',
                background: 'rgba(255, 255, 0, 0.7)',
                padding: '4px',
                cursor: 'move',
                border: '1px solid #333',
              }}
              onDoubleClick={() => removeField(field.id)}
            >
              ✍ {field.label}
            </div>
          </Draggable>
        ))}
      </Document>
      <div className="flex space-x-4 mt-4">
        <button onClick={addField}>➕ Add Field</button>
        <button onClick={saveMapping}>💾 Save Mapping</button>
      </div>
      <div className="mt-2">
        Page: {selectedPage} / {numPages}
        <button disabled={selectedPage === 1} onClick={() => setSelectedPage(p => p - 1)}>⬅️</button>
        <button disabled={selectedPage === numPages} onClick={() => setSelectedPage(p => p + 1)}>➡️</button>
      </div>
    </div>
  );
}