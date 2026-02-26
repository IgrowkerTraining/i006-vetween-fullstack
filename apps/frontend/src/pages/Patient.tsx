import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import PatientButton from "../components/patient/PatientButton";
import PatientCard from "../components/patient/PatientCard";
import PatientTabs from "../components/patient/PatientTabs";
import DatosGenerales from "../components/patient/DatosGenerales";
import HistorialClinico from "../components/patient/HistorialClinico";
import HistorialVacunas from "../components/patient/HistorialVacunas";
import { VisitaClinica } from "../components/patient/VisitaClinicaTimeline";
import { Vacuna } from "../components/patient/VacunaTimeline";

// Datos de maqueta
const mockPatient = {
  id: "1",
  nombre: "Lorenzo",
  especie: "Perro",
  raza: "Dachshund (Salchicha)",
  edad: "5 años",
  peso: "12,5 kg",
  sexo: "Macho",
  color: "Marrón",
  senia: "Cuerpo alargado, sobrepeso evidente",
  esterilizado: true,
  tieneMicrochip: false,
  microchip: "",
  estado: "Activo" as const,
  imagenUrl: "",
};

const mockResponsable = {
  nombre: "Narella",
  apellido: "Ortiz",
  email: "narella.ortiz@hotmail.com",
  telefono: "+54 11 4432 7761",
  direccion: "Av. Italia 845, Tigre, Buenos Aires",
  relacion: "Tía / cuidadora",
};

// Mock de antecedentes clínicos previos (cuando el paciente fue dado de alta con diagnóstico previo)
const mockAntecedentesPrevios = {
  fecha: "18/02/2026",
  descripcion:
    "Paciente con diagnóstico previo de dermatitis alérgica.\nTratamiento previo con corticoides.",
};

// Mock de visitas clínicas
const mockVisitasIniciales: VisitaClinica[] = [
  {
    id: "1",
    fechaVisita: "18/02/2026",
    fechaCorregido: "23/02/2026",
    motivoConsulta: "Obesidad y posible ingestión de objeto extraño",
    expandido: true,
  },
  {
    id: "2",
    fechaVisita: "18/01/2026",
    motivoConsulta: "Control de peso",
    expandido: false,
  },
  {
    id: "3",
    fechaVisita: "15/12/2025",
    motivoConsulta: "Vacunación anual",
    expandido: false,
  },
];

// Mock de vacunas
const mockVacunasIniciales: Vacuna[] = [
  {
    id: "1",
    fechaAplicacion: "18/02/2026",
    nombreCientifico: "Séxtuple canina",
    tipoVacuna: "DHPPi + L",
    observacion: "Vacunación anual al día",
    expandido: true,
  },
  {
    id: "2",
    fechaAplicacion: "15/12/2025",
    nombreCientifico: "Antirrábica",
    tipoVacuna: "Rabia",
    observacion: "Sin reacciones adversas",
    expandido: false,
  },
];

const Patient: React.FC = () => {
  const [visitas, setVisitas] = useState<VisitaClinica[]>(mockVisitasIniciales);
  const [vacunas, setVacunas] = useState<Vacuna[]>(mockVacunasIniciales);

  const handleExpandir = (id: string) => {
    setVisitas((prev) =>
      prev.map((v) => ({
        ...v,
        expandido: v.id === id ? !v.expandido : v.expandido,
      })),
    );
  };

  const handleExpandirVacuna = (id: string) => {
    setVacunas((prev) =>
      prev.map((v) => ({
        ...v,
        expandido: v.id === id ? !v.expandido : v.expandido,
      })),
    );
  };

  const handleCorregirRegistro = (id: string) => {
    console.log("Corregir registro:", id);
  };

  const handleVerDetalle = (id: string) => {
    console.log("Ver detalle:", id);
  };
  const tabs = [
    {
      id: "datos-generales",
      label: "Datos generales",
      content: (
        <DatosGenerales
          responsable={mockResponsable}
          paciente={{
            nombre: mockPatient.nombre,
            especie: mockPatient.especie,
            raza: mockPatient.raza,
            edad: mockPatient.edad,
            color: mockPatient.color,
            senia: mockPatient.senia,
            sexo: mockPatient.sexo,
            peso: mockPatient.peso,
            esterilizado: mockPatient.esterilizado,
            tieneMicrochip: mockPatient.tieneMicrochip,
            microchip: mockPatient.microchip,
          }}
        />
      ),
    },
    {
      id: "historial-clinico",
      label: "Historial clínico",
      content: (
        <HistorialClinico
          visitas={visitas}
          antecedentesPrevios={mockAntecedentesPrevios}
          onCorregirRegistro={handleCorregirRegistro}
          onVerDetalle={handleVerDetalle}
          onExpandir={handleExpandir}
        />
      ),
    },
    {
      id: "vacunas",
      label: "Vacunas",
      content: (
        <HistorialVacunas vacunas={vacunas} onExpandir={handleExpandirVacuna} />
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        subtitle="Hola, usuario"
        title="Perfil clínico del paciente"
        showBackButton
        actions={<PatientButton mode="edit" />}
      />

      {/* Content */}
      <section className="flex-1 px-8 py-6">
        {/* Patient Card + Action Buttons */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <PatientCard
            nombre={mockPatient.nombre}
            estado={mockPatient.estado}
            especie={mockPatient.especie}
            raza={mockPatient.raza}
            imagenUrl={mockPatient.imagenUrl}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              Registrar visita clínica
            </button>
            <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              Registrar vacuna
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="shadow-sm">
          <PatientTabs tabs={tabs} defaultTab="datos-generales" />
        </div>

        {/* Generate Clinical Summary Button */}
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
            Generar resumen clínico
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Patient;
