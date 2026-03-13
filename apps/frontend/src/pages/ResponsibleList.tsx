import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addResponsibleIcon from "../assets/addResponsibleIcon.svg";
import pawRedIcon from "../assets/huella-roja.svg";
import editIcon from "../assets/edit.svg";
import { sortArray } from "../utils/sort";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
import { Modal } from "../components/common/Modal";
import { SuccessModal } from "../components/common/SuccessModal";
import { DangerConfirmModal } from "../components/common/DangerConfirmModal";
import { EditResponsibleForm } from "../components/forms/EditResponsibleForm";
import { api, ResponsibleListItem } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useEditResponsible } from "../hooks/useEditResponsible";
import { ROUTES } from "../constants/routes";
import { StatusPill } from "../components/common/StatusPill";
import {
  TableSkeleton,
  PageHeaderSkeleton,
  SearchBarSkeleton,
} from "../components/common/Skeleton";
import ErrorStateCard from "../components/common/ErrorStateCard";

interface MascotaRef {
  id: string;
  nombre: string;
  estado: string;
}

interface ResponsableRow {
  id: string;
  nombre: string;
  apellido: string;
  mascotas: MascotaRef[];
  email: string;
  telefono: string;
  estado: string;
}

const extractResponsablesArray = (payload: unknown): ResponsibleListItem[] => {
  if (Array.isArray(payload)) return payload as ResponsibleListItem[];
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if (
      asRecord.data &&
      typeof asRecord.data === "object" &&
      !Array.isArray(asRecord.data)
    ) {
      const inner = asRecord.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data as ResponsibleListItem[];
    }
    if (Array.isArray(asRecord.data))
      return asRecord.data as ResponsibleListItem[];
    if (Array.isArray(asRecord.responsables))
      return asRecord.responsables as ResponsibleListItem[];
  }
  return [];
};

