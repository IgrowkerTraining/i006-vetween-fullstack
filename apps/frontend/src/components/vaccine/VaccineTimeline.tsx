import React from "react";
import Timeline, { TimelineItem } from "../common/Timeline";

export interface Vacuna extends TimelineItem {
  fechaAplicacion: string;
  nombreCientifico: string;
  tipoVacuna: string;
  observacion?: string;
}

interface VaccineTimelineProps {
  vacunas: Vacuna[];
  onExpandir?: (id: string) => void;
}

const VaccineTimeline: React.FC<VaccineTimelineProps> = ({
  vacunas,
  onExpandir,
}) => {
  const renderExpandedContent = (vacuna: Vacuna) => (
    <>
      <p className="mb-1 text-sm text-foreground">
        <span className="font-semibold">Fecha de aplicación:</span>{" "}
        {vacuna.fechaAplicacion}
      </p>
      <p className="mb-1 text-sm text-foreground">
        <span className="font-semibold">Nombre científico:</span>{" "}
        {vacuna.nombreCientifico}
      </p>
      <p className="mb-1 text-sm text-foreground">
        <span className="font-semibold">Tipo de vacuna:</span>{" "}
        {vacuna.tipoVacuna}
      </p>
      {vacuna.observacion && (
        <p className="text-sm text-foreground">
          <span className="font-semibold">Observación:</span>{" "}
          {vacuna.observacion}
        </p>
      )}
    </>
  );

  const renderCollapsedContent = (vacuna: Vacuna) => (
    <p className="text-sm text-foreground">
      <span className="font-semibold">Fecha de aplicación:</span>{" "}
      {vacuna.fechaAplicacion}
    </p>
  );

  return (
    <Timeline
      items={vacunas}
      renderExpandedContent={renderExpandedContent}
      renderCollapsedContent={renderCollapsedContent}
      onExpandir={onExpandir}
    />
  );
};

export default VaccineTimeline;
