import React from "react";
import VacunaTimeline, { Vacuna } from "./VacunaTimeline";

interface HistorialVacunasProps {
  vacunas: Vacuna[];
  onExpandir?: (id: string) => void;
}

const EmptyVacunas: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    {/* Icono de jeringa */}
    <div className="mb-4">
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-muted-foreground"
      >
        {/* Jeringa */}
        <path
          d="M20 44L44 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="24"
          y="24"
          width="20"
          height="8"
          rx="1"
          transform="rotate(-45 24 24)"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M16 48L12 52"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M48 16L52 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="28"
          x2="36"
          y2="36"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="32"
          y1="24"
          x2="40"
          y2="32"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>

    <h3 className="mb-2 text-center text-base font-semibold text-foreground">
      Aún no se han registrado vacunas.
    </h3>
    <p className="text-center text-sm text-muted-foreground">
      Podés comenzar cargando la primera vacuna
      <br />
      desde el botón superior.
    </p>
  </div>
);

const HistorialVacunas: React.FC<HistorialVacunasProps> = ({
  vacunas,
  onExpandir,
}) => {
  const tieneVacunas = vacunas.length > 0;

  return (
    <div>
      {tieneVacunas ? (
        <VacunaTimeline vacunas={vacunas} onExpandir={onExpandir} />
      ) : (
        <EmptyVacunas />
      )}
    </div>
  );
};

export default HistorialVacunas;
