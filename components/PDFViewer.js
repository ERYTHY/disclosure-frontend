import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ fileUrl }) {
  return (
    <div className="border my-4">
      <Document file={fileUrl}><Page pageNumber={1} /></Document>
    </div>
  );
}
