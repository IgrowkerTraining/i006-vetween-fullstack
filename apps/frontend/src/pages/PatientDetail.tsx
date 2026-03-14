import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { EditPatientForm } from "../components/forms/EditPatientForm";
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
import { SuccessModal } from "../components/common/SuccessModal";
import { DangerConfirmModal } from "../components/common/DangerConfirmModal";
import {
  ClinicalVisitForm,
  ClinicalVisitFormData,
} from "../components/forms/ClinicalVisitForm";
import { VaccineForm, VaccineFormData } from "../components/forms/VaccineForm";
import { useAuth } from "../hooks/useAuth";
import { useEditPatient } from "../hooks/useEditPatient";
import { useToast } from "../context/ToastContext";
import { PatientDetailSkeleton } from "../components/common/Skeleton";
import { runWithoutToast } from "../utils/httpErrorHandler";
import huellaRoja from "../assets/huella-roja.svg";
import ErrorStateCard from "../components/common/ErrorStateCard";

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "usuario";
  const userDisplayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const [patientData, setPatientData] = useState<PatientDetailResponse | null>(
    null,
  );
  const [responsableData, setResponsableData] =
    useState<ResponsableDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [visitas, setVisitas] = useState<VisitaClinica[]>([]);
  const [vacunas, setVacunas] = useState<Vacuna[]>([]);
  const [visitasPagina, setVisitasPagina] = useState(1);
  const [visitasUltimaPagina, setVisitasUltimaPagina] = useState(1);
  const [isVisitasLoading, setIsVisitasLoading] = useState(false);
  const [vacunasPagina, setVacunasPagina] = useState(1);
  const [vacunasUltimaPagina, setVacunasUltimaPagina] = useState(1);
  const [isVacunasLoading, setIsVacunasLoading] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isVisitFormLoading, setIsVisitFormLoading] = useState(false);
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const {
    isEditModalOpen,
    isEditFormLoading,
    editApiError,
    editInitialData,
    openEdit,
    closeEdit,
    submitEdit,
    showSuccessModal,
    closeSuccessModal,
  } = useEditPatient(async (patientId) => {
    const updated = await api.getPatientById(patientId);
    setPatientData(updated);
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [showSummarySuccessModal, setShowSummarySuccessModal] = useState(false);
  const [showSummaryErrorModal, setShowSummaryErrorModal] = useState(false);
  const [showVisitLimitModal, setShowVisitLimitModal] = useState(false);
  const [visitErrorMessage, setVisitErrorMessage] = useState<string | null>(null);
  const [showVisitSuccessModal, setShowVisitSuccessModal] = useState(false);
  const [showVaccineSuccessModal, setShowVaccineSuccessModal] = useState(false);
  const [showVaccineErrorModal, setShowVaccineErrorModal] = useState(false);
  const [vaccineErrorMessage, setVaccineErrorMessage] = useState<string | null>(null);
  const [showDeactivateVisitModal, setShowDeactivateVisitModal] =
    useState(false);
  const [visitToDeactivateId, setVisitToDeactivateId] = useState<string | null>(
    null,
  );
  const [isDeactivatingVisit, setIsDeactivatingVisit] = useState(false);
  const [showDeactivateVisitSuccessModal, setShowDeactivateVisitSuccessModal] =
    useState(false);

  const loadPatientData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setFetchError(null);
      const [data, visitasResult, vacunasResult] = await Promise.all([
        api.getPatientById(id),
        api.getVisitasByPatientId(id, 1),
        api.getVacunasByPatientId(id, 1),
      ]);
      setPatientData(data);
      setVisitasPagina(1);
      setVisitasUltimaPagina(visitasResult.ultimaPagina);
      const visitasData = visitasResult.data;
      const responsableId =
        data.id_responsable ?? data.responsables?.id_responsable;
      if (responsableId) {
        try {
          const respData = await api.getResponsableById(responsableId);
          setResponsableData(respData);
        } catch {
          // Si falla, continúa sin datos del responsable
        }
      }
      const pickText = (...values: unknown[]): string => {
        const found = values.find(
          (value) => typeof value === "string" && value.trim().length > 0,
        ) as string | undefined;
        return found ?? "-";
      };

      const mappedVisitas: VisitaClinica[] = visitasData.map((v, index) => {
        const visit = v as Record<string, unknown>;
        return {
          id: String(visit.id_visitas ?? visit.id_visita ?? visit.id ?? "-"),
          fechaVisita: pickText(visit.fecha, visit.fecha_visita),
          historialPrevio: Boolean(visit.historial_previo),
          motivoConsulta: pickText(
            visit.motivo_consulta,
            visit.motivoConsulta,
            visit.motivo,
          ),
          diagnostico: pickText(
            visit.diagnostico,
            visit.diagnosis,
            visit.diagnostico_visita,
          ),
          tratamiento: pickText(
            visit.tratamiento,
            visit.treatments,
            visit.tratamiento_indicado,
          ),
          observaciones: pickText(
            visit.observaciones,
            visit.observacion,
            visit.observaciones_generales,
          ),
          estado: visit.estado ? "Corregido" : "Original",
          inactiva: Boolean(visit.estado),
          expandido: index === 0,
        };
      });
      mappedVisitas.sort(
        (a, b) => Number(b.historialPrevio) - Number(a.historialPrevio),
      );
      setVisitas(mappedVisitas);
      const mappedVacunas: Vacuna[] = vacunasResult.data.map((v, index) => ({
        id: String(v.id_vacunas),
        fechaAplicacion: v.fecha_aplicacion,
        nombreCientifico: v.nombre_cientifico,
        tipoVacuna: v.tipo,
        observacion: v.observacion,
        expandido: index === 0,
      }));
      setVacunasPagina(1);
      setVacunasUltimaPagina(vacunasResult.ultimaPagina);
      setVacunas(sortVacunasByFechaDesc(mappedVacunas));
    } catch (err: any) {
      setFetchError(err?.message || "No se pudo cargar el paciente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
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

  const getVaccineDateTimestamp = (dateValue: string): number => {
    const parsed = Date.parse(dateValue);
    if (!Number.isNaN(parsed)) return parsed;

    const match = dateValue.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
    }

    return 0;
  };

  const sortVacunasByFechaDesc = (items: Vacuna[]): Vacuna[] => {
    return [...items].sort((a, b) => {
      const dateDiff =
        getVaccineDateTimestamp(b.fechaAplicacion) -
        getVaccineDateTimestamp(a.fechaAplicacion);

      if (dateDiff !== 0) return dateDiff;
      return b.id.localeCompare(a.id);
    });
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

  const handleExpandir = (id: string) => {
    setVisitas((prev) =>
      prev.map((v) => ({
        ...v,
        expandido: v.id === id ? !v.expandido : v.expandido,
      })),
    );
  };

  const handleDesactivarVisita = (visitaId: string) => {
    setVisitToDeactivateId(visitaId);
    setShowDeactivateVisitModal(true);
  };

  const handleConfirmDesactivarVisita = async () => {
    if (!visitToDeactivateId) return;
    setIsDeactivatingVisit(true);
    try {
      await api.inactivarVisita(visitToDeactivateId);
      setVisitas((prev) =>
        prev.map((v) =>
          v.id === visitToDeactivateId ? { ...v, inactiva: true } : v,
        ),
      );
      setShowDeactivateVisitModal(false);
      setVisitToDeactivateId(null);
      setShowDeactivateVisitSuccessModal(true);
    } catch (err: any) {
      showToast(err.message || "Error al desactivar la visita", "error");
    } finally {
      setIsDeactivatingVisit(false);
    }
  };

  const handleVisitasPageChange = async (newPage: number) => {
    if (!id || newPage < 1 || newPage > visitasUltimaPagina) return;
    setIsVisitasLoading(true);
    try {
      const result = await api.getVisitasByPatientId(id, newPage);
      const pickText = (...values: unknown[]): string => {
        const found = values.find(
          (value) => typeof value === "string" && value.trim().length > 0,
        ) as string | undefined;
        return found ?? "-";
      };
      const mapped: VisitaClinica[] = result.data.map((v, index) => {
        const visit = v as Record<string, unknown>;
        return {
          id: String(visit.id_visitas ?? visit.id_visita ?? visit.id ?? "-"),
          fechaVisita: pickText(visit.fecha, visit.fecha_visita),
          historialPrevio: Boolean(visit.historial_previo),
          motivoConsulta: pickText(
            visit.motivo_consulta,
            visit.motivoConsulta,
            visit.motivo,
          ),
          diagnostico: pickText(
            visit.diagnostico,
            visit.diagnosis,
            visit.diagnostico_visita,
          ),
          tratamiento: pickText(
            visit.tratamiento,
            visit.treatments,
            visit.tratamiento_indicado,
          ),
          observaciones: pickText(
            visit.observaciones,
            visit.observacion,
            visit.observaciones_generales,
          ),
          estado: visit.estado ? "Corregido" : "Original",
          inactiva: Boolean(visit.estado),
          expandido: index === 0,
        };
      });
      mapped.sort(
        (a, b) => Number(b.historialPrevio) - Number(a.historialPrevio),
      );
      setVisitas(mapped);
      setVisitasPagina(newPage);
      setVisitasUltimaPagina(result.ultimaPagina);
    } catch (err: any) {
      console.error("Error al cargar visitas:", err.message);
    } finally {
      setIsVisitasLoading(false);
    }
  };

  const handleExpandirVacuna = (id: string) => {
    setVacunas((prev) =>
      prev.map((v) => ({
        ...v,
        expandido: v.id === id ? !v.expandido : v.expandido,
      })),
    );
  };

  const handleVacunasPageChange = async (newPage: number) => {
    if (!id || newPage < 1 || newPage > vacunasUltimaPagina) return;
    setIsVacunasLoading(true);
    try {
      const result = await api.getVacunasByPatientId(id, newPage);
      const mapped: Vacuna[] = result.data.map((v, index) => ({
        id: String(v.id_vacunas),
        fechaAplicacion: v.fecha_aplicacion,
        nombreCientifico: v.nombre_cientifico,
        tipoVacuna: v.tipo,
        observacion: v.observacion,
        expandido: index === 0,
      }));
      setVacunas(sortVacunasByFechaDesc(mapped));
      setVacunasPagina(newPage);
      setVacunasUltimaPagina(result.ultimaPagina);
    } catch (err: any) {
      console.error("Error al cargar vacunas:", err.message);
    } finally {
      setIsVacunasLoading(false);
    }
  };

  const handleVisitSubmit = async (data: ClinicalVisitFormData) => {
    const patientIdRaw =
      patientData?.id_pacientes ??
      patientData?.id_paciente ??
      patientData?.id ??
      id;

    const patientId = Number(patientIdRaw);

    if (!patientId || Number.isNaN(patientId)) {
      console.error("No se encontró el ID del paciente");
      return;
    }

    setIsVisitFormLoading(true);
    try {
      await runWithoutToast(() =>
        api.createVisit({
          fecha: data.date,
          motivo_consulta: data.reason,
          diagnostico: data.diagnosis,
          tratamiento: data.treatments,
          observaciones: data.observaciones,
          estado: false,
          historial_previo: data.hasPreviousHistory,
          id_paciente: patientId,
        }),
      );

      const newVisita: VisitaClinica = {
        id: String(Date.now()),
        fechaVisita: data.date,
        motivoConsulta: data.reason,
        diagnostico: data.diagnosis || "-",
        tratamiento: data.treatments || "-",
        observaciones: data.observaciones || "-",
        estado: "Original",
        expandido: true,
      };
      setVisitas((prev) => [newVisita, ...prev]);
      setIsVisitModalOpen(false);
      setShowVisitSuccessModal(true);
    } catch (err: any) {
      console.error("Error al registrar visita:", err.message);
      setIsVisitModalOpen(false);
      setVisitErrorMessage(err?.message || "No se pudo registrar la visita.");
      setShowVisitLimitModal(true);
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
      await runWithoutToast(() =>
        api.generateClinicalSummary({
          id_paciente: patientId,
        }),
      );
      setShowSummarySuccessModal(true);
    } catch (err: any) {
      console.error("Error al generar resumen clínico:", err.message);
      setSummaryError(err?.message || "No se pudo generar el resumen clínico.");
      setShowSummaryErrorModal(true);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleVaccineSave = async (data: VaccineFormData) => {
    const patientIdRaw =
      patientData?.id_pacientes ??
      patientData?.id_paciente ??
      patientData?.id ??
      id;

    const patientId = Number(patientIdRaw);

    if (!patientId || Number.isNaN(patientId)) {
      console.error("No se encontró el ID del paciente");
      return;
    }

    try {
      await api.createVaccine({
        tipo: data.tipoVacuna,
        nombre_cientifico: data.nombre_cientifico,
        fecha_aplicacion: data.fecha,
        observacion: data.observaciones,
        id_paciente: patientId,
      });

      // Re-fetch page 1 so the list reflects the real order from the backend.
      // (backend returns ultimaPagina: 0 regardless of actual page count, so we
      // can't rely on it for pagination — at least keep page 1 accurate.)
      const freshResult = await api.getVacunasByPatientId(String(patientId), 1);
      const freshMapped: Vacuna[] = freshResult.data.map((v, index) => ({
        id: String(v.id_vacunas),
        fechaAplicacion: v.fecha_aplicacion,
        nombreCientifico: v.nombre_cientifico,
        tipoVacuna: v.tipo,
        observacion: v.observacion,
        expandido: index === 0,
      }));
      setVacunas(sortVacunasByFechaDesc(freshMapped));
      setVacunasPagina(1);
      setVacunasUltimaPagina(freshResult.ultimaPagina);
      setIsVaccineModalOpen(false);
      setShowVaccineSuccessModal(true);
    } catch (err: any) {
      console.error("Error al registrar vacuna:", err.message);
      setVaccineErrorMessage(err?.message || "No se pudo registrar la vacuna.");
      setShowVaccineErrorModal(true);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PatientDetailSkeleton />
      </MainLayout>
    );
  }

  if (fetchError || !paciente || !responsable) {
    return (
      <MainLayout>
        <div className="px-8 py-8">
          <ErrorStateCard
            title="Hubo un error al cargar los datos generales"
            actionLabel="Reintentar"
            onAction={loadPatientData}
          />
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
        <div>
          <ClinicalHistory
            visitas={visitas}
            onDesactivarVisita={handleDesactivarVisita}
            onVerDetalle={() => {}}
            onExpandir={handleExpandir}
          />
          {visitasUltimaPagina > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 select-none">
              <button
                onClick={() => handleVisitasPageChange(visitasPagina - 1)}
                disabled={visitasPagina === 1 || isVisitasLoading}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground hover:bg-vetween-teal/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-sm text-muted-foreground">
                Página {visitasPagina} de {visitasUltimaPagina}
              </span>
              <button
                onClick={() => handleVisitasPageChange(visitasPagina + 1)}
                disabled={
                  visitasPagina === visitasUltimaPagina || isVisitasLoading
                }
                className="flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground hover:bg-vetween-teal/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "vacunas",
      label: "Vacunas",
      content: (
        <div>
          <VaccineHistory vacunas={vacunas} onExpandir={handleExpandirVacuna} />
          {vacunasUltimaPagina > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 select-none">
              <button
                onClick={() => handleVacunasPageChange(vacunasPagina - 1)}
                disabled={vacunasPagina === 1 || isVacunasLoading}
                className="flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground hover:bg-vetween-teal/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-sm text-muted-foreground">
                Página {vacunasPagina} de {vacunasUltimaPagina}
              </span>
              <button
                onClick={() => handleVacunasPageChange(vacunasPagina + 1)}
                disabled={
                  vacunasPagina === vacunasUltimaPagina || isVacunasLoading
                }
                className="flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground hover:bg-vetween-teal/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (isGeneratingSummary) {
    return (
      <MainLayout>
        <PatientDetailSkeleton />
      </MainLayout>
    );
  }

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

      <SuccessModal
        isOpen={showSuccessModal}
        message="Los datos se actualizaron correctamente"
        onAccept={closeSuccessModal}
      />
      <SuccessModal
        isOpen={showVisitSuccessModal}
        message="Se registró nueva visita clínica exitosamente"
        onAccept={() => setShowVisitSuccessModal(false)}
      />
      <SuccessModal
        isOpen={showVaccineSuccessModal}
        message="Se registró nueva vacuna exitosamente"
        onAccept={() => setShowVaccineSuccessModal(false)}
      />
      <SuccessModal
        isOpen={showVaccineErrorModal}
        message={vaccineErrorMessage || "No se pudo registrar la vacuna."}
        icon={huellaRoja}
        onAccept={() => {
          setShowVaccineErrorModal(false);
          setVaccineErrorMessage(null);
        }}
      />
      <SuccessModal
        isOpen={showDeactivateVisitSuccessModal}
        message="El registro de visita se canceló con éxito"
        onAccept={() => setShowDeactivateVisitSuccessModal(false)}
      />
      <SuccessModal
        isOpen={showVisitLimitModal}
        message={visitErrorMessage || "No se pudo registrar la visita."}
        icon={huellaRoja}
        onAccept={() => {
          setShowVisitLimitModal(false);
          setVisitErrorMessage(null);
        }}
      />
      <SuccessModal
        isOpen={showSummarySuccessModal}
        message="Generación de resumen clínico exitoso."
        onAccept={() => {
          setShowSummarySuccessModal(false);
          const pid =
            patientData?.id_pacientes ??
            patientData?.id_paciente ??
            patientData?.id ??
            id;
          navigate(`${ROUTES.CLINICAL_SUMMARY_DETAIL}/${pid}`);
        }}
      />
      <SuccessModal
        isOpen={showSummaryErrorModal}
        message={summaryError ?? "No se pudo generar el resumen clínico."}
        icon={huellaRoja}
        onAccept={() => {
          setShowSummaryErrorModal(false);
          setSummaryError(null);
        }}
      />
      <DangerConfirmModal
        isOpen={showDeactivateVisitModal}
        question="¿Estás seguro de que querés cancelar el registro de visita?"
        onCancel={() => {
          setShowDeactivateVisitModal(false);
          setVisitToDeactivateId(null);
        }}
        onConfirm={handleConfirmDesactivarVisita}
        isConfirmLoading={isDeactivatingVisit}
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        title="Editar paciente"
        size="lg"
      >
        {editApiError && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {editApiError}
          </div>
        )}
        {!editInitialData && !editApiError && (
          <div className="flex justify-center py-8 text-sm text-slate-400">
            Cargando...
          </div>
        )}
        {editInitialData && (
          <EditPatientForm
            onSubmit={submitEdit}
            onCancel={closeEdit}
            isLoading={isEditFormLoading}
            initialData={editInitialData}
          />
        )}
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
        subtitle={`Hola, ${userDisplayName}`}
        title="Perfil clínico del paciente"
        showBackButton
        actions={
          <button
            onClick={() => id && openEdit(id)}
            className="flex items-center gap-2 rounded-lg bg-[#5451FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5451FF]/85"
          >
            <img src={pawIconPlus} alt="" className="size-8" />
            Editar paciente
          </button>
        }
      />

      {/* Content */}
      <section className="relative flex-1 px-8 py-6">
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
              className="rounded-lg bg-[#5451FF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5451FF]/85"
            >
              Registrar visita clínica
            </button>
            <button
              onClick={() => setIsVaccineModalOpen(true)}
              className="rounded-lg bg-[#5451FF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5451FF]/85"
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
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="rounded-lg bg-[#5451FF] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5451FF]/85 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Generar resumen clínico
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default PatientDetail;
