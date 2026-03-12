import React, { useCallback, useEffect } from "react";
import redPawIcon from "../../assets/huella-roja.svg";

interface DangerConfirmModalProps {
  isOpen: boolean;
  question: string;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  isConfirmLoading?: boolean;
  icon?: string;
}

export const DangerConfirmModal: React.FC<DangerConfirmModalProps> = ({
  isOpen,
  question,
  onCancel,
  onConfirm,
  message,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  isConfirmLoading = false,
  icon = redPawIcon,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel],
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-end bg-indigo-600 px-3 py-2">
          <button
            onClick={onCancel}
            className="rounded p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Cerrar"
          >
            <svg
              className="h-4 w-4"
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

        <div className="flex flex-col items-center gap-4 px-12 pb-8 pt-6">
          <img src={icon} alt="alerta" className="h-14 w-14" />

          <h3 className="text-center text-2xl font-bold text-slate-800">
            {question}
          </h3>

          {message && (
            <p className="whitespace-pre-line text-center text-base leading-snug text-slate-700">
              {message}
            </p>
          )}

          <div className="mt-2 grid w-full grid-cols-2 gap-4">
            <button
              onClick={onCancel}
              className="rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-400"
              disabled={isConfirmLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              disabled={isConfirmLoading}
            >
              {isConfirmLoading ? "Procesando..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
