"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type PdfViewerProps = {
  url: string;
  className?: string;
  initialPage?: number;
};

// Configure pdf.js worker: v4 requires the ESM worker (mjs)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ url, className, initialPage = 1 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [width, setWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Match page width to container width using ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      const next = Math.max(0, Math.floor(rect.width));
      if (next && next !== width) setWidth(next);
    });
    ro.observe(el);
    const rectNow = el.getBoundingClientRect();
    if (rectNow.width) setWidth(Math.floor(rectNow.width));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={
        className ??
        "relative w-full overflow-auto bg-white sm:rounded-lg border-0"
      }
      style={{ maxHeight: 700 }}
    >
      <Document
        file={url}
        onLoadSuccess={(info) => setNumPages(info.numPages)}
        loading={<div className="p-4 text-center">Loading PDF…</div>}
        error={
          <div className="p-4 text-center text-red-600">
            Couldn't display PDF. Try opening in a new tab below.
          </div>
        }
      >
        <div className="flex justify-center">
          <Page
            pageNumber={initialPage}
            width={width}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </div>
      </Document>
    </div>
  );
}

export default PdfViewer;
