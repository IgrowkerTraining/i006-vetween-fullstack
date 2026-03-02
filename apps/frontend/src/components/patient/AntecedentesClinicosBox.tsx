import React from "react";

interface AntecedentesClinicosBoxProps {
  fecha: string;
  descripcion: string;
}

const AntecedentesClinicosBox: React.FC<AntecedentesClinicosBoxProps> = ({
  fecha,
  descripcion,
}) => {
  return (
    <div className="mb-6 rounded-lg border border-border bg-amber-100 p-4">
      <h3 className="mb-2 text-sm font-semibold text-foreground">
        Antecedentes clínicos previos (informado al ingreso)
      </h3>
      <p className="mb-1 text-sm text-foreground">
        <span className="font-medium">Fecha:</span> {fecha}
      </p>
      <p className="whitespace-pre-line text-sm text-foreground">
        {descripcion}
      </p>
    </div>
  );
};

export default AntecedentesClinicosBox;