const extractTotalPages = (payload: unknown): number => {
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

const extractPatientsArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
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

export default function ResponsibleList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "usuario";
  const userDisplayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const [responsables, setResponsables] = useState<ResponsableRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [activePatientCount, setActivePatientCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
  } = useEditResponsible(async () => {
    await loadData(currentPage);
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ResponsableRow;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (page = 1) => {
    setIsLoading(true);
    try {
      const [firstResponsablesResponse, firstPatientsResponse] =
        await Promise.all([api.getResponsables(page), api.getPatients(1)]);

      const rows = extractResponsablesArray(firstResponsablesResponse);
      setCurrentPage(page);
      setTotalPages(extractTotalPages(firstResponsablesResponse));

      // Fetch all patient pages to build complete mascota map
      const totalPatientPages = extractTotalPages(firstPatientsResponse);
      const extraPatientResponses = await Promise.all(
        Array.from({ length: totalPatientPages - 1 }, (_, i) =>
          api.getPatients(i + 2),
        ),
      );
      const allPatients: any[] = [
        ...extractPatientsArray(firstPatientsResponse),
        ...extraPatientResponses.flatMap((r) => extractPatientsArray(r)),
      ];

      // Contar pacientes activos
      const activePatientsCount = allPatients.filter(
        (p: any) =>
          p.estado === true ||
          p.estado === "true" ||
          p.estado === 1 ||
          p.activo === true ||
          p.activo === "true" ||
          p.activo === 1,
      ).length;
      setActivePatientCount(activePatientsCount);

      // Build map: responsable id → [{ id, nombre, estado }]
      const mascotasByResponsable = new Map<string, MascotaRef[]>();
      allPatients.forEach((p: any) => {
        const responsableId = String(
          p.id_responsable ?? p.id_responsables ?? p.responsable_id ?? "",
        );
        if (!responsableId) return;
        const petId = String(p.id_pacientes ?? p.id_paciente ?? p.id ?? "");
        const petName: string = p.nombre ?? p.nombre_paciente ?? "-";
        const petEstadoRaw = p.estado ?? p.activo;
        const petEstado =
          petEstadoRaw === true || petEstadoRaw === "true" || petEstadoRaw === 1
            ? "Activo"
            : petEstadoRaw === false ||
                petEstadoRaw === "false" ||
                petEstadoRaw === 0
              ? "Inactivo"
              : "-";
        if (!mascotasByResponsable.has(responsableId)) {
          mascotasByResponsable.set(responsableId, []);
        }
        mascotasByResponsable
          .get(responsableId)!
          .push({ id: petId, nombre: petName, estado: petEstado });
      });

      const mapped: ResponsableRow[] = rows.map((item) => {
        const rid = String(
          item.id_responsable ?? item.id_responsables ?? (item as any).id ?? "",
        );
        const mascotas = mascotasByResponsable.get(rid) ?? [];
        const estado =
          mascotas.length === 0
            ? "-"
            : mascotas.some((m) => m.estado === "Activo")
              ? "Activo"
              : "Inactivo";
        return {
          id: rid || "-",
          nombre: item.nombre ?? "-",
          apellido: item.apellido ?? "-",
          mascotas,
          email: item.email ?? "-",
          telefono: item.telefono ?? "-",
          estado,
        };
      });

      setResponsables(mapped);
      setLoadError(null);
    } catch (err: any) {
      console.error("Error al obtener responsables:", err.message);
      setLoadError(err?.message || "No se pudieron cargar los responsables.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, []);

  const filteredResponsables = responsables.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.nombre.toLowerCase().includes(q) ||
      r.apellido.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.mascotas.some((m) => m.nombre.toLowerCase().includes(q)) ||
      r.id.toLowerCase().includes(q)
    );
  });

  const sortedResponsables = sortConfig
    ? sortArray(filteredResponsables, sortConfig.key, sortConfig.direction)
    : filteredResponsables;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const showNoSearchResults =
    !isLoading &&
    !loadError &&
    filteredResponsables.length === 0 &&
    hasSearchQuery;

  const handleSort = (key: keyof ResponsableRow) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteResponsable = async () => {
    if (!deleteTargetId) return;
    try {
      setDeletingId(deleteTargetId);
      await api.deleteResponsable(deleteTargetId);
      setResponsables((prev) => prev.filter((r) => r.id !== deleteTargetId));
      setLoadError(null);
      setDeleteTargetId(null);
      setShowDeleteSuccessModal(true);
    } catch (err: any) {
      setLoadError(err?.message || "No se pudo eliminar el responsable.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddResponsible = () => {
    if (activePatientCount >= 50) {
      setShowLimitModal(true);
      return;
    }
    navigate(ROUTES.REGISTER_PATIENT);
  };

  return (
    <MainLayout>
      <section className="flex flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <PageHeaderSkeleton showSubtitle showActions />
        ) : (
          <PageHeader
            subtitle={`Hola, ${userDisplayName}`}
            title="Responsables"
            actions={
              <button
                onClick={handleAddResponsible}
                className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                  activePatientCount >= 50
                    ? "bg-[#5451FF]/40 text-white/60"
                    : "bg-[#5451FF] text-white hover:bg-[#5451FF]/85"
                }`}
              >
                <img
                  src={addResponsibleIcon}
                  alt="Paw Icon Add"
                  className="size-7"
                />
                {"Añadir responsable"}
              </button>
            }
          />
        )}

        <section
          className="flex-1 px-8 py-6"
          aria-label="Lista de responsables"
        >
          <div className="mb-4">
            {isLoading ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar por nombre"
              />
            )}
          </div>

          {loadError && !isLoading ? (
            <ErrorStateCard
              title="No pudimos cargar la lista de responsables"
              description="Hubo un error al cargar la información. Intenta nuevamente más tarde."
              actionLabel="Reintentar"
              onAction={() => loadData(currentPage)}
            />
          ) : showNoSearchResults ? (
            <ErrorStateCard
              title="No encontramos responsables con ese nombre"
              actionLabel="Volver"
              onAction={() => setSearchQuery("")}
            />
          ) : isLoading ? (
            <TableSkeleton
              rows={5}
              columns={[
                { width: "w-16", type: "text" },
                { width: "w-32", type: "text" },
                { width: "w-32", type: "text" },
                { width: "flex-1", type: "multi" },
                { width: "w-56", type: "text" },
                { width: "w-32", type: "text" },
                { width: "w-24", type: "badge" },
                { width: "w-20", type: "action" },
                { width: "w-24", type: "action" },
              ]}
              showHeader
            />
          ) : (
            <>
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
                      <th
                        className="px-6 py-3 font-semibold cursor-pointer"
                        onClick={() => handleSort("apellido")}
                      >
                        Apellido
                        {sortConfig?.key === "apellido" && (
                          <span
                            className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}
                          >
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-3 font-semibold">Mascota</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Teléfono</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                      <th className="px-6 py-3 font-semibold">Editar</th>
                      <th className="px-6 py-3 font-semibold">Eliminar</th>
                    </tr>
                  </thead>
                  {sortedResponsables.length > 0 && (
                    <tbody>
                      {sortedResponsables.map((r) => (
                        <tr
                          key={r.id}
                          className={`border-t border-border transition-colors ${
                            r.estado === "Activo"
                              ? "text-black hover:bg-muted/60"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          <td className="px-6 py-3 font-medium">{r.id}</td>
                          <td className="px-6 py-3">{r.nombre}</td>
                          <td className="px-6 py-3">{r.apellido}</td>
                          <td className="px-6 py-3">
                            {r.mascotas.length > 0
                              ? r.mascotas.map((m, i) => (
                                  <React.Fragment key={m.id}>
                                    {i > 0 && <span className="mr-1">,</span>}
                                    <button
                                      onClick={() =>
                                        navigate(`${ROUTES.PATIENT}/${m.id}`)
                                      }
                                      className={`font-semibold underline-offset-2 hover:underline ${
                                        r.estado === "Activo"
                                          ? "text-indigo-600"
                                          : "text-gray-400 hover:text-gray-600"
                                      }`}
                                    >
                                      {m.nombre}
                                    </button>
                                  </React.Fragment>
                                ))
                              : "-"}
                          </td>
                          <td className="px-6 py-3">{r.email}</td>
                          <td className="px-6 py-3">{r.telefono}</td>
                          <td className="px-6 py-3">
                            <StatusPill status={r.estado} />
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={() => openEdit(r.id)}
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
                              onClick={() => handleOpenDeleteModal(r.id)}
                              disabled={
                                deletingId === r.id || r.mascotas.length > 0
                              }
                              className={`transition-colors ${
                                r.mascotas.length > 0 || deletingId === r.id
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

                {filteredResponsables.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <h3 className="text-lg font-semibold text-foreground">
                      No hay responsables registrados aún
                    </h3>
                    <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                      Los responsables asociados a tus pacientes aparecerán
                      aquí.
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-4">
                  <button
                    onClick={() => loadData(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => loadData(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </section>
      <SuccessModal
        isOpen={showSuccessModal}
        message="Los datos se actualizaron correctamente"
        onAccept={closeSuccessModal}
      />
      <SuccessModal
        isOpen={showLimitModal}
        message="Alcanzaste el límite de 50 pacientes registrados"
        onAccept={() => setShowLimitModal(false)}
        icon={pawRedIcon}
      />
      <SuccessModal
        isOpen={showDeleteSuccessModal}
        message="El responsable se eliminó con éxito"
        onAccept={() => setShowDeleteSuccessModal(false)}
      />
      <DangerConfirmModal
        isOpen={deleteTargetId !== null}
        question="¿Estás seguro de que querés eliminar este responsable?"
        message="Este responsable no registra mascotas asociadas. Podrás eliminarlo definitivamente."
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteResponsable}
        isConfirmLoading={deletingId !== null}
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEdit}
        title="Editar responsable"
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
          <EditResponsibleForm
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
