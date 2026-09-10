"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface Props {
  open: boolean;
  url: string;
  title: string;
  onClose(): void;
}

export default function PDFViewerModal({
  open,
  url,
  title,
  onClose,
}: Props) {

  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">

      <div className="flex items-center justify-between p-4 border-b border-slate-700">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <div className="flex gap-3">

          <a
            href={url}
            target="_blank"
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500"
          >
            Download
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
          >
            Fechar
          </button>

        </div>

      </div>

      <div className="flex-1 overflow-auto flex justify-center p-4">

        <Document
          file={url}
          onLoadSuccess={({ numPages }) => {
            setPages(numPages);
            setPage(1);
          }}
        >
          <Page
            pageNumber={page}
            scale={scale}
          />
        </Document>

      </div>

      <div className="border-t border-slate-700 p-4 flex justify-center gap-4">

        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          ◀
        </button>

        <span>
          {page} / {pages}
        </span>

        <button
          onClick={() => setPage(Math.min(page + 1, pages))}
        >
          ▶
        </button>

        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.2))}
        >
          -
        </button>

        <span>
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale(scale + 0.2)}
        >
          +
        </button>

      </div>

    </div>
  );
}
