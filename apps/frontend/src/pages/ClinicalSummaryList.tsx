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
import {
  TableSkeleton,
  PageHeaderSkeleton,
  SearchBarSkeleton,
} from "../components/common/Skeleton";
import ErrorStateCard from "../components/common/ErrorStateCard";

interface PatientSummaryRow {
  id: string;
  nombre: string;
  responsable: string;
}

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

export default function ClinicalSummaryList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "usuario";
  const userDisplayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const [patients, setPatients] = useState<PatientSummaryRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PatientSummaryRow;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (page = 1) => {
    setIsLoading(true);
    try {
      const [patientsResponse, firstResponsablesResponse] = await Promise.all([
        api.getPatients(page),
        api.getResponsables(1),
      ]);

      const rows = extractPatientsArray(patientsResponse);
      setCurrentPage(page);
      setTotalPages(extractTotalPages(patientsResponse));

      // Fetch all responsable pages to build complete name map
      const totalResponsablePages = extractTotalPages(
        firstResponsablesResponse,
      );
      const extraResponsablesResponses = await Promise.all(
        Array.from({ length: totalResponsablePages - 1 }, (_, i) =>
          api.getResponsables(i + 2),
        ),
      );
      const allResponsables: ResponsibleListItem[] = [
        ...extractResponsablesArray(firstResponsablesResponse),
        ...extraResponsablesResponses.flatMap((r) =>
          extractResponsablesArray(r),
        ),
      ];

      const responsablesById = new Map<string, ResponsibleListItem>();
      allResponsables.forEach((r) => {
        const rid = r.id_responsable ?? r.id_responsables ?? (r as any).id;
        if (rid !== undefined && rid !== null) {
          responsablesById.set(String(rid), r);
        }
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
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

  const handlePatientClick = (patientId: string) => {
    navigate(`${ROUTES.PATIENT}/${patientId}`);
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
        {isLoading ? (
          <PageHeaderSkeleton showSubtitle={false} showActions={false} />
        ) : (
          <PageHeader
            subtitle={`Hola, ${userDisplayName}`}
            title="Resumen clínico"
          />
        )}

        <section className="flex-1 px-8 py-6" aria-label="Resúmenes clínicos">
          <div className="mb-4">
            {isLoading ? (
              <SearchBarSkeleton />
            ) : (
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar resumen clínico"
              />
            )}
          </div>

          {loadError && !isLoading ? (
            <ErrorStateCard
              title="No pudimos cargar la lista de resumenes clínicos"
              description="Hubo un error al cargar la información. Intenta nuevamente más tarde."
              actionLabel="Reintentar"
              onAction={() => loadData(currentPage)}
            />
          ) : isLoading ? (
            <TableSkeleton
              rows={5}
              columns={[
                { width: "w-16", type: "text" },
                { width: "w-32", type: "text" },
                { width: "flex-1", type: "text" },
                { width: "w-32", type: "action" },
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
                          <td className="px-6 py-3 font-medium">
                            {patient.id}
                          </td>
                          <td className="px-6 py-3 font-medium">
                            <button
                              onClick={() => handlePatientClick(patient.id)}
                              className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                            >
                              {patient.nombre}
                            </button>
                          </td>
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
                      En esta sección tendrás acceso a todos los resúmenes
                      clínicos de tus pacientes.
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
    </MainLayout>
  );
}
