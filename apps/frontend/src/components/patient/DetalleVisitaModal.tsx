import React, { useEffect, useCallback } from "react";

export interface DetalleVisita {
  id: string;
  estado: "Corregido" | "Original" | "Pendiente";
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}

interface DetalleVisitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  visita: DetalleVisita | null;
}

interface DataItemProps {
  label: string;
  value: string;
}

const DataItem: React.FC<DataItemProps> = ({ label, value }) => (
  <li className="text-sm text-foreground">
    <span className="font-semibold">{label}:</span> {value}
  </li>
);

const DetalleVisitaModal: React.FC<DetalleVisitaModalProps> = ({
  isOpen,
  onClose,
  visita,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
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

  if (!isOpen || !visita) return null;

  const getEstadoBadgeStyles = (estado: DetalleVisita["estado"]) => {
    switch (estado) {
      case "Corregido":
        return "bg-vetween-teal/20 text-vetween-teal border-vetween-teal";
      case "Original":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full max-w-md flex flex-col
          max-h-[90vh]
          bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden
          transform transition-all duration-200
          animate-in fade-in zoom-in-95
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-end px-6 py-4 bg-vetween-teal rounded-t-xl">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-foreground/80 hover:text-foreground hover:bg-white/20 transition-colors"
          >
            <svg
              className="w-5 h-5"
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

        {/* Body - Scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50 rounded-b-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-vetween-teal/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-vetween-teal">
          {/* Estado Badge */}
          <div className="flex justify-center mb-6">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium ${getEstadoBadgeStyles(visita.estado)}`}
            >
              Estado: {visita.estado}
            </span>
          </div>

          {/* Datos de la visita */}
          <ul className="list-disc list-inside space-y-2 mb-6">
            <DataItem label="Fecha" value={visita.fecha} />
            <DataItem
              label="Motivo de consulta"
              value={visita.motivoConsulta}
            />
            <DataItem label="Diagnóstico" value={visita.diagnostico} />
            <DataItem label="Tratamiento" value={visita.tratamiento} />
          </ul>

          {/* Observaciones */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Observaciones:
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {visita.observaciones}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleVisitaModal;
