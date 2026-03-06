import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pawIcon from "../assets/pawIcon.svg";
import pawIconPlus from "../assets/pawIconPlus.svg";
import MainLayout from "../components/layout/MainLayout";
import PageHeader from "../components/common/PageHeader";
import { SearchBar } from "../components/common/SearchBar";
// import { PatientForm, PatientFormData } from "../components/patient/PatientForm";
import { api, ResponsibleListItem } from "../services/api";
import { sortArray } from "../utils/sort";
import { useAuth } from "../hooks/useAuth";
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [patientsError, setPatientsError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: "asc" | "desc" } | null>(null);

  const handlePatientClick = (patientId: string) => {
    navigate(`${ROUTES.PATIENT}/${patientId}`);
  };

  const rawName = user?.nombre || user?.name || user?.email?.split("@")[0] || "usuario";
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
      if (Array.isArray(asRecord.data)) return asRecord.data;
      if (Array.isArray(asRecord.pacientes)) return asRecord.pacientes;
    }
    return [];
  };

  const extractResponsablesArray = (
    payload: unknown,
  ): ResponsibleListItem[] => {
    if (Array.isArray(payload)) return payload as ResponsibleListItem[];
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      if (Array.isArray(asRecord.data))
        return asRecord.data as ResponsibleListItem[];
      if (Array.isArray(asRecord.responsables))
        return asRecord.responsables as ResponsibleListItem[];
    }
    return [];
  };

  const loadPatients = async () => {
    try {
      const [patientsResponse, responsablesResponse] = await Promise.all([
        api.getPatients(),
        api.getResponsables(),
      ]);

      const rows = extractPatientsArray(patientsResponse);
      const responsables = extractResponsablesArray(responsablesResponse);

      const responsablesById = new Map<string, ResponsibleListItem>();
      responsables.forEach((responsable) => {
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
    loadPatients();
  }, []);

  const handleDeletePatient = async (patientId: string) => {
    const confirmed = window.confirm("¿Seguro que deseas eliminar este paciente?");
    if (!confirmed) return;

    try {
      setDeletingId(patientId);
      await api.deletePatient(patientId);
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
      setPatientsError(null);
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


  // const handleFormSubmit = async (data: PatientFormData) => {
  //   setIsFormLoading(true)
  //   try {
  //     const hasMicrochip = data.patient.microchip === "yes"
  //     await api.createPatient({
  //       nombre_paciente: data.patient.name,
  //       especie: data.patient.species,
  //       edad: parseInt(data.patient.age, 10) || 0,
  //       color: data.patient.color,
  //       senia: data.patient.characteristic,
  //       sexo: data.patient.sex === "Hembra" ? "Hembra" : "Macho",
  //       raza: data.patient.breed,
  //       peso: parseFloat(data.patient.weight) || 0,
  //       esterilizado: data.patient.sterilized === "yes",
  //       tiene_microchip: hasMicrochip,
  //       ...(hasMicrochip
  //         ? { num_microchip: data.patient.microchipNumber.trim() }
  //         : {}),
  //       activo: true,
  //       nombre_responsable: data.responsible.firstName,
  //       apellido: data.responsible.lastName,
  //       email: data.responsible.email,
  //       telefono: data.responsible.phone,
  //       direccion_calle: data.responsible.street,
  //       direccion_numero: data.responsible.number,
  //       direccion_localidad: data.responsible.locality,
  //       provincia: data.responsible.province,
  //       relacion: data.responsible.relationship,
  //     })
  //     await loadPatients()
  //     setIsModalOpen(false)
  //   } catch (err: any) {
  //     console.error("Error al crear paciente:", err.message)
  //   } finally {
  //     setIsFormLoading(false)
  //   }
  // }

  return (
    <MainLayout>
      {/* Main content */}
      <section className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader
          subtitle={`Hola, ${userDisplayName}`}
          title="Pacientes"
        />

        <section className="flex-1 px-8 py-6" aria-label="Lista de pacientes">
          {patientsError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {patientsError}
            </div>
          )}
          <div className="mb-4">
            <SearchBar onSearch={setSearchQuery} placeholder="Buscar paciente..." />
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#7ACBD9] text-black font-semibold">
                  <th className="px-6 py-3 font-semibold cursor-pointer" onClick={() => handleSort("id")}>
                    ID
                    {sortConfig?.key === "id" && (
                      <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 font-semibold cursor-pointer" onClick={() => handleSort("nombre")}>
                    Nombre
                    {sortConfig?.key === "nombre" && (
                      <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 font-semibold">Especie</th>
                  <th className="px-6 py-3 font-semibold cursor-pointer" onClick={() => handleSort("responsable")}>
                    Responsable
                    {sortConfig?.key === "responsable" && (
                      <span className={`ml-1 ${sortConfig.direction === "asc" ? "text-blue-400" : "text-gray-400"}`}>
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
                    <tr key={patient.id} className="text-black border-t border-border transition-colors hover:bg-muted/60">
                      <td className="px-6 py-3 font-medium">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                        >
                          {patient.id}
                        </button>
                      </td>
                      <td className="px-6 py-3 font-medium">
                        <button
                          onClick={() => handlePatientClick(patient.id)}
                          className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
                        >
                          {patient.nombre}
                        </button>
                      </td>
                      <td className="px-6 py-3">{patient.especie}</td>
                      <td className="px-6 py-3">{patient.responsable}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            patient.estado === "Activo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {patient.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-sm font-medium text-vetween-blue transition-colors hover:text-vetween-indigo">
                          Editar
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          disabled={deletingId === patient.id}
                          className="text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === patient.id ? "Eliminando..." : "Eliminar"}
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
                No hay pacientes registrados aun
              </h3>
              <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
                {"Agrega uno nuevo haciendo click en el boton superior."}
              </p>
            </div>
          )}
        </div>
        </section>
      </section>
    </MainLayout>
  );
}
