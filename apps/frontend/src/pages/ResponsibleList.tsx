import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sortArray } from "../utils/sort";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
import { api, ResponsibleListItem } from "../services/api";
import { ROUTES } from "../constants/routes";

interface MascotaRef {
  id: string;
  nombre: string;
}

interface ResponsableRow {
  id: string;
  nombre: string;
  apellido: string;
  mascotas: MascotaRef[];
  email: string;
  telefono: string;
}

const extractResponsablesArray = (payload: unknown): ResponsibleListItem[] => {
  if (Array.isArray(payload)) return payload as ResponsibleListItem[];
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.data)) return asRecord.data as ResponsibleListItem[];
    if (Array.isArray(asRecord.responsables)) return asRecord.responsables as ResponsibleListItem[];
  }
  return [];
};

const extractPatientsArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.data)) return asRecord.data;
    if (Array.isArray(asRecord.pacientes)) return asRecord.pacientes;
  }
  return [];
};

export default function ResponsibleList() {
  const navigate = useNavigate();
const [responsables, setResponsables] = useState<ResponsableRow[]>([]);
const [searchQuery, setSearchQuery] = useState("");
const [loadError, setLoadError] = useState<string | null>(null);
const [sortConfig, setSortConfig] = useState<{ key: keyof ResponsableRow; direction: "asc" | "desc" } | null>(null);

  const loadData = async () => {
    try {
      const [responsablesResponse, patientsResponse] = await Promise.all([
        api.getResponsables(),
        api.getPatients(),
      ]);

      const rows = extractResponsablesArray(responsablesResponse);
      const patients = extractPatientsArray(patientsResponse);

      // Build map: responsable id → [{ id, nombre }]
      const mascotasByResponsable = new Map<string, MascotaRef[]>();
      patients.forEach((p: any) => {
        const responsableId = String(
          p.id_responsable ?? p.id_responsables ?? p.responsable_id ?? ""
        );
        if (!responsableId) return;
        const petId = String(p.id_pacientes ?? p.id_paciente ?? p.id ?? "");
        const petName: string = p.nombre ?? p.nombre_paciente ?? "-";
        if (!mascotasByResponsable.has(responsableId)) {
          mascotasByResponsable.set(responsableId, []);
        }
        mascotasByResponsable.get(responsableId)!.push({ id: petId, nombre: petName });
      });

      const mapped: ResponsableRow[] = rows.map((item) => {
        const rid = String(item.id_responsables ?? "");
        const mascotas = mascotasByResponsable.get(rid) ?? [];
        return {
          id: rid || "-",
          nombre: item.nombre ?? "-",
          apellido: item.apellido ?? "-",
          mascotas,
          email: item.email ?? "-",
          telefono: item.telefono ?? "-",
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
    loadData();
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

  return (
    <MainLayout>
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader subtitle="Hola" title="Responsables" />

        <section className="flex-1 px-8 py-6" aria-label="Lista de responsables">
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <div className="mb-4">
            <SearchBar onSearch={setSearchQuery} placeholder="Buscar por nombre" />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-indigo-600 text-white font-semibold">
<th
  className="px-6 py-3 cursor-pointer"
  onClick={() => handleSort("id")}
>
  ID
  {sortConfig?.key === "id" && (
    <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  )}
</th>
<th
  className="px-6 py-3 cursor-pointer"
  onClick={() => handleSort("nombre")}
>
  Nombre
  {sortConfig?.key === "nombre" && (
    <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  )}
</th>
<th
  className="px-6 py-3 cursor-pointer"
  onClick={() => handleSort("apellido")}
>
  Apellido
  {sortConfig?.key === "apellido" && (
    <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  )}
</th>
                  <th className="px-6 py-3">Mascota</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Teléfono</th>
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
                                  onClick={() => navigate(`${ROUTES.PATIENT}/${m.id}`)}
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
        </section>
      </section>
    </MainLayout>
  );
}
