import React from "react";

const EmptyHistorialClinico: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Icono de libreta con lápiz */}
      <div className="mb-4">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-muted-foreground"
        >
          {/* Libreta */}
          <rect
            x="12"
            y="8"
            width="32"
            height="44"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          {/* Espiral de la libreta */}
          <line
            x1="12"
            y1="16"
            x2="18"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="24"
            x2="18"
            y2="24"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="32"
            x2="18"
            y2="32"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="12"
            y1="40"
            x2="18"
            y2="40"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Líneas de texto */}
          <line
            x1="22"
            y1="20"
            x2="38"
            y2="20"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="22"
            y1="28"
            x2="36"
            y2="28"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line
            x1="22"
            y1="36"
            x2="34"
            y2="36"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Lápiz */}
          <path
            d="M44 18L52 10L56 14L48 22L44 23L44 18Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <line
            x1="46"
            y1="16"
            x2="50"
            y2="20"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-center text-base font-semibold text-foreground">
        Aún no se han registrado visitas clínicas.
      </h3>
      <p className="text-center text-sm text-muted-foreground">
        Podés comenzar cargando la primera visita
        <br />
        desde el botón superior.
      </p>
    </div>
  );
};

export default EmptyHistorialClinico;
