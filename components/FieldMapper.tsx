'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Draggable from 'react-draggable';
import axios from 'axios';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Field = {
  id: string;
  x: number;
  y: number;
  label: string;
};

type Props = {
  pdfUrl: string;
  docId: string;
};

export default function FieldMapper({ pdfUrl, docId }: Props) {
  const [fields, setFields] = useState<Field[]>([]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/fields/${docId}`).then(res => {
      setFields(res.data.fields || []);
    }).catch(() => {
      console.log('No saved mapping yet.');
    });
  }, [docId]);

  const addField = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newField: Field = {
      id: Date.now().toString(),
      x,
      y,
      label: 'Signature'
    };
    setFields(prev => [...prev, newField]);
  };

  const updateField = (id: string, x: number, y: number) => {
    setFields(prev =>
      prev.map(field => field.id === id ? { ...field, x, y } : field)
    );
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setSelectedField(null);
  };

  const saveMapping = async () => {
    await axios.post(`/api/fields/${docId}`, { fields });
    alert('Mapping saved!');
  };

  return (
    <div>
      <div className="relative border shadow p-2 inline-block" onClick={addField}>
        <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          {Array.from(new Array(numPages), (_, i) => (
            <Page key={`page_${i + 1}`} pageNumber={i + 1} width={600} />
          ))}
        </Document>

        {fields.map(field => (
          <Draggable
            key={field.id}
            defaultPosition={{ x: field.x, y: field.y }}
            onStop={(e, data) => updateField(field.id, data.x, data.y)}
          >
            <div
              className={`absolute px-2 py-1 bg-yellow-200 border border-yellow-600 cursor-move text-xs rounded ${
                selectedField === field.id ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedField(field.id);
              }}
            >
              {field.label}
              {selectedField === field.id && (
                <button
                  className="ml-2 text-red-500"
                  onClick={() => deleteField(field.id)}
                >
                  ✕
                </button>
              )}
            </div>
          </Draggable>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={saveMapping}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Mapping
        </button>
      </div>
    </div>
  );
}
