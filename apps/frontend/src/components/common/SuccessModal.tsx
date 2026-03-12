import React, { useEffect, useCallback } from "react";
import checkCircle from "../../assets/check-circle.svg";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onAccept: () => void;
  icon?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message,
  onAccept,
  icon = checkCircle,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onAccept();
    },
    [onAccept],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Franja superior con la X */}
        <div className="flex items-center justify-end bg-indigo-600 px-3 py-2">
          <button
            onClick={onAccept}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex flex-col items-center px-10 pt-7 pb-8 gap-5">
          <img src={icon} alt="icono" className="w-16 h-16" />
          <p className="text-center text-sm font-medium text-slate-700 leading-snug">
            {message}
          </p>
          <button
            onClick={onAccept}
            className="px-10 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
