import React from "react";
import AntecedentesClinicosBox from "./AntecedentesClinicosBox";
import VisitaClinicaTimeline, { VisitaClinica } from "./VisitaClinicaTimeline";
import EmptyHistorialClinico from "./EmptyHistorialClinico";

interface AntecedentesPrevios {
  fecha: string;
  descripcion: string;
}

interface HistorialClinicoProps {
  visitas: VisitaClinica[];
  antecedentesPrevios?: AntecedentesPrevios;
  onCorregirRegistro?: (id: string) => void;
  onVerDetalle?: (id: string) => void;
  onExpandir?: (id: string) => void;
}

const HistorialClinico: React.FC<HistorialClinicoProps> = ({
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
        <AntecedentesClinicosBox
          fecha={antecedentesPrevios.fecha}
          descripcion={antecedentesPrevios.descripcion}
        />
      )}

      {/* Timeline de visitas o estado vacío */}
      {tieneVisitas ? (
        <VisitaClinicaTimeline
          visitas={visitas}
          onCorregirRegistro={onCorregirRegistro}
          onVerDetalle={onVerDetalle}
          onExpandir={onExpandir}
        />
      ) : (
        <EmptyHistorialClinico />
      )}
    </div>
  );
};

export default HistorialClinico;
