import React from "react";
import ClinicalHistoryBox from "./ClinicalHistoryBox";
import ClinicalVisitTimeline, { VisitaClinica } from "./ClinicalVisitTimeline";
import EmptyClinicalHistory from "./EmptyClinicalHistory";

interface AntecedentesPrevios {
  fecha: string;
  descripcion: string;
}

interface ClinicalHistoryProps {
  visitas: VisitaClinica[];
  antecedentesPrevios?: AntecedentesPrevios;
  onCorregirRegistro?: (id: string) => void;
  onVerDetalle?: (id: string) => void;
  onExpandir?: (id: string) => void;
}

const ClinicalHistory: React.FC<ClinicalHistoryProps> = ({
  visitas,
  antecedentesPrevios,
  onCorregirRegistro,
  onVerDetalle,
  onExpandir,
}) => {
  const tieneVisitas = visitas.length > 0;

  return (
    <div>
      {/* Antecedentes clínicos previos (si el paciente fue dado de alta con diagnóstico previo) */}
      {antecedentesPrevios && (
        <ClinicalHistoryBox
          fecha={antecedentesPrevios.fecha}
          descripcion={antecedentesPrevios.descripcion}
        />
      )}

      {/* Timeline de visitas o estado vacío */}
      {tieneVisitas ? (
        <ClinicalVisitTimeline
          visitas={visitas}
          onCorregirRegistro={onCorregirRegistro}
          onVerDetalle={onVerDetalle}
          onExpandir={onExpandir}
        />
      ) : (
        <EmptyClinicalHistory />
      )}
    </div>
  );
};

export default ClinicalHistory;
