import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

const ANIMAL_TYPES_OPTIONS = [
  "Perros",
  "Gatos",
  "Conejos",
  "Hámster",
  "Aves",
  "Reptiles",
  "Otro",
];

const SPECIALTIES_OPTIONS = [
  "Compañía",
  "Producción",
  "Silvestre",
  "Exóticos",
  "Acuáticos",
];

export default function ProfessionalProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Datos del usuario provenientes del auth (mock para prueba)
  const userName = user?.name || "Usuario";
  const firstName = userName.split(" ")[0];
  const fullName = user?.lastName ? `${userName} ${user.lastName}` : userName;
  const consultancy = user?.consultancy || "Nombre de la clínica";

  // Estado del formulario con datos del usuario
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    registration: user?.registration || "",
    specialties: user?.specialties || "",
    animalTypes: user?.animalTypes || [] as string[],
  });

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
  };

  const handleAnimalTypeChange = (value: string) => {
    setFormData((prev) => {
      const already = prev.animalTypes.includes(value);
      return {
        ...prev,
        animalTypes: already
          ? prev.animalTypes.filter((item) => item !== value)
          : [...prev.animalTypes, value],
      };
    });
  };

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialties: value }));
    setSpecialtiesOpen(false);
  };

  const handleCancel = () => {
    navigate(-1); // Regresa a la página anterior
  };

  const handleSave = () => {
    // Función de guardar - solo console log para demostración
    console.log("Datos guardados:", formData);
    alert("Cambios guardados correctamente (demo)");
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
                    ) : user?.avatar ? (
                      <img
                        src={user.avatar}
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
                  <p className="text-muted-foreground">{consultancy}</p>
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

              {/* Form */}
              <div className="grid grid-cols-1 gap-4">
                {/* Nombre */}
                <div>
                  <Input
                    label="Nombre"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Apellido */}
                <div>
                  <Input
                    label="Apellido"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
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
                  />
                </div>

                {/* Número de Matrícula */}
                <div>
                  <Input
                    label="Número de Matrícula"
                    name="registration"
                    placeholder="Matrícula"
                    value={formData.registration}
                    onChange={handleChange}
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
                    className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-vetween-teal/50 focus:border-vetween-teal transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={formData.animalTypes.length === 0 ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.animalTypes.length === 0
                        ? "Seleccionar tipos de animales…"
                        : formData.animalTypes.join(", ")}
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
                              checked={formData.animalTypes.includes(animal)}
                              onChange={() => handleAnimalTypeChange(animal)}
                              className="w-4 h-4 accent-vetween-teal flex-shrink-0"
                            />
                            {animal}
                          </label>
                        ))}
                      </div>
                      {formData.animalTypes.length > 0 && (
                        <div className="border-t border-border px-3 py-2 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {formData.animalTypes.length} seleccionado{formData.animalTypes.length !== 1 ? "s" : ""}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, animalTypes: [] }))}
                            className="text-xs text-red-500 hover:text-red-600 transition-colors"
                          >
                            Limpiar
                          </button>
                        </div>
                      )}
                    </div>
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
                    className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-vetween-teal/50 focus:border-vetween-teal transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={formData.specialties === "" ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.specialties === "" ? "Seleccionar especialidad…" : formData.specialties}
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
                              name="specialty"
                              value={specialty}
                              checked={formData.specialties === specialty}
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
