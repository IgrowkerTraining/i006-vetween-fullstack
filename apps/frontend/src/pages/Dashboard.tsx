import React, { useState } from "react";
import pawIcon from "../assets/pawIcon.svg";
import pawIconPlus from "../assets/pawIconPlus.svg";
import Sidebar from "../components/layout/Sidebar";

export interface Patient {
  id: string
  nombre: string
  especie: string
  responsable: string
  
  estado: string
}

const samplePatients: Patient[] = [
  { id: "1", nombre: "Luna", especie: "Canino", responsable: "Maria Lopez", estado: "Activo" },
  { id: "2", nombre: "Milo", especie: "Felino", responsable: "Juan Perez",  estado: "Activo" },
  { id: "3", nombre: "Rocky", especie: "Canino", responsable: "Ana Garcia",  estado: "Inactivo" },
]


export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])

  const handleAddPatient = () => {
    if (patients.length === 0) {
      setPatients(samplePatients)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div>
            <p className="text-sm text-muted-foreground">Hola, usuario</p>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
          </div>
          <button
            onClick={handleAddPatient}
            className="flex items-center gap-2 rounded-lg bg-vetween-teal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-vetween-teal/85"
          >
            <img src={pawIconPlus} alt="Paw Icon Add" className="size-10" />
            {"Anadir paciente"}
          </button>
        </header>

        <section className="flex-1 px-8 py-6" aria-label="Lista de pacientes">
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
