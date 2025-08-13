"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { body, display } from "@/lib/fonts";
import {
  FaEraser,
  FaRegSquare,
  FaTimes,
  FaUndo,
  FaCheck,
} from "react-icons/fa";
import { pdfjs } from "react-pdf";

type RedactionCanvasProps = {
  file: File;
  onApply: (file: File) => void;
  onClose: () => void;
};

type Rect = { x: number; y: number; w: number; h: number };

export function RedactionCanvas({
  file,
  onApply,
  onClose,
}: RedactionCanvasProps) {
  const isImage = useMemo(() => file.type.startsWith("image/"), [file.type]);
  const isPdf = useMemo(() => file.type === "application/pdf", [file.type]);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [draft, setDraft] = useState<Rect | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null); // rendered PDF page or image backing
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Load image into memory
  useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageEl(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  // Load PDF and render a page to base canvas
  useEffect(() => {
    if (!isPdf) return;
    let cancelled = false;
    const load = async () => {
      try {
        // Ensure worker set (in case PdfViewer wasn't imported yet)
        if (!(pdfjs as any).GlobalWorkerOptions?.workerSrc) {
          (
            pdfjs as any
          ).GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${
            (pdfjs as any).version
          }/build/pdf.worker.min.mjs`;
        }
        // Avoid fetching blob URL; pass raw bytes to pdf.js
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);
        const doc = await (pdfjs as any).getDocument({ data }).promise;
        if (cancelled) return;
        setNumPages(doc.numPages || 1);
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 2 });
        const base = baseCanvasRef.current || document.createElement("canvas");
        base.width = viewport.width;
        base.height = viewport.height;
        const ctx = base.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;
        baseCanvasRef.current = base;
        setImageEl(null); // use base canvas instead of image
        // Size the visible canvas to match container and base dimensions
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (canvas && container && baseCanvasRef.current) {
          const baseW = baseCanvasRef.current.width;
          const baseH = baseCanvasRef.current.height;
          const maxWidth = Math.min(container.clientWidth, baseW);
          const s = maxWidth / baseW || 1;
          setScale(s);
          canvas.width = baseW;
          canvas.height = baseH;
          canvas.style.width = `${Math.floor(baseW * s)}px`;
          canvas.style.height = `${Math.floor(baseH * s)}px`;
        }
        draw();
      } catch (e) {
        console.error("Failed to render PDF page", e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, isPdf, pageNumber]);

  // Resize to fit container while maintaining image px dimensions in canvas
  useEffect(() => {
    if (
      !containerRef.current ||
      (!imageEl && !baseCanvasRef.current) ||
      !canvasRef.current
    )
      return;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const getBaseWidth = () =>
      imageEl ? imageEl.width : baseCanvasRef.current!.width;
    const getBaseHeight = () =>
      imageEl ? imageEl.height : baseCanvasRef.current!.height;

    const updateSize = () => {
      const baseW = getBaseWidth();
      const baseH = getBaseHeight();
      const maxWidth = Math.min(container.clientWidth, baseW);
      const s = maxWidth / baseW || 1;
      setScale(s);
      canvas.width = baseW; // internal pixels
      canvas.height = baseH;
      canvas.style.width = `${Math.floor(baseW * s)}px`;
      canvas.style.height = `${Math.floor(baseH * s)}px`;
      draw();
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    updateSize();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageEl, pageNumber]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || (!imageEl && !baseCanvasRef.current)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (imageEl) {
      ctx.drawImage(imageEl, 0, 0);
    } else if (baseCanvasRef.current) {
      ctx.drawImage(baseCanvasRef.current, 0, 0);
    }

    // Existing rects
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.9)"; // solid mask
    rects.forEach((r) => ctx.fillRect(r.x, r.y, r.w, r.h));
    ctx.restore();

    // Draft rect
    if (draft) {
      ctx.save();
      ctx.strokeStyle = "#2563eb"; // blue outline
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(draft.x, draft.y, draft.w, draft.h);
      ctx.restore();
    }
  };

  // Redraw whenever rects/draft change
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rects, draft]);

  // Mouse interactions (desktop + touch)
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    // convert from CSS px to canvas px
    const x = ((clientX - rect.left) / scale) | 0;
    const y = ((clientY - rect.top) / scale) | 0;
    return { x, y };
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!(isImage || isPdf)) return;
    e.preventDefault();
    const p = getPos(e);
    startPoint.current = p;
    setDraft({ x: p.x, y: p.y, w: 0, h: 0 });
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!(isImage || isPdf)) return;
    if (!startPoint.current) return;
    e.preventDefault();
    const p = getPos(e);
    const dx = p.x - startPoint.current.x;
    const dy = p.y - startPoint.current.y;
    const rect: Rect = {
      x: dx < 0 ? p.x : startPoint.current.x,
      y: dy < 0 ? p.y : startPoint.current.y,
      w: Math.abs(dx),
      h: Math.abs(dy),
    };
    setDraft(rect);
  };
  const onUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!(isImage || isPdf)) return;
    if (!startPoint.current || !draft) return;
    e.preventDefault();
    startPoint.current = null;
    if (draft.w > 4 && draft.h > 4) setRects((r) => [...r, draft]);
    setDraft(null);
  };

  const onUndo = () => {
    setRects((r) => r.slice(0, -1));
  };
  const onClear = () => {
    setRects([]);
    setDraft(null);
  };

  const onApplyClick = async () => {
    if (!canvasRef.current) return;
    // Masks already drawn into current canvas; export as PNG
    const blob: Blob | null = await new Promise((resolve) =>
      canvasRef.current!.toBlob(resolve as BlobCallback, "image/png", 0.95)
    );
    if (!blob) return;
    const suffix = isPdf ? `_page${pageNumber}_redacted.png` : `_redacted.png`;
    const redacted = new File([blob], file.name.replace(/\.[^.]+$/, suffix), {
      type: "image/png",
    });
    onApply(redacted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#F8E4C6] border-[3px] border-[#2c2c2c] rounded-xl shadow-[6px_6px_0_#2c2c2c] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-[#2c2c2c]">
          <h3
            className={cn(
              display.className,
              "text-lg sm:text-xl font-bold text-[#2c2c2c]"
            )}
          >
            Mask sensitive info
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 grid gap-4 overflow-auto min-h-0">
          {isPdf && (
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className={cn(
                  display.className,
                  "px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
                )}
              >
                Prev
              </button>
              <div className={cn(display.className, "text-sm")}>
                Page {pageNumber}
                {numPages ? ` / ${numPages}` : ""}
              </div>
              <button
                type="button"
                onClick={() =>
                  setPageNumber((p) =>
                    numPages ? Math.min(numPages, p + 1) : p + 1
                  )
                }
                disabled={numPages ? pageNumber >= numPages : false}
                className={cn(
                  display.className,
                  "px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
                )}
              >
                Next
              </button>
            </div>
          )}
          {(isImage || isPdf) && (
            <>
              <div
                className={cn(
                  body.className,
                  "text-xs sm:text-sm text-[#2c2c2c]"
                )}
              >
                Drag to draw black rectangles over sensitive regions. Use Undo
                or Clear as needed.
              </div>
              <div
                ref={containerRef}
                className="w-full overflow-auto border-[3px] border-[#2c2c2c] rounded-lg bg-white max-h-[60vh]"
              >
                <canvas
                  ref={canvasRef}
                  onMouseDown={onDown as any}
                  onMouseMove={onMove as any}
                  onMouseUp={onUp as any}
                  onTouchStart={onDown as any}
                  onTouchMove={onMove as any}
                  onTouchEnd={onUp as any}
                  className="touch-none block mx-auto"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onUndo}
                  disabled={rects.length === 0}
                  className={cn(
                    display.className,
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
                  )}
                >
                  <FaUndo className="h-4 w-4" /> Undo
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  disabled={rects.length === 0}
                  className={cn(
                    display.className,
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
                  )}
                >
                  <FaEraser className="h-4 w-4" /> Clear
                </button>
                <div
                  className={cn(
                    body.className,
                    "ml-auto text-xs sm:text-sm text-[#2c2c2c]/70 flex items-center gap-2"
                  )}
                >
                  {" "}
                  <FaRegSquare className="h-3 w-3" /> {rects.length} mask
                  {rects.length === 1 ? "" : "s"}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t-[3px] border-[#2c2c2c] bg-[#EBDDBF] rounded-b-xl">
          <button
            onClick={onClose}
            className={cn(
              display.className,
              "px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-white shadow-[3px_3px_0_#2c2c2c]"
            )}
          >
            Cancel
          </button>
          <button
            onClick={onApplyClick}
            disabled={!isImage && !isPdf}
            className={cn(
              display.className,
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[3px] border-[#2c2c2c] bg-green-400 hover:bg-green-500 shadow-[3px_3px_0_#2c2c2c] disabled:opacity-50"
            )}
          >
            <FaCheck className="h-4 w-4" /> Apply & Use Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default RedactionCanvas;
