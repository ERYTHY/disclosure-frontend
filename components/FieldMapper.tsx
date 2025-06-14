'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import axios from 'axios';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Field = {
  id: string;
  type: 'signature' | 'text';
  x: number;
  y: number;
};

export default function FieldMapper({ pdfUrl, docId }: { pdfUrl: string; docId: string }) {
  const [fields, setFields] = useState<Field[]>([]);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    axios.get(`/api/mappings/${docId}`).then(res => {
      setFields(res.data || []);
    });
  }, [docId]);

  const handleDragStop = (e: any, data: any, id: string) => {
    setFields(prev =>
      prev.map(f => (f.id === id ? { ...f, x: data.x, y: data.y } : f))
    );
  };

  const addField = (type: 'signature' | 'text') => {
    setFields(prev => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        type,
        x: 50,
        y: 50,
      },
    ]);
  };

  const removeField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const saveMappings = () => {
    axios.post(`/api/mappings/${docId}`, fields).then(() => {
      alert('Saved successfully!');
    });
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button onClick={() => addField('signature')} className="bg-blue-500 text-white px-2 py-1 rounded">Add Signature</button>
        <button onClick={() => addField('text')} className="bg-green-500 text-white px-2 py-1 rounded">Add Text Field</button>
        <button onClick={saveMappings} className="bg-purple-500 text-white px-2 py-1 rounded">Save</button>
      </div>

      <div className="relative border shadow inline-block">
        <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <Page pageNumber={1} />
        </Document>

        {fields.map(field => (
          <Draggable
            key={field.id}
            position={{ x: field.x, y: field.y }}
            onStop={(e, data) => handleDragStop(e, data, field.id)}
          >
            <div
              className={`absolute px-2 py-1 rounded text-xs cursor-move ${
                field.type === 'signature' ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ zIndex: 10 }}
              onDoubleClick={() => removeField(field.id)}
            >
              {field.type.toUpperCase()}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
