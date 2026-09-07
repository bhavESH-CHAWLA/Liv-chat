import { useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import FocusTrap from "./a11y/FocusTrap";

function ImageLightbox({ src, alt = "Attached image", onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `liv-chat-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn"
      onClick={onClose}
    >
      <FocusTrap onEscape={onClose}>
        <div
          className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls Toolbar */}
          <div className="absolute top-[-52px] right-0 flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(prev + 0.25, 3))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Download image"
              title="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-xl transition focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Close image preview"
              title="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Canvas */}
          <div className="overflow-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-2 shadow-2xl">
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${zoom})`, transition: "transform 0.15s ease-out" }}
              className="max-h-[80vh] max-w-full object-contain rounded-xl select-none"
            />
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}

export default ImageLightbox;
