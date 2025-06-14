import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Field {
  id: string;
  page: number;
  x: number;
  y: number;
  type: 'signature' | 'text';
}

export default function PDFMapper({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [fields, setFields] = useState<Field[]>([]);
  const [currentFieldType, setCurrentFieldType] = useState<'signature' | 'text'>('signature');

  const handleDocumentLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageClick = (event: React.MouseEvent, page: number) => {
    const boundingBox = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;
    const newField: Field = {
      id: `${Date.now()}`,
      page,
      x,
      y,
      type: currentFieldType,
    };
    setFields((prev) => [...prev, newField]);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${currentFieldType === 'signature' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentFieldType('signature')}
        >
          Signature Field
        </button>
        <button
          className={`px-4 py-2 rounded ${currentFieldType === 'text' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setCurrentFieldType('text')}
        >
          Text Field
        </button>
      </div>

      <Document file={fileUrl} onLoadSuccess={handleDocumentLoad}>
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index} className="relative border shadow mb-4">
            <Page
              pageNumber={index + 1}
              width={600}
              onClick={(e) => handlePageClick(e, index + 1)}
            />
            {fields
              .filter((f) => f.page === index + 1)
              .map((field) => (
                <div
                  key={field.id}
                  className={`absolute w-6 h-6 rounded-full ${
                    field.type === 'signature' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ top: field.y, left: field.x }}
                  title={`${field.type} field`}
                ></div>
              ))}
          </div>
        ))}
      </Document>
    </div>
  );
}