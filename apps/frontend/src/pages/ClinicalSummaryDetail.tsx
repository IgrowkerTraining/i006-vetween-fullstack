import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { ClinicalSummarySkeleton } from "../components/common/Skeleton";
import ErrorStateCard from "../components/common/ErrorStateCard";
import { ROUTES } from "../constants/routes";

// ---------------------------------------------------------------------------
// Types matching the API response
// ---------------------------------------------------------------------------
interface SintesisVisita {
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
}

interface HistorialVacunaItem {
  nombre: string;
  fecha_aplicacion: string;
  estado: string;
}

interface ResumenEstructurado {
  estado_general: string;
  tipo_paciente: string;
  sintesis_visitas: SintesisVisita[];
  historial_vacunas: HistorialVacunaItem[];
  descripcion_clinica: string;
  tratamiento_indicado: string;
  factores_riesgo: string[];
  puntos_clave_proximas_consultas: string[];
}

interface ClinicalSummaryApiItem {
  id_resumenia: string;
  id_paciente: number;
  resumen_completo: string;
  resumen_estructurado: ResumenEstructurado;
  fecha_generacion: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ClinicalSummaryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "usuario";
  const userDisplayName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const [summary, setSummary] = useState<ClinicalSummaryApiItem | null>(null);
  const [patientName, setPatientName] = useState<string>("-");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [summaries, patientData] = await Promise.all([
          api.getClinicalSummaryByPatientId(id),
          api.getPatientById(id),
        ]);
        if (summaries.length > 0) setSummary(summaries[0]);
        setPatientName(
          patientData?.nombre ?? patientData?.nombre_paciente ?? "-",
        );
      } catch (err: any) {
        console.error("Error al obtener resumen clínico:", err.message);
        setFetchError(err?.message || "No se pudo cargar el resumen clínico.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleDownload = () => {
    // TODO: connect to PDF generation / download endpoint
    console.log("Descargar informe para paciente:", id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <ClinicalSummarySkeleton />
      </MainLayout>
    );
  }

  if (fetchError || !summary) {
    return (
      <MainLayout>
        <div className="px-8 py-8">
          <ErrorStateCard
            title="Error al cargar resumen clínico"
            description="Hubo un error al cargar la información."
            actionLabel="Volver a Pacientes"
            actionVariant="back"
            onAction={() => navigate(ROUTES.DASHBOARD)}
          />
        </div>
      </MainLayout>
    );
  }

  const e = summary.resumen_estructurado;

  return (
    <MainLayout>
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader
          subtitle={`Hola, ${userDisplayName}`}
          title="Resumen clínico (IA)"
          showBackButton
          actions={
            <button
              onClick={handleDownload}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Descargar informe
            </button>
          }
        />

        <section className="flex-1 px-8 py-6">
          {/* Patient name tab */}
          <div className="mb-4 inline-block rounded-t-lg bg-vetween-teal px-6 py-2 text-sm font-semibold text-white">
            {patientName}
          </div>

          <div className="rounded-b-xl rounded-tr-xl border border-border bg-card p-6 shadow-sm">
            {/* Top: image placeholder + status tags + narrative */}
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="shrink-0">
                <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-muted text-4xl">
                  🐾
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
                    Estado general: {e.estado_general?.toLowerCase() ?? "-"}
                  </span>
                  <span className="rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700">
                    Tipo de paciente: {e.tipo_paciente?.toLowerCase() ?? "-"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                {summary.resumen_completo
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p
                      key={i}
                      className="mb-3 text-sm leading-relaxed text-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>

            <hr className="my-6 border-border" />

            {/* Descripción clínica */}
            {e.descripcion_clinica && (
              <div className="mb-4">
                <p className="mb-1 text-sm font-semibold text-foreground">
                  Descripción clínica
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {e.descripcion_clinica}
                </p>
              </div>
            )}

            {/* Tratamiento indicado */}
            {e.tratamiento_indicado && (
              <div className="mb-4">
                <p className="mb-1 text-sm font-semibold text-foreground">
                  Tratamiento indicado
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {e.tratamiento_indicado}
                </p>
              </div>
            )}

            {/* Síntesis de visitas */}
            {e.sintesis_visitas?.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Síntesis de visitas
                </p>
                <div className="space-y-2">
                  {e.sintesis_visitas.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm"
                    >
                      <p className="font-medium text-foreground">
                        {v.fecha} — {v.motivo}
                      </p>
                      {v.diagnostico && (
                        <p className="mt-0.5 text-muted-foreground">
                          Diagnóstico: {v.diagnostico}
                        </p>
                      )}
                      {v.tratamiento && (
                        <p className="text-muted-foreground">
                          Tratamiento: {v.tratamiento}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Historial de vacunas */}
            {e.historial_vacunas?.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Historial de vacunas
                </p>
                <div className="space-y-2">
                  {e.historial_vacunas.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm"
                    >
                      <p className="font-medium text-foreground">{v.nombre}</p>
                      <p className="text-muted-foreground">
                        {v.fecha_aplicacion} — Estado: {v.estado}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Factores de riesgo */}
            {e.factores_riesgo?.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-foreground">
                  Factores de riesgo
                </p>
                <ul className="space-y-1">
                  {e.factores_riesgo.map((factor, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-0.5 text-amber-500">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <hr className="my-6 border-border" />

            {/* Puntos clave */}
            {e.puntos_clave_proximas_consultas?.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Puntos clave para las próximas consultas:
                </p>
                <ul className="space-y-1.5">
                  {e.puntos_clave_proximas_consultas.map((punto, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-0.5 text-indigo-600">•</span>
                      {punto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </section>
    </MainLayout>
  );
}
