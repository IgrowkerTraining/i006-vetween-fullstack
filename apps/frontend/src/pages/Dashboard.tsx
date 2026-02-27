import React, { useEffect, useState } from "react";
import pawIcon from "../assets/pawIcon.svg";
import pawIconPlus from "../assets/pawIconPlus.svg";
import Sidebar from "../components/layout/Sidebar";
import { Modal } from "../components/common/Modal";
import { PatientForm, PatientFormData } from "../components/forms/PatientForm";
import { api, ResponsibleListItem } from "../services/api";
import { useAuth } from "../hooks/useAuth";

export interface Patient {
  id: string
  nombre: string
  especie: string
  responsable: string
  
  estado: string
}

export default function Dashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const [modalStep, setModalStep] = useState(1)
  const [patientsError, setPatientsError] = useState<string | null>(null)

  const userDisplayName =
    user?.name ||
    (user as any)?.nombre ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "usuario";

  const mapStateLabel = (value: unknown): string => {
    if (typeof value === "boolean") return value ? "Activo" : "Inactivo";
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (normalized === "true" || normalized === "activo") return "Activo";
      if (normalized === "false" || normalized === "inactivo") return "Inactivo";
    }
    return "Inactivo";
  }

  const extractPatientsArray = (payload: unknown): any[] => {
    if (Array.isArray(payload)) return payload;
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      if (Array.isArray(asRecord.data)) return asRecord.data;
      if (Array.isArray(asRecord.pacientes)) return asRecord.pacientes;
    }
    return [];
  }

  const extractResponsablesArray = (payload: unknown): ResponsibleListItem[] => {
    if (Array.isArray(payload)) return payload as ResponsibleListItem[];
    if (payload && typeof payload === "object") {
      const asRecord = payload as Record<string, unknown>;
      if (Array.isArray(asRecord.data)) return asRecord.data as ResponsibleListItem[];
      if (Array.isArray(asRecord.responsables)) return asRecord.responsables as ResponsibleListItem[];
    }
    return [];
  }

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
        responsablesById.set(String(responsable.id_responsables), responsable);
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
          `${item.nombre_responsable ?? ""} ${item.apellido ?? ""}`.trim();

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
  }

  useEffect(() => {
    loadPatients();
  }, [])

  const handleAddPatient = () => setIsModalOpen(true)

  const handleFormSubmit = async (data: PatientFormData) => {
    setIsFormLoading(true)
    try {
      const hasMicrochip = data.patient.microchip === "yes"
      await api.createPatient({
        nombre_paciente: data.patient.name,
        especie: data.patient.species,
        edad: parseInt(data.patient.age, 10) || 0,
        color: data.patient.color,
        senia: data.patient.characteristic,
        sexo: data.patient.sex === "Hembra" ? "Hembra" : "Macho",
        raza: data.patient.breed,
        peso: parseFloat(data.patient.weight) || 0,
        esterilizado: data.patient.sterilized === "yes",
        tiene_microchip: hasMicrochip,
        ...(hasMicrochip
          ? { num_microchip: data.patient.microchipNumber.trim() }
          : {}),
        activo: true,
        nombre_responsable: data.responsible.firstName,
        apellido: data.responsible.lastName,
        email: data.responsible.email,
        telefono: data.responsible.phone,
        direccion_calle: data.responsible.street,
        direccion_numero: data.responsible.number,
        direccion_localidad: data.responsible.locality,
        provincia: data.responsible.province,
        relacion: data.responsible.relationship,
      })
      await loadPatients()
      setIsModalOpen(false)
    } catch (err: any) {
      console.error("Error al crear paciente:", err.message)
    } finally {
      setIsFormLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Registrar paciente`}
        size="lg"
      >
        <PatientForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isFormLoading}
          onStepChange={setModalStep}
        />
      </Modal>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <p className="text-sm text-muted-foreground">Hola, {userDisplayName}</p>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          </div>
          <button
            onClick={handleAddPatient}
            className="flex items-center gap-2 rounded-lg bg-vetween-teal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-vetween-teal/85"
          >
            <img src={pawIconPlus} alt="Paw Icon Add" className="size-10" />
            {"Añadir paciente"}
          </button>
        </header>

        <section className="flex-1 px-8 py-6" aria-label="Lista de pacientes">
          {patientsError && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {patientsError}
            </div>
          )}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-vetween-teal focus:outline-none focus:ring-1 focus:ring-vetween-teal"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-indigo-600 text-accent-foreground">
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Nombre</th>
                  <th className="px-6 py-3 font-semibold">Especie</th>
                  <th className="px-6 py-3 font-semibold">Responsable</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Editar</th>
                  <th className="px-6 py-3 font-semibold">Eliminar</th>
                </tr>
              </thead>
              {patients.length > 0 && (
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="text-black border-t border-border transition-colors hover:bg-muted/60">
                      <td className="px-6 py-3 font-medium">{patient.id}</td>
                      <td className="px-6 py-3 font-medium">{patient.nombre}</td>
                      <td className="px-6 py-3">{patient.especie}</td>
                      <td className="px-6 py-3">{patient.responsable}</td>              
                      <td className="px-6 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          patient.estado === "Activo"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {patient.estado}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-sm font-medium text-vetween-blue transition-colors hover:text-vetween-indigo">
                          Editar
                        </button>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-sm font-medium text-red-500 transition-colors hover:text-red-700">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>

            {patients.length === 0 && (
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
      </main>
    </div>
  )
}
