import React from "react";

interface PatientCardProps {
  nombre: string;
  estado: "Activo" | "Inactivo";
  especie?: string;
  raza?: string;
  imagenUrl?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  nombre,
  estado,
  especie,
  raza,
  imagenUrl,
}) => {
  return (
    <div className="flex h-32 items-stretch overflow-hidden rounded-xl bg-vetween-ice shadow-md">
      {/* Imagen del paciente */}
      <div className="relative w-42 shrink-0 overflow-hidden rounded-xl bg-muted">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={`Foto de ${nombre}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-muted-foreground text-center px-2">
              {especie && raza ? `${especie} - ${raza}` : "Sin imagen"}
            </span>
          </div>
        )}
      </div>

      {/* Info del paciente */}
      <div className="flex flex-col justify-center px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">{nombre}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estado:</span>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              estado === "Activo"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {estado}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
