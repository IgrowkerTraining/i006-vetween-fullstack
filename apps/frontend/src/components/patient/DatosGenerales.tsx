import React from "react";

interface ResponsableData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  relacion: string;
}

interface PacienteData {
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  color: string;
  senia: string;
  sexo: string;
  peso: string;
  esterilizado: boolean;
  tieneMicrochip: boolean;
  microchip?: string;
}

interface DatosGeneralesProps {
  responsable: ResponsableData;
  paciente: PacienteData;
}

interface DataItemProps {
  label: string;
  value: string | React.ReactNode;
}

const DataItem: React.FC<DataItemProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-muted-foreground">{label}:</span>
    <span className="text-foreground">{value}</span>
  </div>
);

const DatosGenerales: React.FC<DatosGeneralesProps> = ({
  responsable,
  paciente,
}) => {
  return (
    <div className="space-y-8">
      {/* Datos del Responsable */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Datos Responsable
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DataItem label="Nombre" value={responsable.nombre} />
          <DataItem label="Apellido" value={responsable.apellido} />
          <DataItem label="Email" value={responsable.email} />
          <DataItem label="Teléfono" value={responsable.telefono} />
          <DataItem label="Dirección" value={responsable.direccion} />
          <DataItem
            label="Relación con el animal"
            value={responsable.relacion}
          />
        </div>
      </div>

      {/* Separador */}
      <hr className="border-border" />

      {/* Datos del Paciente */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Datos Paciente
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DataItem label="Nombre" value={paciente.nombre} />
          <DataItem label="Especie" value={paciente.especie} />
          <DataItem label="Raza" value={paciente.raza} />
          <DataItem label="Edad" value={paciente.edad} />
          <DataItem label="Color" value={paciente.color} />
          <DataItem
            label="Seña / característica"
            value={paciente.senia || "—"}
          />
          <DataItem label="Sexo" value={paciente.sexo} />
          <DataItem label="Peso" value={paciente.peso} />
          <DataItem
            label="Esterilizado"
            value={paciente.esterilizado ? "Sí" : "No"}
          />
          <DataItem
            label="Microchip"
            value={paciente.tieneMicrochip ? paciente.microchip || "Sí" : "No"}
          />
        </div>
      </div>
    </div>
  );
};

export default DatosGenerales;
