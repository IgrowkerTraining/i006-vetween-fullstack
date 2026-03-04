import React, { useState } from "react";
import DetalleVisitaModal, { DetalleVisita } from "./DetalleVisitaModal";

export interface VisitaClinica {
  id: string;
  fechaVisita: string;
  fechaCorregido?: string;
  motivoConsulta: string;
  expandido?: boolean;
  // Campos adicionales para el detalle
  estado?: "Corregido" | "Original" | "Pendiente";
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
}

interface VisitaClinicaTimelineProps {
  visitas: VisitaClinica[];
  onCorregirRegistro?: (id: string) => void;
  onVerDetalle?: (id: string) => void;
  onExpandir?: (id: string) => void;
}

// Datos mockup para el detalle de la visita
const getMockDetalleVisita = (visita: VisitaClinica): DetalleVisita => ({
  id: visita.id,
  estado: visita.estado || "Corregido",
  fecha: visita.fechaVisita,
  motivoConsulta:
    visita.motivoConsulta || "Obesidad y posible ingestión de objeto extraño",
  diagnostico:
    visita.diagnostico || "Obesidad y cuerpo extraño ingerido (trapo)",
  tratamiento:
    visita.tratamiento ||
    "Medicación para facilitar evacuación, control dietario",
  observaciones:
    visita.observaciones ||
    "Paciente alerta y reactivo. Condición corporal elevada (sobrepeso). Mucosas rosadas y húmedas. Auscultación cardiopulmonar dentro de parámetros normales. Abdomen blando, no doloroso a palpación, con leve distensión. Tránsito intestinal presente. Oídos limpios, sin signos de otitis. Temperatura dentro de valores fisiológicos. Se refuerza antecedente de ingesta recurrente de cuerpos extraños.",
});

const VisitaClinicaTimeline: React.FC<VisitaClinicaTimelineProps> = ({
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
    const detalleVisita = getMockDetalleVisita(visita);
    setSelectedVisita(detalleVisita);
    setModalOpen(true);
    onVerDetalle?.(visita.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVisita(null);
  };
  return (
    <div className="relative">
      {/* Línea vertical del timeline */}
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-vetween-teal" />

      <div className="space-y-4">
        {visitas.map((visita, index) => (
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
                    className="rounded-lg bg-vetween-teal px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-vetween-teal/90"
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

      {/* Modal de detalle de visita */}
      <DetalleVisitaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        visita={selectedVisita}
      />
    </div>
  );
};

export default VisitaClinicaTimeline;
