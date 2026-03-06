import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sortArray } from "../utils/sort";
import pawIcon from "../assets/pawIcon.svg";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
import { api, ResponsibleListItem } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

interface PatientSummaryRow {
  id: string;
  nombre: string;
  responsable: string;
}

const extractPatientsArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.data)) return asRecord.data;
    if (Array.isArray(asRecord.pacientes)) return asRecord.pacientes;
  }
  return [];
};

const extractResponsablesArray = (payload: unknown): ResponsibleListItem[] => {
  if (Array.isArray(payload)) return payload as ResponsibleListItem[];
  if (payload && typeof payload === "object") {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.data)) return asRecord.data as ResponsibleListItem[];
    if (Array.isArray(asRecord.responsables)) return asRecord.responsables as ResponsibleListItem[];
  }
  return [];
};

export default function ClinicalSummaryList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rawName = user?.name || user?.email?.split("@")[0] || "usuario";
  const userDisplayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const [patients, setPatients] = useState<PatientSummaryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PatientSummaryRow; direction: "asc" | "desc" } | null>(null);

  const loadData = async () => {
    try {
      const [patientsResponse, responsablesResponse] = await Promise.all([
        api.getPatients(),
        api.getResponsables(),
      ]);

      const rows = extractPatientsArray(patientsResponse);
      const responsables = extractResponsablesArray(responsablesResponse);

      const responsablesById = new Map<string, ResponsibleListItem>();
      responsables.forEach((r) => {
        responsablesById.set(String(r.id_responsables), r);
      });

      const mapped: PatientSummaryRow[] = rows.map((item: any) => {
        const responsableId =
          item.id_responsable ?? item.id_responsables ?? item.responsable_id;
        const responsableObj =
          responsableId !== undefined && responsableId !== null
            ? responsablesById.get(String(responsableId))
            : undefined;

        const responsibleName =
          (responsableObj
            ? `${responsableObj.nombre} ${responsableObj.apellido}`.trim()
            : "") ||
          item.responsable ||
          `${item.nombre_responsable ?? ""} ${item.apellido ?? ""}`.trim();

        return {
          id: String(item.id_pacientes ?? item.id_paciente ?? item.id ?? "-"),
          nombre: item.nombre ?? item.nombre_paciente ?? "-",
          responsable: responsibleName || "-",
        };
      });

      setPatients(mapped);
      setLoadError(null);
    } catch (err: any) {
      console.error("Error al obtener resúmenes clínicos:", err.message);
      setLoadError(err?.message || "No se pudieron cargar los datos.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const filteredPatients = patients.filter((p) => {
  const q = searchQuery.toLowerCase();
  return (
    p.nombre.toLowerCase().includes(q) ||
    p.responsable.toLowerCase().includes(q) ||
    p.id.toLowerCase().includes(q)
  );
});

  const handleViewSummary = (patientId: string) => {
    navigate(`${ROUTES.CLINICAL_SUMMARY_DETAIL}/${patientId}`);
  };

const sortedPatients = sortConfig
  ? sortArray(filteredPatients, sortConfig.key, sortConfig.direction)
  : filteredPatients;

// const handleViewSummary = (patientId: string) => {
//   navigate(`${ROUTES.PATIENT}/${patientId}`);
// };

const handleSort = (key: keyof PatientSummaryRow) => {
  let direction: "asc" | "desc" = "asc";
  if (sortConfig?.key === key) {
    direction = sortConfig.direction === "asc" ? "desc" : "asc";
  }
  setSortConfig({ key, direction });
};

  return (
    <MainLayout>
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader subtitle={`Hola, ${userDisplayName}`} title="Resumen clínico" />

        <section className="flex-1 px-8 py-6" aria-label="Resúmenes clínicos">
          {loadError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <div className="mb-4">
            <SearchBar onSearch={setSearchQuery} placeholder="Buscar paciente..." />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-indigo-600 text-accent-foreground">
<th
  className="px-6 py-3 font-semibold cursor-pointer"
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
  className="px-6 py-3 font-semibold cursor-pointer"
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
  className="px-6 py-3 font-semibold cursor-pointer"
  onClick={() => handleSort("responsable")}
>
  Responsable
  {sortConfig?.key === "responsable" && (
    <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
      {sortConfig.direction === "asc" ? "↑" : "↓"}
    </span>
  )}
</th>
                  <th className="px-6 py-3 font-semibold">Ver resumen</th>
                </tr>
              </thead>
{sortedPatients.length > 0 && (
  <tbody>
    {sortedPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-t border-border text-black transition-colors hover:bg-muted/60"
                    >
                      <td className="px-6 py-3 font-medium">{patient.id}</td>
                      <td className="px-6 py-3 font-medium">{patient.nombre}</td>
                      <td className="px-6 py-3">{patient.responsable}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleViewSummary(patient.id)}
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                          Ver resumen
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
                  No hay resúmenes clínicos generados aún
                </h3>
                <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                  En esta sección tendrás acceso a todos los resúmenes clínicos
                  de tus pacientes.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </MainLayout>
  );
}
