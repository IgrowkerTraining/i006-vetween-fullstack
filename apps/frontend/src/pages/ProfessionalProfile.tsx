import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { MultiSelect } from "../components/common/MultiSelect";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { api } from "../services/api";
import { storage } from "../utils/storage";
import { ProfessionalProfileSkeleton } from "../components/common/Skeleton";
import iconProfessional from "../assets/iconProfessional.svg";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    nombre?: string;
    apellido?: string;
    costo_consulta?: string;
    tipos_animales?: string;
  }>({});
  const [clinicName, setClinicName] = useState("Nombre de la clínica");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Datos del usuario provenientes del auth (del login)
  const userName = user?.nombre || "Usuario";
  const firstName = userName.split(" ")[0];
  const fullName = user?.apellido ? `${userName} ${user.apellido}` : userName;

  // Loading state based on user and clinic data
  const isLoadingPage = !user || clinicName === "Nombre de la clínica";

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
        } finally {
          setIsLoadingData(false);
        }
      } else {
        setIsLoadingData(false);
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
    especialidad: Array.isArray(user?.especialidad)
      ? user.especialidad[0] || ""
      : user?.especialidad || "",
    tipos_animales: user?.tipos_animales || ([] as string[]),
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
        especialidad: Array.isArray(user.especialidad)
          ? user.especialidad[0] || ""
          : user.especialidad || "",
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
      if (
        animalTypesRef.current &&
        !animalTypesRef.current.contains(e.target as Node)
      ) {
        setAnimalTypesOpen(false);
      }
      if (
        specialtiesRef.current &&
        !specialtiesRef.current.contains(e.target as Node)
      ) {
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

    if (name === "nombre") {
      const max = 50;
      setFieldErrors((prev) => ({
        ...prev,
        nombre:
          value && !/^[A-Za-z\u00C0-\u00FF\s]*$/.test(value)
            ? "El nombre solo puede contener letras y espacios"
            : value && value.length < 2
              ? "El nombre debe tener al menos 2 caracteres"
              : value && value.length > max
                ? `El nombre no puede superar los ${max} caracteres`
                : undefined,
      }));
    }

    if (name === "apellido") {
      const max = 100;
      setFieldErrors((prev) => ({
        ...prev,
        apellido:
          value && !/^[A-Za-z\u00C0-\u00FF\s]*$/.test(value)
            ? "El apellido solo puede contener letras y espacios"
            : value && value.length < 2
              ? "El apellido debe tener al menos 2 caracteres"
              : value && value.length > max
                ? `El apellido no puede superar los ${max} caracteres`
                : undefined,
      }));
    }

    if (name === "costo_consulta") {
      const digits = value.replace(/\D/g, "");
      setFieldErrors((prev) => ({
        ...prev,
        costo_consulta:
          value !== "" && parseFloat(value) < 0
            ? "El costo de consulta debe ser mayor o igual a 0"
            : digits.length > 6
              ? "El costo de consulta no puede tener más de 6 dígitos"
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
        tipos_animales:
          updated.length === 0
            ? "Seleccioná al menos un tipo de animal"
            : undefined,
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

    if (
      fieldErrors.nombre ||
      fieldErrors.apellido ||
      fieldErrors.costo_consulta ||
      fieldErrors.tipos_animales
    ) {
      setError("Por favor, corregí los errores antes de guardar.");
      return;
    }

    if (formData.tipos_animales.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        tipos_animales: "Seleccioná al menos un tipo de animal",
      }));
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
          ? [
              formData.especialidad
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
            ]
          : [],
        tipos_animales: formData.tipos_animales,
        costo_consulta: parseFloat(formData.costo_consulta) || 0,
      };

      const updatedVet = await api.updateVeterinarian(
        idVeterinario,
        updateData,
        token,
      );
      login({ ...user!, ...updatedVet });
      setSuccessMessage("Datos actualizados correctamente");
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Error al guardar los cambios");
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton while loading
  if (isLoadingPage) {
    return (
      <MainLayout>
        <ProfessionalProfileSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SuccessModal
        isOpen={showSuccessModal}
        message="Los datos de mi cuenta se guardaron correctamente"
        onAccept={() => setShowSuccessModal(false)}
      />
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
              <span className="text-foreground font-medium">
                Perfil Profesional
              </span>
            </nav>
          </div>

          {/* Contenido Centrado */}
          <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto">
            <div className="w-full max-w-md">
              {/* User Info Section */}
              <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  {/* Professional Icon */}
                  <div className="h-24 w-24 flex items-center justify-center rounded-full bg-vetween-teal">
                    <img src={iconProfessional} alt="Profesional" className="h-16 w-16" />
                  </div>

                  {/* User Details */}
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-foreground truncate">
                      Dr(a). {fullName}
                    </h2>
                    <p className="text-muted-foreground truncate">{clinicName}</p>
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
                      label="Número de matrícula"
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
                      prefix="$"
                      value={formData.costo_consulta}
                      onChange={handleChange}
                      error={fieldErrors.costo_consulta}
                    />
                  </div>

                  {/* Especies Atendidas */}
                  <MultiSelect
                    label="Especies atendidas"
                    value={formData.tipos_animales}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, tipos_animales: value }));
                      if (value.length > 0) {
                        setFieldErrors((fe) => {
                          const n = { ...fe };
                          delete n.tipos_animales;
                          return n;
                        });
                      }
                    }}
                    placeholder="Seleccionar tipos de animales…"
                    error={fieldErrors.tipos_animales}
                    options={ANIMAL_TYPES_OPTIONS.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                  />

                  {/* Especialidad */}
                  <Select
                    label="Especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    placeholder="Seleccionar especialidad…"
                    options={SPECIALTIES_OPTIONS.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-[#808080] hover:bg-[#A49D9D] text-white border-red-500 hover:border-red-600"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="flex-1"
                    isLoading={isLoading}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </section>
            </div>
          </div>
    </MainLayout>
  );
}
