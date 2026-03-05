import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import {
  EditPatientForm,
  PatientFormData,
} from "../components/forms/EditPatientForm";
import pawIconPlus from "../assets/pawIconPlus.svg";
import PatientCard from "../components/patient/PatientCard";
import PatientTabs from "../components/patient/PatientTabs";
import PatientOverview from "../components/patient/PatientOverview";
import ClinicalHistory from "../components/clinical/ClinicalHistory";
import VaccineHistory from "../components/vaccine/VaccineHistory";
import { VisitaClinica } from "../components/clinical/ClinicalVisitTimeline";
import { Vacuna } from "../components/vaccine/VaccineTimeline";
import {
  api,
  PatientDetailResponse,
  ResponsableDetailResponse,
} from "../services/api";
import { ROUTES } from "../constants/routes";
import { Modal } from "../components/common/Modal";
import {
  ClinicalVisitForm,
  ClinicalVisitFormData,
} from "../components/forms/ClinicalVisitForm";
import { VaccineForm, VaccineFormData } from "../components/forms/VaccineForm";

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientDetailResponse | null>(
    null,
  );
  const [responsableData, setResponsableData] =
    useState<ResponsableDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [visitas, setVisitas] = useState<VisitaClinica[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isVisitFormLoading, setIsVisitFormLoading] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const [editApiError, setEditApiError] = useState<string | null>(null);
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
    return isNaN(num)
      ? String(value)
      : `${num.toFixed(1).replace(".", ",")} kg`;
  };

  const buildDireccion = (d: PatientDetailResponse): string => {
    const r = responsableData ?? d.responsables;
    const calle = r?.direccion_calle ?? d.direccion_calle ?? "";
    const numero = r?.direccion_numero ?? d.direccion_numero ?? "";
    const localidad = r?.direccion_localidad ?? d.direccion_localidad ?? "";
    const provincia = r?.provincia ?? d.provincia ?? "";
    return (
      [calle, numero, localidad, provincia].filter(Boolean).join(", ") || "-"
    );
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
        nombre:
          responsableData?.nombre ??
          patientData.responsables?.nombre ??
          patientData.nombre_responsable ??
          "-",
        apellido:
          responsableData?.apellido ??
          patientData.responsables?.apellido ??
          patientData.apellido ??
          "-",
        email:
          responsableData?.email ??
          patientData.responsables?.email ??
          patientData.email ??
          "-",
        telefono:
          responsableData?.telefono ??
          patientData.responsables?.telefono ??
          patientData.telefono ??
          "-",
        direccion: buildDireccion(patientData),
        relacion:
          responsableData?.relacion ??
          patientData.responsables?.relacion ??
          patientData.relacion ??
          "-",
      }
    : null;

  const editInitialData: PatientFormData | undefined = patientData
    ? {
        patient: {
          name: patientData.nombre ?? patientData.nombre_paciente ?? "",
          species: patientData.especie ?? "",
          breed: patientData.raza ?? "",
          age: patientData.edad != null ? String(patientData.edad) : "",
          sex: patientData.sexo ?? "",
          weight: patientData.peso != null ? String(patientData.peso) : "",
          color: patientData.color ?? "",
          characteristic: patientData.senia ?? "",
          sterilized:
            patientData.esterilizado === true
              ? "yes"
              : patientData.esterilizado === false
                ? "no"
                : "",
          microchip:
            patientData.tiene_microchip === true
              ? "yes"
              : patientData.tiene_microchip === false
                ? "no"
                : "",
          microchipNumber: patientData.num_microchip ?? "",
        },
        responsible: {
          firstName:
            responsableData?.nombre ?? patientData.responsables?.nombre ?? "",
          lastName:
            responsableData?.apellido ??
            patientData.responsables?.apellido ??
            "",
          email:
            responsableData?.email ?? patientData.responsables?.email ?? "",
          street:
            responsableData?.direccion_calle ??
            patientData.responsables?.direccion_calle ??
            "",
          number:
            responsableData?.direccion_numero ??
            patientData.responsables?.direccion_numero ??
            "",
          locality:
            responsableData?.direccion_localidad ??
            patientData.responsables?.direccion_localidad ??
            "",
          province:
            responsableData?.provincia ??
            patientData.responsables?.provincia ??
            "",
          phone:
            responsableData?.telefono ??
            patientData.responsables?.telefono ??
            "",
          relationship:
            responsableData?.relacion ??
            patientData.responsables?.relacion ??
            "",
        },
      }
    : undefined;

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

  const handleEditSubmit = async (data: PatientFormData) => {
    if (!patientData) return;

    const patientId =
      patientData.id_pacientes ??
      patientData.id_paciente ??
      patientData.id ??
      id;
    const responsableId =
      patientData.id_responsable ?? patientData.responsables?.id_responsable;

    setIsEditFormLoading(true);
    setEditApiError(null);
    try {
      await api.updatePatient(patientId!, {
        nombre: data.patient.name,
        especie: data.patient.species,
        raza: data.patient.breed,
        edad: parseInt(data.patient.age, 10),
        sexo: data.patient.sex as "Macho" | "Hembra",
        peso: parseFloat(data.patient.weight.replace(",", ".")),
        color: data.patient.color,
        ...(data.patient.characteristic
          ? { senia: data.patient.characteristic }
          : {}),
        esterilizado: data.patient.sterilized === "yes",
        tiene_microchip: data.patient.microchip === "yes",
        ...(data.patient.microchip === "yes"
          ? { num_microchip: data.patient.microchipNumber }
          : {}),
      });

      if (responsableId) {
        await api.updateResponsable(responsableId, {
          nombre: data.responsible.firstName,
          apellido: data.responsible.lastName,
          email: data.responsible.email,
          telefono: data.responsible.phone,
          relacion: data.responsible.relationship,
          direccion_calle: data.responsible.street,
          direccion_numero: data.responsible.number,
          direccion_localidad: data.responsible.locality,
          provincia: data.responsible.province,
        });
      }

      // Re-fetch desde la BD para mostrar datos confirmados
      const updatedPatient = await api.getPatientById(String(patientId));
      setPatientData(updatedPatient);
      if (responsableId) {
        const updatedResponsable = await api.getResponsableById(responsableId);
        setResponsableData(updatedResponsable);
      }

      setIsEditModalOpen(false);
    } catch (err: any) {
      setEditApiError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsEditFormLoading(false);
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
          <p className="text-sm text-red-600">
            {fetchError ?? "No se encontró el paciente."}
          </p>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    {
      id: "datos-generales",
      label: "Datos generales",
      content: (
        <PatientOverview
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
        <ClinicalHistory
          visitas={visitas}
          onCorregirRegistro={() => {}}
          onVerDetalle={() => {}}
          onExpandir={handleExpandir}
        />
      ),
    },
    {
      id: "vacunas",
      label: "Vacunas",
      content: (
        <VaccineHistory vacunas={vacunas} onExpandir={handleExpandirVacuna} />
      ),
    },
  ];

  return (
    <MainLayout>
      <Modal
        isOpen={isVaccineModalOpen}
        onClose={() => setIsVaccineModalOpen(false)}
        title="Registro de Vacunas"
        size="md"
      >
        <VaccineForm
          onSave={handleVaccineSave}
          onClose={() => setIsVaccineModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditApiError(null);
        }}
        title="Editar paciente"
        size="lg"
      >
        {editApiError && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {editApiError}
          </div>
        )}
        <EditPatientForm
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditApiError(null);
          }}
          isLoading={isEditFormLoading}
          initialData={editInitialData}
        />
      </Modal>

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
        actions={
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-vetween-teal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-vetween-teal/85"
          >
            <img src={pawIconPlus} alt="" className="size-10" />
            Editar paciente
          </button>
        }
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
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Registrar visita clínica
            </button>
            <button
              onClick={() => setIsVaccineModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
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
            <p className="text-xs font-medium text-emerald-600">
              Generación de resumen clínico exitoso. Redirigiendo...
            </p>
          )}
          {summaryError && (
            <p className="text-xs text-red-600">{summaryError}</p>
          )}
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {isGeneratingSummary
              ? "Generando resumen..."
              : "Generar resumen clínico"}
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default PatientDetail;
