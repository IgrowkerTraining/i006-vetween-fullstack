import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { api } from "../services/api";
import { storage } from "../utils/storage";

const ANIMAL_TYPES_OPTIONS = ["Caninos", "Felinos", "Peces", "Otro"];

  const SPECIALTIES_OPTIONS = [
    "Clínica general",
    "Medicina preventiva",
    "Dermatología",
    "Diagnóstico",
    "Urgencias",
    "Otra",
  ];

export default function ProfessionalProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ nombre?: string; apellido?: string; costo_consulta?: string; tipos_animales?: string }>({});
  const [clinicName, setClinicName] = useState("Nombre de la clínica");

  // Datos del usuario provenientes del auth (del login)
  const userName = user?.nombre || "Usuario";
  const firstName = userName.split(" ")[0];
  const fullName = user?.apellido ? `${userName} ${user.apellido}` : userName;

  // Buscar nombre de la clínica desde la API
  useEffect(() => {
    const loadClinicName = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const clinicData = await api.getClinic(token);
          setClinicName(clinicData.nombre || "Nombre de la clínica");
        } catch (error) {
          console.error("Error loading clinic name:", error);
        }
      }
    };
    loadClinicName();
  }, [user]);

  // Estado del formulario con datos del usuario (del login)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    email: user?.email || "",
    matricula: user?.matricula?.toString() || "",
    especialidad: Array.isArray(user?.especialidad) ? user.especialidad[0] || "" : user?.especialidad || "",
    tipos_animales: user?.tipos_animales || [] as string[],
    costo_consulta: user?.costo_consulta?.toString() || "",
  });

  // Actualizar cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        matricula: user.matricula?.toString() || "",
        especialidad: Array.isArray(user.especialidad) ? user.especialidad[0] || "" : user.especialidad || "",
        tipos_animales: user.tipos_animales || [],
        costo_consulta: user.costo_consulta?.toString() || "",
      });
    }
  }, [user]);

  const [animalTypesOpen, setAnimalTypesOpen] = useState(false);
  const [specialtiesOpen, setSpecialtiesOpen] = useState(false);
  const animalTypesRef = useRef<HTMLDivElement>(null);
  const specialtiesRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (animalTypesRef.current && !animalTypesRef.current.contains(e.target as Node)) {
        setAnimalTypesOpen(false);
      }
      if (specialtiesRef.current && !specialtiesRef.current.contains(e.target as Node)) {
        setSpecialtiesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre" || name === "apellido") {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: value && !/^[A-Za-z\u00C0-\u00FF\s]*$/.test(value)
          ? `El ${name} solo puede contener letras y espacios`
          : undefined,
      }));
    }

    if (name === "costo_consulta") {
      setFieldErrors((prev) => ({
        ...prev,
        costo_consulta: value !== "" && parseFloat(value) < 0
          ? "El costo de consulta debe ser mayor o igual a 0"
          : undefined,
      }));
    }
  };

  const handleAnimalTypeChange = (value: string) => {
    setFormData((prev) => {
      const already = prev.tipos_animales.includes(value);
      const updated = already
        ? prev.tipos_animales.filter((item) => item !== value)
        : [...prev.tipos_animales, value];
      setFieldErrors((fe) => ({
        ...fe,
        tipos_animales: updated.length === 0 ? "Seleccioná al menos un tipo de animal" : undefined,
      }));
      return { ...prev, tipos_animales: updated };
    });
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, especialidad: value }));
    setSpecialtiesOpen(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    const token = storage.getToken();
    const idVeterinario = user?.id_veterinario;

    if (!token || !idVeterinario) {
      setError("No hay sesión activa");
      return;
    }

    if (fieldErrors.nombre || fieldErrors.apellido || fieldErrors.costo_consulta || fieldErrors.tipos_animales) {
      setError("Por favor, corregí los errores antes de guardar.");
      return;
    }

    if (formData.tipos_animales.length === 0) {
      setFieldErrors((prev) => ({ ...prev, tipos_animales: "Seleccioná al menos un tipo de animal" }));
      setError("Por favor, corregí los errores antes de guardar.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Preparar datos para actualizar
      const updateData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        especialidad: formData.especialidad
          ? [formData.especialidad.normalize("NFD").replace(/[\u0300-\u036f]/g, "")]
          : [],
        tipos_animales: formData.tipos_animales,
        costo_consulta: parseFloat(formData.costo_consulta) || 0,
      };

      const updatedVet = await api.updateVeterinarian(idVeterinario, updateData, token);
      login({ ...user!, ...updatedVet });
      setSuccessMessage("Datos actualizados correctamente");
    } catch (err: any) {
      setError(err.message || "Error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-y-auto">
        {/* Header */}
        <header className="border-b border-border px-8 py-5">
          <p className="text-sm text-muted-foreground">Hola, {firstName}</p>
          <h1 className="text-2xl font-bold text-foreground">Mi Cuenta</h1>
        </header>

        {/* Breadcrumb */}
        <div className="border-b border-border px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/mi-cuenta")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Mi cuenta
            </button>
            <span className="text-muted-foreground">›</span>
            <span className="text-foreground font-medium">Perfil Profesional</span>
          </nav>
        </div>

        {/* Contenido Centrado */}
        <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* User Info Section */}
            <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar with upload */}
                <div className="relative">
                  <div
                    onClick={handleAvatarClick}
                    className="h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-vetween-teal ring-2 ring-border hover:ring-vetween-teal/70"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-vetween-teal text-2xl font-bold text-white">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* User Details */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Dr(a). {fullName}
                  </h2>
                  <p className="text-muted-foreground">{clinicName}</p>
                </div>
              </div>
            </section>

            {/* Form Section */}
            <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6">
              {/* Label */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Datos del veterinario
                </h3>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success message */}
              {successMessage && (
                <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg">
                  {successMessage}
                </div>
              )}

              {/* Form */}
              <div className="grid grid-cols-1 gap-4">
                {/* Nombre */}
                <div>
                  <Input
                    label="Nombre"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    error={fieldErrors.nombre}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <Input
                    label="Apellido"
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    error={fieldErrors.apellido}
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="nombre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                {/* Número de Matrícula */}
                <div>
                  <Input
                    label="Número de Matrícula"
                    name="matricula"
                    placeholder="Matrícula"
                    value={formData.matricula}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                {/* Costo de Consulta */}
                <div>
                  <Input
                    label="Costo de consulta"
                    name="costo_consulta"
                    type="number"
                    placeholder="5000"
                    value={formData.costo_consulta}
                    onChange={handleChange}
                    error={fieldErrors.costo_consulta}
                  />
                </div>

                {/* Especies Atendidas */}
                <div ref={animalTypesRef}>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Especies atendidas
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Seleccioná todas las que correspondan
                  </p>

                  {/* Trigger input */}
                  <button
                    type="button"
                    onClick={() => setAnimalTypesOpen((prev) => !prev)}
                    className={`w-full bg-white border rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none transition-all duration-200 flex items-center justify-between ${animalTypesOpen ? "border-indigo-500 ring-2 ring-indigo-500/50" : "border-slate-700 hover:border-indigo-500"}`}
                  >
                    <span className={formData.tipos_animales.length === 0 ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.tipos_animales.length === 0
                        ? "Seleccionar tipos de animales…"
                        : formData.tipos_animales.join(", ")}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${animalTypesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown list */}
                  {animalTypesOpen && (
                    <div className="mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                        {ANIMAL_TYPES_OPTIONS.map((animal) => (
                          <label
                            key={animal}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-vetween-teal/10 cursor-pointer text-sm text-foreground select-none"
                          >
                            <input
                              type="checkbox"
                              value={animal}
                              checked={formData.tipos_animales.includes(animal)}
                              onChange={() => handleAnimalTypeChange(animal)}
                              className="w-4 h-4 accent-vetween-teal flex-shrink-0"
                            />
                            {animal}
                          </label>
                        ))}
                      </div>
                      {formData.tipos_animales.length > 0 && (
                        <div className="border-t border-border px-3 py-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {formData.tipos_animales.length} seleccionado{formData.tipos_animales.length !== 1 ? "s" : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, tipos_animales: [] }));
                              setFieldErrors((prev) => ({ ...prev, tipos_animales: "Seleccioná al menos un tipo de animal" }));
                            }}
                            className="text-xs text-red-500 hover:text-red-600 transition-colors"
                          >
                            Limpiar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {fieldErrors.tipos_animales && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.tipos_animales}</p>
                  )}
                </div>

                {/* Especialidad */}
                <div ref={specialtiesRef}>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Especialidad
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Seleccioná una opción
                  </p>

                  {/* Trigger input */}
                  <button
                    type="button"
                    onClick={() => setSpecialtiesOpen((prev) => !prev)}
                    className={`w-full bg-white border rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none transition-all duration-200 flex items-center justify-between ${specialtiesOpen ? "border-indigo-500 ring-2 ring-indigo-500/50" : "border-slate-700 hover:border-indigo-500"}`}
                  >
                    <span className={formData.especialidad === "" ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.especialidad === "" ? "Seleccionar especialidad…" : formData.especialidad}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${specialtiesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {specialtiesOpen && (
                    <div className="mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {SPECIALTIES_OPTIONS.map((specialty) => (
                          <label
                            key={specialty}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-vetween-teal/10 cursor-pointer text-sm text-foreground select-none"
                          >
                            <input
                              type="radio"
                              name="especialidad"
                              value={specialty}
                              checked={formData.especialidad === specialty}
                              onChange={() => handleSpecialtyChange(specialty)}
                              className="w-4 h-4 accent-vetween-teal flex-shrink-0"
                            />
                            {specialty}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="flex-1"
                  isLoading={isLoading}
                >
                  Guardar Cambios
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
