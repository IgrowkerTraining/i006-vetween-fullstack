import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { api, PatientDetailResponse, ResponsableDetailResponse } from "../services/api";
import { ROUTES } from "../constants/routes";
import { Modal } from "../components/common/Modal";
import { ClinicalVisitForm, ClinicalVisitFormData } from "../components/forms/ClinicalVisitForm";
import { VaccineRegistrationModal, VaccineFormData } from "../components/forms/VaccineRegistrationModal";

// Mock de antecedentes clínicos previos (pendiente de conectar a API)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _mockAntecedentesPrevios = {
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientDetailResponse | null>(null);
  const [responsableData, setResponsableData] = useState<ResponsableDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [visitas, setVisitas] = useState<VisitaClinica[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isVisitFormLoading, setIsVisitFormLoading] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summarySuccess, setSummarySuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
        const [data, visitasData, vacunasData] = await Promise.all([
          api.getPatientById(id),
          api.getVisitasByPatientId(id),
          api.getVacunasByPatientId(id),
        ]);
        setPatientData(data);
        const responsableId = data.id_responsable ?? data.id_responsables;
        if (responsableId) {
          try {
            const respData = await api.getResponsableById(responsableId);
            setResponsableData(respData);
          } catch {
            // Si falla, continúa sin datos del responsable
          }
        }
        const mappedVisitas: VisitaClinica[] = visitasData.map((v, index) => ({
          id: String(v.id_visitas),
          fechaVisita: v.fecha,
          motivoConsulta: v.motivo_consulta,
          diagnostico: v.diagnostico,
          tratamiento: v.tratamiento,
          observaciones: v.observaciones,
          estado: v.estado ? "Corregido" : "Original",
          expandido: index === 0,
        }));
        setVisitas(mappedVisitas);
        const mappedVacunas: Vacuna[] = vacunasData.map((v, index) => ({
          id: String(v.id_vacunas),
          fechaAplicacion: v.fecha_aplicacion,
          nombreCientifico: v.nombre_cientifico,
          tipoVacuna: v.tipo,
          observacion: v.observacion,
          expandido: index === 0,
        }));
        setVacunas(mappedVacunas);
      } catch (err: any) {
        setFetchError(err?.message || "No se pudo cargar el paciente.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  // Helpers para mapear los datos de la API al formato esperado por los componentes
  const mapEstado = (value: unknown): "Activo" | "Inactivo" => {
    if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
    if (typeof value === "string") {
      const v = value.toLowerCase();
      if (v === "true" || v === "activo") return "Activo";
    }
    return "Inactivo";
  };

  const formatEdad = (value: unknown): string => {
    if (!value && value !== 0) return "-";
    const num = Number(value);
    return isNaN(num) ? String(value) : `${num} año${num !== 1 ? "s" : ""}`;
  };

  const formatPeso = (value: unknown): string => {
    if (!value && value !== 0) return "-";
    const num = Number(value);
    return isNaN(num) ? String(value) : `${num.toFixed(1).replace(".", ",")} kg`;
  };

  const buildDireccion = (d: PatientDetailResponse): string => {
    const r = responsableData ?? d.responsables;
    const calle = r?.direccion_calle ?? d.direccion_calle ?? "";
    const numero = r?.direccion_numero ?? d.direccion_numero ?? "";
    const localidad = r?.direccion_localidad ?? d.direccion_localidad ?? "";
    const provincia = r?.provincia ?? d.provincia ?? "";
    return [calle, numero, localidad, provincia].filter(Boolean).join(", ") || "-";
  };

  const paciente = patientData
    ? {
        nombre: patientData.nombre ?? patientData.nombre_paciente ?? "-",
        especie: patientData.especie ?? "-",
        raza: patientData.raza ?? "-",
        edad: formatEdad(patientData.edad),
        peso: formatPeso(patientData.peso),
        sexo: patientData.sexo ?? "-",
        color: patientData.color ?? "-",
        senia: patientData.senia ?? "-",
        esterilizado: patientData.esterilizado ?? false,
        tieneMicrochip: patientData.tiene_microchip ?? false,
        microchip: patientData.num_microchip ?? "",
        estado: mapEstado(patientData.activo ?? patientData.estado),
        imagenUrl: "",
      }
    : null;

  const responsable = patientData
    ? {
        nombre: responsableData?.nombre ?? patientData.responsables?.nombre ?? patientData.nombre_responsable ?? "-",
        apellido: responsableData?.apellido ?? patientData.responsables?.apellido ?? patientData.apellido ?? "-",
        email: responsableData?.email ?? patientData.responsables?.email ?? patientData.email ?? "-",
        telefono: responsableData?.telefono ?? patientData.responsables?.telefono ?? patientData.telefono ?? "-",
        direccion: buildDireccion(patientData),
        relacion: responsableData?.relacion ?? patientData.responsables?.relacion ?? patientData.relacion ?? "-",
      }
    : null;

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

  const handleVisitSubmit = async (data: ClinicalVisitFormData) => {
    const patientId =
      patientData?.id_pacientes ??
      patientData?.id_paciente ??
      patientData?.id ??
      id;

    if (!patientId) {
      console.error("No se encontró el ID del paciente");
      return;
    }

    setIsVisitFormLoading(true);
    try {
      await api.createVisit({
        fecha: data.date,
        motivo_consulta: data.reason,
        diagnostico: data.diagnosis,
        tratamiento: data.treatments,
        observaciones: data.observaciones,
        estado: false,
        historial_previo: data.hasPreviousHistory,
        id_paciente: patientId,
      });

      const newVisita: VisitaClinica = {
        id: String(Date.now()),
        fechaVisita: data.date,
        motivoConsulta: data.reason,
        expandido: true,
      };
      setVisitas((prev) => [newVisita, ...prev]);
      setIsVisitModalOpen(false);
    } catch (err: any) {
      console.error("Error al registrar visita:", err.message);
    } finally {
      setIsVisitFormLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!patientData || !paciente) return;
    const patientId =
      patientData.id_pacientes ??
      patientData.id_paciente ??
      patientData.id ??
      id;

    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      await api.generateClinicalSummary({
        id_paciente: patientId,
        datos_clinicos: {
          paciente: {
            nombre: paciente.nombre,
            especie: paciente.especie,
            edad: patientData.edad,
            sexo: paciente.sexo,
            raza: paciente.raza,
            color: paciente.color,
            senia: paciente.senia,
            peso: patientData.peso,
            esterilizado: paciente.esterilizado,
            tiene_microchip: paciente.tieneMicrochip,
            num_microchip: paciente.microchip || undefined,
          },
          visitas: visitas.map((v) => ({
            fecha: v.fechaVisita,
            motivo_consulta: v.motivoConsulta,
            diagnostico: v.diagnostico,
            tratamiento: v.tratamiento,
            observaciones: v.observaciones,
            historial_previo: false,
          })),
          vacunas: vacunas.map((v) => ({
            tipo: v.tipoVacuna,
            nombre_cientifico: v.nombreCientifico,
            fecha_aplicacion: v.fechaAplicacion,
            observacion: v.observacion,
          })),
        },
      });
      setSummarySuccess(true);
      setSummaryError(null);
      setTimeout(() => {
        navigate(`${ROUTES.CLINICAL_SUMMARY_DETAIL}/${patientId}`);
      }, 1500);
    } catch (err: any) {
      console.error("Error al generar resumen clínico:", err.message);
      setSummaryError(err?.message || "No se pudo generar el resumen clínico.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleVaccineSave = async (data: VaccineFormData) => {
    const patientId =
      patientData?.id_pacientes ??
      patientData?.id_paciente ??
      patientData?.id ??
      id;

    if (!patientId) {
      console.error("No se encontró el ID del paciente");
      return;
    }

    try {
      await api.createVaccine({
        tipo: data.tipoVacuna,
        nombre_cientifico: data.nombre,
        fecha_aplicacion: data.fecha,
        observacion: data.observaciones,
        estado: false,
        id_paciente: patientId,
      });

      const newVacuna: Vacuna = {
        id: String(Date.now()),
        fechaAplicacion: data.fecha,
        nombreCientifico: data.nombre,
        tipoVacuna: data.tipoVacuna,
        observacion: data.observaciones,
        expandido: true,
      };
      setVacunas((prev) => [newVacuna, ...prev]);
      setIsVaccineModalOpen(false);
    } catch (err: any) {
      console.error("Error al registrar vacuna:", err.message);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">Cargando paciente...</p>
        </div>
      </MainLayout>
    );
  }

  if (fetchError || !paciente || !responsable) {
    return (
      <MainLayout>
        <div className="flex flex-1 items-center justify-center py-24">
          <p className="text-sm text-red-600">{fetchError ?? "No se encontró el paciente."}</p>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    {
      id: "datos-generales",
      label: "Datos generales",
      content: (
        <DatosGenerales
          responsable={responsable}
          paciente={{
            nombre: paciente.nombre,
            especie: paciente.especie,
            raza: paciente.raza,
            edad: paciente.edad,
            color: paciente.color,
            senia: paciente.senia,
            sexo: paciente.sexo,
            peso: paciente.peso,
            esterilizado: paciente.esterilizado,
            tieneMicrochip: paciente.tieneMicrochip,
            microchip: paciente.microchip,
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
      <VaccineRegistrationModal
        isOpen={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
        onSave={handleVaccineSave}
      />

      <Modal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        title="Registrar visita clínica"
        size="lg"
      >
        <ClinicalVisitForm
          onSubmit={handleVisitSubmit}
          onCancel={() => setIsVisitModalOpen(false)}
          isLoading={isVisitFormLoading}
        />
      </Modal>

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
            nombre={paciente.nombre}
            estado={paciente.estado}
            especie={paciente.especie}
            raza={paciente.raza}
            imagenUrl={paciente.imagenUrl}
          />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsVisitModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              Registrar visita clínica
            </button>
            <button
              onClick={() => setIsVaccineModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
              Registrar vacuna
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="shadow-sm">
          <PatientTabs tabs={tabs} defaultTab="datos-generales" />
        </div>

        {/* Generate Clinical Summary Button */}
        <div className="mt-6 flex flex-col items-end gap-2">
          {summarySuccess && (
            <p className="text-xs font-medium text-emerald-600">Generación de resumen clínico exitoso. Redirigiendo...</p>
          )}
          {summaryError && (
            <p className="text-xs text-red-600">{summaryError}</p>
          )}
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {isGeneratingSummary ? "Generando resumen..." : "Generar resumen clínico"}
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Patient;