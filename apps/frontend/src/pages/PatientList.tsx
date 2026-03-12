import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pawIcon from "../assets/pawIcon.svg";
import editIcon from "../assets/edit.svg";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
import { Modal } from "../components/common/Modal";
import { SuccessModal } from "../components/common/SuccessModal";
import { DangerConfirmModal } from "../components/common/DangerConfirmModal";
import { EditPatientForm } from "../components/forms/EditPatientForm";
import { api, ResponsibleListItem } from "../services/api";
import { StatusPill } from "../components/common/StatusPill";
import { sortArray } from "../utils/sort";
import { useAuth } from "../hooks/useAuth";
import { useEditPatient } from "../hooks/useEditPatient";
import { ROUTES } from "../constants/routes";

export interface Patient {
  id: string;
  nombre: string;
  especie: string;
  responsable: string;
  estado: string;
}

export default function PatientList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [patientsError, setPatientsError] = useState<string | null>(null);
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
  } = useEditPatient(async () => {
    await loadPatients();
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Patient;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePatientClick = (patientId: string) => {
    navigate(`${ROUTES.PATIENT}/${patientId}`);
  };

  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "usuario";
  const userDisplayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const mapStateLabel = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (normalized === "true" || normalized === "activo") return "Activo";
      if (normalized === "false" || normalized === "inactivo")
        return "Inactivo";
    }
    return "Inactivo";
  };

  const extractPatientsArray = (payload: unknown): any[] => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      // Handle double-nested paginated response: { data: { data: [...], total, pagina, ultimaPagina } }
      if (
        asRecord.data &&
        typeof asRecord.data === "object" &&
        !Array.isArray(asRecord.data)
      ) {
        const inner = asRecord.data as Record<string, unknown>;
        if (Array.isArray(inner.data)) return inner.data;
      }
      if (Array.isArray(asRecord.data)) return asRecord.data;
      if (Array.isArray(asRecord.pacientes)) return asRecord.pacientes;
    }
    return [];
  };

  const extractPaginationMeta = (
    payload: unknown,
  ): { total: number; ultimaPagina: number; pagina: number } | null => {
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      const inner =
        asRecord.data &&
        typeof asRecord.data === "object" &&
        !Array.isArray(asRecord.data)
          ? (asRecord.data as Record<string, unknown>)
          : asRecord;
      if (
        typeof inner.ultimaPagina === "number" &&
        typeof inner.total === "number"
      ) {
        return {
          total: inner.total,
          ultimaPagina: inner.ultimaPagina,
          pagina: typeof inner.pagina === "number" ? inner.pagina : 1,
        };
      }
    }
    return null;
  };

  const extractResponsablesArray = (
    payload: unknown,
  ): ResponsibleListItem[] => {
    if (Array.isArray(payload)) return payload as ResponsibleListItem[];
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      // Handle double-nested paginated response: { data: { data: [...] } }
      if (
        asRecord.data &&
        typeof asRecord.data === "object" &&
        !Array.isArray(asRecord.data)
      ) {
        const inner = asRecord.data as Record<string, unknown>;
        if (Array.isArray(inner.data))
          return inner.data as ResponsibleListItem[];
      }
      if (Array.isArray(asRecord.data))
        return asRecord.data as ResponsibleListItem[];
      if (Array.isArray(asRecord.responsables))
        return asRecord.responsables as ResponsibleListItem[];
    }
    return [];
  };

  const extractResponsablesTotalPages = (payload: unknown): number => {
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      const inner =
        asRecord.data &&
        typeof asRecord.data === "object" &&
        !Array.isArray(asRecord.data)
          ? (asRecord.data as Record<string, unknown>)
          : asRecord;
      if (typeof inner.ultimaPagina === "number") return inner.ultimaPagina;
    }
    return 1;
  };

  const loadPatients = async (page = 1) => {
    try {
      const [patientsResponse, firstResponsablesResponse] = await Promise.all([
        api.getPatients(page),
        api.getResponsables(1),
      ]);

      const rows = extractPatientsArray(patientsResponse);
      const meta = extractPaginationMeta(patientsResponse);
      if (meta) {
        setCurrentPage(page);
        setTotalPages(meta.ultimaPagina);
      }

      // Fetch remaining responsable pages in parallel so the map is complete
      const totalResponsablePages = extractResponsablesTotalPages(
        firstResponsablesResponse,
      );
      const remainingPages = Array.from(
        { length: totalResponsablePages - 1 },
        (_, i) => api.getResponsables(i + 2),
      );
      const extraResponsablesResponses = await Promise.all(remainingPages);
      const allResponsables: ResponsibleListItem[] = [
        ...extractResponsablesArray(firstResponsablesResponse),
        ...extraResponsablesResponses.flatMap((r) =>
          extractResponsablesArray(r),
        ),
      ];

      const responsablesById = new Map<string, ResponsibleListItem>();
      allResponsables.forEach((responsable) => {
        const rid =
          responsable.id_responsable ??
          responsable.id_responsables ??
          (responsable as any).id;
        if (rid !== undefined && rid !== null && String(rid).length > 0) {
          responsablesById.set(String(rid), responsable);
        }
      });

      const mapped: Patient[] = rows.map((item: any) => {
        const responsableId =
          item.id_responsable ?? item.id_responsables ?? item.responsable_id;
        const responsableById =
          responsableId !== undefined && responsableId !== null
            ? responsablesById.get(String(responsableId))
            : undefined;

        const responsibleName =
          (responsableById
            ? `${responsableById.nombre} ${responsableById.apellido}`.trim()
            : "") ||
          item.responsable ||
          `${item.nombre_responsable ?? item.nombreResponsable ?? ""} ${item.apellido_responsable ?? item.apellidoResponsable ?? item.apellido ?? ""}`.trim();

        return {
          id: String(item.id_pacientes ?? item.id_paciente ?? item.id ?? "-"),
          nombre: item.nombre ?? item.nombre_paciente ?? "-",
          especie: item.especie ?? "-",
          responsable: responsibleName || "-",
          estado: mapStateLabel(item.estado ?? item.activo),
        };
      });

      setPatients(mapped);
      setPatientsError(null);
    } catch (err: any) {
      console.error("Error al obtener pacientes:", err.message);
      setPatientsError(err?.message || "No se pudieron cargar los pacientes.");
    }
  };

  useEffect(() => {
    loadPatients(1);
  }, []);

  const handleOpenDeleteModal = (patientId: string) => {
    setDeleteTargetId(patientId);
  };

  const handleDeletePatient = async () => {
    if (!deleteTargetId) return;
    try {
      setDeletingId(deleteTargetId);
      await api.deletePatient(deleteTargetId);
      setPatients((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setPatientsError(null);
      setDeleteTargetId(null);
      setShowDeleteSuccessModal(true);
    } catch (err: any) {
      console.error("Error al eliminar paciente:", err.message);
      setPatientsError(err?.message || "No se pudo eliminar el paciente.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.responsable.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  const sortedPatients = sortConfig
    ? sortArray(filteredPatients, sortConfig.key, sortConfig.direction)
    : filteredPatients;

  const handleSort = (key: keyof Patient) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <MainLayout>
      {/* Main content */}
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader subtitle={`Hola, ${userDisplayName}`} title="Pacientes" />

        <section className="flex-1 px-8 py-6" aria-label="Lista de pacientes">
          {patientsError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {patientsError}
            </div>
          )}
          <div className="mb-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar paciente"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#7ACBD9] text-black font-semibold">
                  <th
                    className="px-6 py-3 font-semibold cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    {sortConfig?.key === "id" && (
                      <span
                        className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}
                      >
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 font-semibold cursor-pointer"
                    onClick={() => handleSort("nombre")}
                  >
                    Nombre
                    {sortConfig?.key === "nombre" && (
                      <span
                        className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}
                      >
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 font-semibold">Especie</th>
                  <th
                    className="px-6 py-3 font-semibold cursor-pointer"
                    onClick={() => handleSort("responsable")}
                  >
                    Responsable
                    {sortConfig?.key === "responsable" && (
                      <span
                        className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}
                      >
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Editar</th>
                  <th className="px-6 py-3 font-semibold">Eliminar</th>
                </tr>
              </thead>
              {sortedPatients.length > 0 && (
                <tbody>
                  {sortedPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className={`border-t border-border transition-colors ${
                        patient.estado === "Activo"
                          ? "text-black hover:bg-muted/60"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      <td className="px-6 py-3 font-medium">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className={`font-semibold underline-offset-2 hover:underline ${
                            patient.estado === "Activo"
                              ? "text-indigo-600"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {patient.id}
                        </button>
                      </td>
                      <td className="px-6 py-3 font-medium">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className={`font-semibold underline-offset-2 hover:underline ${
                            patient.estado === "Activo"
                              ? "text-indigo-600"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {patient.nombre}
                        </button>
                      </td>
                      <td className="px-6 py-3">{patient.especie}</td>
                      <td className="px-6 py-3">{patient.responsable}</td>
                      <td className="px-6 py-3">
                        <StatusPill status={patient.estado} />
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => openEdit(patient.id)}
                          className="transition-opacity hover:opacity-70"
                        >
                          <img
                            src={editIcon}
                            alt="Editar"
                            className="h-5 w-5"
                          />
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleOpenDeleteModal(patient.id)}
                          disabled={
                            deletingId === patient.id ||
                            patient.estado === "Activo"
                          }
                          className={`transition-colors ${
                            patient.estado === "Activo" ||
                            deletingId === patient.id
                              ? "cursor-not-allowed text-red-300"
                              : "text-red-500 hover:text-red-700"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zm2-4h2V8H9zm4 0h2V8h-2z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {filteredPatients.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <img src={pawIcon} alt="paw icon" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No hay pacientes registrados aún
                </h3>
                <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                  {"Agrega uno nuevo haciendo clic en el botón superior."}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              <button
                onClick={() => loadPatients(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => loadPatients(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          )}
        </section>
      </section>
      <SuccessModal
        isOpen={showSuccessModal}
        message="Los datos se actualizaron correctamente"
        onAccept={closeSuccessModal}
      />
      <SuccessModal
        isOpen={showDeleteSuccessModal}
        message="El paciente se eliminó con éxito"
        onAccept={() => setShowDeleteSuccessModal(false)}
      />
      <DangerConfirmModal
        isOpen={deleteTargetId !== null}
        question="¿Estás seguro de que querés eliminar este paciente?"
        message="Este paciente está inactivo. Podrás eliminarlo definitivamente."
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDeletePatient}
        isConfirmLoading={deletingId !== null}
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
    </MainLayout>
  );
}
