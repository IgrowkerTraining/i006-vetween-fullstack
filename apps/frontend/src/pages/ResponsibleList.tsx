import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import addResponsibleIcon from "../assets/addResponsibleIcon.svg";
import { sortArray } from "../utils/sort";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
import { Modal } from "../components/common/Modal";
import { EditResponsibleForm } from "../components/forms/EditResponsibleForm";
import { api, ResponsibleListItem } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useEditResponsible } from "../hooks/useEditResponsible";
import { ROUTES } from "../constants/routes";

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
    if (Array.isArray(asRecord.data)) return asRecord.data as ResponsibleListItem[];
    if (Array.isArray(asRecord.responsables)) return asRecord.responsables as ResponsibleListItem[];
  }
  return [];
};

const extractTotalPages = (payload: unknown): number => {
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    const inner =
      asRecord.data && typeof asRecord.data === "object" && !Array.isArray(asRecord.data)
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

  const {
    isEditModalOpen,
    isEditFormLoading,
    editApiError,
    editInitialData,
    openEdit,
    closeEdit,
    submitEdit,
  } = useEditResponsible(async () => { await loadData(currentPage); });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ResponsableRow;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (page = 1) => {
    try {
      const [firstResponsablesResponse, firstPatientsResponse] = await Promise.all([
        api.getResponsables(page),
        api.getPatients(1),
      ]);

      const rows = extractResponsablesArray(firstResponsablesResponse);
      setCurrentPage(page);
      setTotalPages(extractTotalPages(firstResponsablesResponse));

      // Fetch all patient pages to build complete mascota map
      const totalPatientPages = extractTotalPages(firstPatientsResponse);
      const extraPatientResponses = await Promise.all(
        Array.from({ length: totalPatientPages - 1 }, (_, i) => api.getPatients(i + 2)),
      );
      const allPatients: any[] = [
        ...extractPatientsArray(firstPatientsResponse),
        ...extraPatientResponses.flatMap((r) => extractPatientsArray(r)),
      ];

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
            : petEstadoRaw === false || petEstadoRaw === "false" || petEstadoRaw === 0
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
        const estado = mascotas.length === 0
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

  const handleSort = (key: keyof ResponsableRow) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteResponsable = async (id: string) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este responsable?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await api.deleteResponsable(id);
      setResponsables((prev) => prev.filter((r) => r.id !== id));
      setLoadError(null);
    } catch (err: any) {
      setLoadError(err?.message || "No se pudo eliminar el responsable.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddResponsible = () => navigate(ROUTES.REGISTER_PATIENT);

  return (
    <MainLayout>
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader
          subtitle={`Hola, ${userDisplayName}`}
          title="Responsables"
          actions={
            <button
              onClick={handleAddResponsible}
              className="flex items-center gap-2 rounded-lg bg-[#5451FF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5451FF]/85"
            >
              <img src={addResponsibleIcon} alt="Paw Icon Add" className="size-7" />
              {"Añadir responsable"}
            </button>
          }
        />

        <section
          className="flex-1 px-8 py-6"
          aria-label="Lista de responsables"
        >
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <div className="mb-4">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Buscar por nombre"
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
                      className="border-t border-border text-black transition-colors hover:bg-muted/60"
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
                                  className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
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
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            r.estado === "Activo"
                              ? "bg-emerald-100 text-emerald-700"
                              : r.estado === "Inactivo"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => openEdit(r.id)}
                          className="text-sm font-medium text-vetween-blue transition-colors hover:text-vetween-indigo"
                        >
                          Editar
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteResponsable(r.id)}
                          disabled={deletingId === r.id}
                          className="text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === r.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {filteredResponsables.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-semibold text-foreground">
                  No hay responsables registrados aún
                </h3>
                <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                  Los responsables asociados a tus pacientes aparecerán aquí.
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
        </section>
      </section>
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
