import React, { useState } from "react";
import DetalleVisitaModal, {
  DetalleVisita,
} from "../patient/DetalleVisitaModal";

export interface VisitaClinica {
  id: string;
  fechaVisita: string;
  fechaCorregido?: string;
  motivoConsulta: string;
  expandido?: boolean;
  historialPrevio?: boolean;
  // Campos adicionales para el detalle
  estado?: "Corregido" | "Original" | "Pendiente";
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
}

interface ClinicalVisitTimelineProps {
  visitas: VisitaClinica[];
  onCorregirRegistro?: (id: string) => void;
  onVerDetalle?: (id: string) => void;
  onExpandir?: (id: string) => void;
}

// Mapear datos reales de visita al formato DetalleVisita
const getDetalleVisita = (visita: VisitaClinica): DetalleVisita => ({
  id: visita.id,
  estado: visita.estado || "Original",
  fecha: visita.fechaVisita,
  motivoConsulta: visita.motivoConsulta || "-",
  diagnostico: visita.diagnostico || "-",
  tratamiento: visita.tratamiento || "-",
  observaciones: visita.observaciones || "-",
});

const ClinicalVisitTimeline: React.FC<ClinicalVisitTimelineProps> = ({
  visitas,
  onCorregirRegistro,
  onVerDetalle,
  onExpandir,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState<DetalleVisita | null>(
    null,
  );

  const handleVerDetalle = (visita: VisitaClinica) => {
    const detalleVisita = getDetalleVisita(visita);
    setSelectedVisita(detalleVisita);
    setModalOpen(true);
    onVerDetalle?.(visita.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVisita(null);
  };
  return (
    <div className="space-y-6">
      {/* Visitas con historial previo — fuera del timeline */}
      {visitas.filter((v) => v.historialPrevio).length > 0 && (
        <div className="space-y-3">
          {visitas.filter((v) => v.historialPrevio).map((visita) => (
            <div key={visita.id}>
              {visita.expandido ? (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Fecha de visita:</span>{" "}
                      {visita.fechaVisita}
                    </p>
                    <button
                      onClick={() => onExpandir?.(visita.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-foreground hover:bg-amber-100 flex-shrink-0 ml-2"
                    >
                      −
                    </button>
                  </div>
                  {visita.fechaCorregido && (
                    <p className="mb-1 text-sm text-foreground">
                      <span className="font-semibold">Registro corregido:</span>{" "}
                      {visita.fechaCorregido}
                    </p>
                  )}
                  <p className="mb-4 text-sm text-foreground">
                    <span className="font-semibold">Motivo de consulta:</span>{" "}
                    {visita.motivoConsulta}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerDetalle(visita)}
                      className="rounded-lg bg-indigo-100 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-indigo-200"
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Fecha de visita:</span>{" "}
                    {visita.fechaVisita}
                  </p>
                  <button
                    onClick={() => onExpandir?.(visita.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-foreground hover:bg-amber-100"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Visitas normales — con timeline visual */}
      {visitas.filter((v) => !v.historialPrevio).length > 0 && (
        <div className="relative">
          {/* Línea vertical del timeline */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-vetween-teal" />

          <div className="space-y-4">
            {visitas.filter((v) => !v.historialPrevio).map((visita) => (
              <div key={visita.id} className="relative flex gap-4">
                {/* Dot del timeline */}
                <div className="relative z-10 mt-1.5 flex-shrink-0">
                  <div
                    className={`h-4 w-4 rounded-full border-2 border-vetween-teal ${
                      visita.expandido ? "bg-vetween-teal" : "bg-white"
                    }`}
                  />
                </div>

                {/* Contenido de la visita */}
                {visita.expandido ? (
                  <div className="flex-1 rounded-lg border border-border bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Fecha de visita:</span>{" "}
                        {visita.fechaVisita}
                      </p>
                      <button
                        onClick={() => onExpandir?.(visita.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-foreground hover:bg-gray-100 flex-shrink-0 ml-2"
                      >
                        −
                      </button>
                    </div>
                    {visita.fechaCorregido && (
                      <p className="mb-1 text-sm text-foreground">
                        <span className="font-semibold">Registro corregido:</span>{" "}
                        {visita.fechaCorregido}
                      </p>
                    )}
                    <p className="mb-4 text-sm text-foreground">
                      <span className="font-semibold">Motivo de consulta:</span>{" "}
                      {visita.motivoConsulta}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onCorregirRegistro?.(visita.id)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Corregir registro
                      </button>
                      <button
                        onClick={() => handleVerDetalle(visita)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Fecha de visita:</span>{" "}
                      {visita.fechaVisita}
                    </p>
                    <button
                      onClick={() => onExpandir?.(visita.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-foreground hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de detalle de visita */}
      <DetalleVisitaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        visita={selectedVisita}
      />
    </div>
  );
};

export default ClinicalVisitTimeline;
