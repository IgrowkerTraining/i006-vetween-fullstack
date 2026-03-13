import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { DangerConfirmModal } from "../components/common/DangerConfirmModal";
import {
  ResponsibleFormFields,
  ResponsibleData,
  ResponsibleErrors,
  initialResponsibleData,
  validateResponsibleData,
} from "../components/forms/ResponsibleFormFields";
import {
  PatientFormFields,
  PatientData,
  PatientErrors,
  initialPatientData,
  validatePatientData,
} from "../components/forms/PatientFormFields";
import { api, ResponsibleListItem } from "../services/api";
import { ROUTES } from "../constants/routes";

type PageStage = "responsable" | "paciente";
type ResponsableTab = "nuevo" | "existente";

const ResponsibleAndPatientRegister: React.FC = () => {
  const navigate = useNavigate();

  // ─── Stage ────────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<PageStage>("responsable");
  const [responsableTab, setResponsableTab] = useState<ResponsableTab>("nuevo");

  // Responsable resuelto: del POST nuevo o de la selección existente
  const [resolvedResponsable, setResolvedResponsable] = useState<{
    id: number;
    isNew: boolean;
  } | null>(null);

  // ─── Form data ────────────────────────────────────────────────────────────
  const [responsible, setResponsible] = useState<ResponsibleData>(
    initialResponsibleData,
  );
  const [patient, setPatient] = useState<PatientData>(initialPatientData);
  const [responsibleErrors, setResponsibleErrors] = useState<ResponsibleErrors>(
    {},
  );
  const [patientErrors, setPatientErrors] = useState<PatientErrors>({});

  // ─── Búsqueda de existentes ───────────────────────────────────────────────
  const [responsablesList, setResponsablesList] = useState<
    ResponsibleListItem[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponsable, setSelectedResponsable] =
    useState<ResponsibleListItem | null>(null);
  const [loadingResponsables, setLoadingResponsables] = useState(false);

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCancelPatientModal, setShowCancelPatientModal] = useState(false);
  const [isCancellingPatient, setIsCancellingPatient] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    message: string;
    onAccept: () => void;
  } | null>(null);

  // Carga la lista de responsables al montar (para la pestaña "existente")
  useEffect(() => {
    const extractPage = (
      res: unknown,
    ): { items: any[]; ultimaPagina: number } => {
      if (Array.isArray(res)) return { items: res, ultimaPagina: 1 };
      const r = res as any;
      if (Array.isArray(r?.data?.data))
        return { items: r.data.data, ultimaPagina: r.data.ultimaPagina || 1 };
      if (Array.isArray(r?.data)) return { items: r.data, ultimaPagina: 1 };
      if (Array.isArray(r?.responsables))
        return { items: r.responsables, ultimaPagina: 1 };
      return { items: [], ultimaPagina: 1 };
    };

    const load = async () => {
      setLoadingResponsables(true);
      try {
        const first = await api.getResponsables(1);
        const { items: page1, ultimaPagina } = extractPage(first);

        let all = [...page1];

        if (ultimaPagina > 1) {
          const pageNumbers = Array.from(
            { length: ultimaPagina - 1 },
            (_, i) => i + 2,
          );
          const rest = await Promise.all(
            pageNumbers.map((p) => api.getResponsables(p)),
          );
          rest.forEach((res) => {
            all = all.concat(extractPage(res).items);
          });
        }

        setResponsablesList(all);
      } catch {
        // no-op: el buscador simplemente no mostrará resultados
      } finally {
        setLoadingResponsables(false);
      }
    };
    load();
  }, []);

  const filteredResponsables = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return responsablesList.filter(
      (r) =>
        r.nombre?.toLowerCase().includes(q) ||
        r.apellido?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q),
    );
  }, [searchQuery, responsablesList]);

  // ─── Handlers: responsable nuevo ─────────────────────────────────────────
  const handleResponsibleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setResponsible((prev) => ({ ...prev, [name]: value }));
    if (responsibleErrors[name as keyof ResponsibleData]) {
      setResponsibleErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSiguienteNuevo = async () => {
    const errors = validateResponsibleData(responsible);
    if (Object.keys(errors).length > 0) {
      setResponsibleErrors(errors);
      return;
    }
    setIsSubmitting(true);
    setApiError(null);
    try {
      const result = (await api.createResponsable({
        nombre: responsible.firstName,
        apellido: responsible.lastName,
        email: responsible.email.trim().toLowerCase(),
        telefono: responsible.phone,
        relacion: responsible.relationship,
        direccion_calle: responsible.street,
        direccion_numero: responsible.number,
        direccion_localidad: responsible.locality,
        provincia: responsible.province,
      })) as any;

      const id =
        result?.data?.id_responsable ??
        result?.data?.id_responsables ??
        result?.responsable?.id_responsable ??
        result?.responsable?.id_responsables ??
        result?.id_responsable ??
        result?.id_responsables;
      if (!id) throw new Error("No se recibió el ID del responsable creado.");

      setResolvedResponsable({ id, isNew: true });
      setSuccessModal({
        message: "El responsable fue registrado correctamente.",
        onAccept: () => {
          setSuccessModal(null);
          setStage("paciente");
        },
      });
    } catch (err: any) {
      setApiError(err?.message || "Error al crear el responsable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Handlers: responsable existente ─────────────────────────────────────
  const handleSeleccionarExistente = (r: ResponsibleListItem) => {
    setSelectedResponsable(r);
  };

  const handleAnadirPacienteExistente = () => {
    if (!selectedResponsable) return;
    const rid =
      selectedResponsable.id_responsable ?? selectedResponsable.id_responsables;

    if (!rid) {
      setApiError(
        "No se pudo obtener el ID del responsable. Recargá la página e intentá de nuevo.",
      );
      return;
    }
    setResolvedResponsable({ id: rid, isNew: false });
    setStage("paciente");
  };

  // ─── Handlers: paciente ───────────────────────────────────────────────────
  const handlePatientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (patientErrors[name as keyof PatientData]) {
      setPatientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePatientRadioChange = (name: keyof PatientData, value: string) => {
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (patientErrors[name]) {
      setPatientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleGuardarPaciente = async () => {
    const errors = validatePatientData(patient);
    if (Object.keys(errors).length > 0) {
      setPatientErrors(errors);
      return;
    }
    if (!resolvedResponsable) return;
    setIsSubmitting(true);
    setApiError(null);
    try {
      const payload = {
        nombre: patient.name,
        especie: patient.species,
        edad: parseInt(patient.age, 10),
        color: patient.color,
        ...(patient.characteristic ? { senia: patient.characteristic } : {}),
        sexo: patient.sex as "Macho" | "Hembra",
        raza: patient.breed,
        peso: parseFloat(patient.weight.replace(",", ".")),
        esterilizado: patient.sterilized === "yes",
        tiene_microchip: patient.microchip === "yes",
        num_microchip:
          patient.microchip === "yes" ? patient.microchipNumber : undefined,
        activo: true,
        id_responsable: resolvedResponsable.id,
      };
      await api.createPatient(payload);
      setSuccessModal({
        message: "El paciente fue registrado correctamente.",
        onAccept: () => {
          setSuccessModal(null);
          navigate(ROUTES.DASHBOARD);
        },
      });
    } catch (err: any) {
      setApiError(err?.message || "Error al crear el paciente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar cancelación en step paciente: elimina el responsable solo si fue creado en esta sesión
  const handleConfirmCancelarPaciente = async () => {
    setIsCancellingPatient(true);
    if (resolvedResponsable?.isNew) {
      try {
        await api.deleteResponsable(resolvedResponsable.id);
      } catch {
        // no-op: si el delete falla igual continúa el flujo de cancelación
      }
    }
    setShowCancelPatientModal(false);
    setSuccessModal({
      message: "El registro se canceló con éxito",
      onAccept: () => {
        setSuccessModal(null);
        navigate(ROUTES.DASHBOARD);
      },
    });
    setIsCancellingPatient(false);
  };

  const handleCancelarPaciente = () => setShowCancelPatientModal(true);

  const handleCancelarResponsable = () => navigate(ROUTES.DASHBOARD);

  // ─── Render ───────────────────────────────────────────────────────────────
  const pageTitle =
    stage === "responsable" ? "Registrar responsable" : "Registrar paciente";

  const tabs: { id: ResponsableTab; label: string }[] = [
    { id: "nuevo", label: "Responsable nuevo" },
    { id: "existente", label: "Responsable existente" },
  ];

  return (
    <MainLayout>
      <DangerConfirmModal
        isOpen={showCancelPatientModal}
        question="¿Cancelar registro?"
        message={
          "¿Estás seguro de que querés cancelar el registro?\nSe perderán todos los datos ingresados."
        }
        onCancel={() => setShowCancelPatientModal(false)}
        onConfirm={handleConfirmCancelarPaciente}
        isConfirmLoading={isCancellingPatient}
      />
      <SuccessModal
        isOpen={successModal !== null}
        message={successModal?.message ?? ""}
        onAccept={() => successModal?.onAccept()}
      />
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader title={pageTitle} />

        <div className="flex flex-1 justify-center px-8 py-6">
          <div className="w-full max-w-2xl">
            {/* Error de API */}
            {apiError && (
              <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {apiError}
              </div>
            )}

            {/* ── STAGE: RESPONSABLE ──────────────────────────────────────── */}
            {stage === "responsable" && (
              <div className="flex flex-col">
                {/* Pestañas */}
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setResponsableTab(tab.id);
                        setSelectedResponsable(null);
                        setSearchQuery("");
                        setApiError(null);
                      }}
                      className={`rounded-t-lg px-6 py-2.5 text-sm transition-colors ${
                        responsableTab === tab.id
                          ? "bg-vetween-ice text-vetween-teal font-semibold border-t border-x border-border -mb-px z-10"
                          : "bg-vetween-teal text-foreground font-medium hover:bg-vetween-teal/85"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido de pestañas */}
                <div className="bg-vetween-ice rounded-b-lg rounded-tr-lg border border-border p-6 space-y-6">
                  {/* ── Pestaña: nuevo ── */}
                  {responsableTab === "nuevo" && (
                    <>
                      <ResponsibleFormFields
                        data={responsible}
                        errors={responsibleErrors}
                        onChange={handleResponsibleChange}
                      />
                      <div className="flex gap-3 pt-4 border-t border-slate-700">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={handleCancelarResponsable}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          className="flex-1"
                          isLoading={isSubmitting}
                          onClick={handleSiguienteNuevo}
                        >
                          Siguiente
                        </Button>
                      </div>
                    </>
                  )}

                  {/* ── Pestaña: existente ── */}
                  {responsableTab === "existente" && (
                    <div className="space-y-4">
                      {/* Buscador */}
                      <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o email…"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedResponsable(null);
                        }}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-vetween-teal focus:outline-none focus:ring-1 focus:ring-vetween-teal"
                      />

                      {loadingResponsables && (
                        <p className="text-sm text-muted-foreground">
                          Cargando responsables…
                        </p>
                      )}

                      {!loadingResponsables &&
                        searchQuery.trim() &&
                        filteredResponsables.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No se encontraron resultados.
                          </p>
                        )}

                      {/* Lista de resultados */}
                      {filteredResponsables.length > 0 &&
                        !selectedResponsable && (
                          <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                            {filteredResponsables.map((r) => (
                              <li key={r.id_responsable}>
                                <button
                                  className="w-full text-left px-4 py-3 text-sm hover:bg-muted/60 transition-colors"
                                  onClick={() => handleSeleccionarExistente(r)}
                                >
                                  <span className="font-semibold text-foreground">
                                    {r.nombre} {r.apellido}
                                  </span>
                                  <span className="ml-2 text-muted-foreground">
                                    {r.email}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                      {/* Ficha del responsable seleccionado */}
                      {selectedResponsable && (
                        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground text-base">
                              {selectedResponsable.nombre}{" "}
                              {selectedResponsable.apellido}
                            </h3>
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground underline"
                              onClick={() => setSelectedResponsable(null)}
                            >
                              Cambiar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <span>
                              <span className="font-medium text-foreground">
                                Email:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {selectedResponsable.email}
                              </span>
                            </span>
                            <span>
                              <span className="font-medium text-foreground">
                                Teléfono:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {selectedResponsable.telefono}
                              </span>
                            </span>
                            <span>
                              <span className="font-medium text-foreground">
                                Relación:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {selectedResponsable.relacion}
                              </span>
                            </span>
                            <span>
                              <span className="font-medium text-foreground">
                                Provincia:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {selectedResponsable.provincia}
                              </span>
                            </span>
                            <span className="col-span-2">
                              <span className="font-medium text-foreground">
                                Dirección:
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {selectedResponsable.direccion_calle}{" "}
                                {selectedResponsable.direccion_numero},{" "}
                                {selectedResponsable.direccion_localidad}
                              </span>
                            </span>
                          </div>
                          <div className="flex gap-3 pt-3 border-t border-slate-700">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={handleCancelarResponsable}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              className="flex-1"
                              onClick={handleAnadirPacienteExistente}
                            >
                              Seleccionar paciente
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Cancelar cuando no hay selección activa */}
                      {!selectedResponsable && (
                        <div className="pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleCancelarResponsable}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── STAGE: PACIENTE ─────────────────────────────────────────── */}
            {stage === "paciente" && (
              <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                <PatientFormFields
                  data={patient}
                  errors={patientErrors}
                  onChange={handlePatientChange}
                  onRadioChange={handlePatientRadioChange}
                />
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelarPaciente}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    isLoading={isSubmitting}
                    onClick={handleGuardarPaciente}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ResponsibleAndPatientRegister;
