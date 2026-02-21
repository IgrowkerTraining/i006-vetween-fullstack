import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export interface Patient {
  id: string
  nombre: string
  especie: string
  responsable: string
  ultimaVisita: string
  estado: string
}

const samplePatients: Patient[] = [
  { id: "1", nombre: "Luna", especie: "Canino", responsable: "Maria Lopez", ultimaVisita: "15/02/2026", estado: "Activo" },
  { id: "2", nombre: "Milo", especie: "Felino", responsable: "Juan Perez", ultimaVisita: "10/02/2026", estado: "Activo" },
  { id: "3", nombre: "Rocky", especie: "Canino", responsable: "Ana Garcia", ultimaVisita: "08/02/2026", estado: "Inactivo" },
]

function VetweenLogo({ className = "size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Vetween VMS logo">
      <circle cx="38" cy="55" r="28" fill="#5BC0BE" opacity="0.7" />
      <rect x="44" y="18" width="18" height="60" rx="9" fill="#3A86C9" />
      <rect x="30" y="34" width="46" height="18" rx="9" fill="#3A86C9" />
      <rect x="44" y="34" width="18" height="18" rx="4" fill="#68D8D6" opacity="0.6" />
    </svg>
  )
}

function PawIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="currentColor" />
      <ellipse cx="16" cy="24" rx="6" ry="8" transform="rotate(-15 16 24)" fill="currentColor" />
      <ellipse cx="48" cy="24" rx="6" ry="8" transform="rotate(15 48 24)" fill="currentColor" />
      <ellipse cx="23" cy="18" rx="5.5" ry="7.5" transform="rotate(-5 23 18)" fill="currentColor" />
      <ellipse cx="41" cy="18" rx="5.5" ry="7.5" transform="rotate(5 41 18)" fill="currentColor" />
    </svg>
  )
}

const navItems = [
  { label: "Pacientes", id: "pacientes" },
  { label: "Historial clinico", id: "historial" },
  { label: "Resumen clinico", id: "resumen" },
  { label: "Administracion", id: "administracion" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeNav, setActiveNav] = useState("pacientes")
  const [patients, setPatients] = useState<Patient[]>([])

  const handleAddPatient = () => {
    if (patients.length === 0) {
      setPatients(samplePatients)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex h-screen w-56 flex-col border-r border-border bg-card">
        <div className="flex items-center justify-center py-6">
          <VetweenLogo className="size-20" />
        </div>

        <nav className="flex flex-1 flex-col px-3" aria-label="Navegacion principal">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeNav === item.id
                      ? "bg-vetween-indigo text-accent-foreground"
                      : "text-sidebar-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border px-3 py-3">
          <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted">
            Mi cuenta
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

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
            <PawIcon className="size-5" />
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
                <tr className="bg-vetween-indigo text-accent-foreground">
                  <th className="px-6 py-3 font-semibold">Nombre</th>
                  <th className="px-6 py-3 font-semibold">Especie</th>
                  <th className="px-6 py-3 font-semibold">Responsable</th>
                  <th className="px-6 py-3 font-semibold">Visita</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 font-semibold">Editar</th>
                  <th className="px-6 py-3 font-semibold">Eliminar</th>
                </tr>
              </thead>
              {patients.length > 0 && (
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="text-black border-t border-border transition-colors hover:bg-muted/60">
                      <td className="px-6 py-3 font-medium">{patient.nombre}</td>
                      <td className="px-6 py-3">{patient.especie}</td>
                      <td className="px-6 py-3">{patient.responsable}</td>
                      <td className="px-6 py-3">{patient.ultimaVisita}</td>
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
                <PawIcon className="size-16 text-muted-foreground/40" />
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
