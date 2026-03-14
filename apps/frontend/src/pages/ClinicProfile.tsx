import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { api } from "../services/api";
import { storage } from "../utils/storage";
import { useToast } from "../context/ToastContext";
import { ClinicProfileSkeleton } from "../components/common/Skeleton";
import iconClinic from "../assets/iconClinic.svg";
import argentinaFlag from "../assets/argentinaFlag.svg";

export default function ClinicProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    nombre?: string;
    direccion_calle?: string;
    direccion_numero?: string;
  }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estado del formulario y nombre de la clínica
  const [clinicName, setClinicName] = useState("Nombre de la clínica");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const provinceRef = useRef<HTMLDivElement>(null);

  // Loading state
  const isLoadingPage = clinicName === "Nombre de la clínica" && isLoadingData;

  const PROVINCE_OPTIONS = [
    "CABA",
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Cordoba",
    "Corrientes",
    "Entre Rios",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquen",
    "Rio Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucuman",
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    num_habilitacion: "",
    direccion_calle: "",
    direccion_numero: "",
    direccion_localidad: "",
    provincia: "",
    telefono: "",
  });

  // Cargar datos de la clínica desde la API
  useEffect(() => {
    const loadClinicData = async () => {
      const token = storage.getToken();

      if (token) {
        try {
          setIsLoading(true);
          const clinicData = await api.getClinic(token);
          setClinicName(clinicData.nombre || "Nombre de la clínica");
          setFormData({
            nombre: clinicData.nombre || "",
            num_habilitacion: clinicData.num_habilitacion || "",
            direccion_calle: clinicData.direccion_calle || "",
            direccion_numero: clinicData.direccion_numero || "",
            direccion_localidad: clinicData.direccion_localidad || "",
            provincia: clinicData.provincia || "",
            telefono: clinicData.telefono || "",
          });
        } catch (error) {
          console.error("Error loading clinic data:", error);
        } finally {
          setIsLoading(false);
          setIsLoadingData(false);
        }
      } else {
        setIsLoadingData(false);
      }
    };

    loadClinicData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "nombre") {
      const hasInvalidChars =
        value && !/^[A-Za-z\u00C0-\u00FF\s]*$/.test(value);
      setFieldErrors((prev) => ({
        ...prev,
        nombre: hasInvalidChars
          ? "El nombre solo puede contener letras y espacios"
          : undefined,
      }));
    }

    if (name === "direccion_calle") {
      const hasInvalidChars =
        value && !/^[A-Za-z\u00C0-\u00FF0-9\s,-]*$/.test(value);
      setFieldErrors((prev) => ({
        ...prev,
        direccion_calle: hasInvalidChars
          ? "La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)"
          : undefined,
      }));
    }

    if (name === "direccion_numero") {
      const hasInvalidChars = value && !/^[0-9]*$/.test(value);
      setFieldErrors((prev) => ({
        ...prev,
        direccion_numero: hasInvalidChars
          ? "El número de dirección solo puede contener dígitos"
          : undefined,
      }));
    }
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, provincia: value }));
    setProvinceOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        provinceRef.current &&
        !provinceRef.current.contains(e.target as Node)
      ) {
        setProvinceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    const token = storage.getToken();

    if (!token) {
      showToast("No hay sesión activa", "error");
      return;
    }

    if (
      fieldErrors.nombre ||
      fieldErrors.direccion_calle ||
      fieldErrors.direccion_numero
    ) {
      showToast("Por favor, corregí los errores antes de guardar.", "error");
      return;
    }

    if (
      formData.direccion_calle &&
      !/[A-Za-z\u00C0-\u00FF]/.test(formData.direccion_calle)
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        direccion_calle:
          "La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)",
      }));
      return;
    }

    try {
      setIsLoading(true);

      // Preparar datos para actualizar
      const updateData = {
        nombre: formData.nombre,
        direccion_calle: formData.direccion_calle,
        direccion_numero: formData.direccion_numero,
        direccion_localidad: formData.direccion_localidad,
        provincia: formData.provincia,
        telefono: formData.telefono,
      };

      await api.updateClinic(updateData, token);
      setShowSuccessModal(true);
    } catch (error: any) {
      showToast(error.message || "Error al guardar los cambios", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Show skeleton while loading
  if (isLoadingPage) {
    return (
      <MainLayout>
        <ClinicProfileSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SuccessModal
        isOpen={showSuccessModal}
        message="Los datos de la clínica se guardaron correctamente"
        onAccept={() => setShowSuccessModal(false)}
      />
        {/* Header */}
        <header className="border-b border-border px-8 py-5">
          <p className="text-sm text-muted-foreground">Hola</p>
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
              <span className="text-foreground font-medium">Clínica</span>
            </nav>
          </div>

          {/* Contenido Centrado */}
          <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto">
            <div className="w-full max-w-md">
              {/* Clinic Info Section */}
              <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  {/* Clinic Icon */}
                  <div className="h-24 w-24 flex items-center justify-center rounded-full bg-vetween-teal">
                    <img src={iconClinic} alt="Clínica" className="h-12 w-12" />
                  </div>

                  {/* Clinic Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {clinicName}
                    </h2>
                    <p className="text-muted-foreground">Datos de la clínica</p>
                  </div>
                </div>
              </section>

              {/* Form Section */}
              <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6">
                {/* Label */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Datos de la clínica
                  </h3>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Nombre de la Clínica */}
                  <div>
                    <Input
                      label="Nombre"
                      name="nombre"
                      placeholder="Nombre de la clínica"
                      value={formData.nombre}
                      onChange={handleChange}
                      error={fieldErrors.nombre}
                    />
                  </div>

                  {/* Número de Habilitación */}
                  <div>
                    <Input
                      label="Número de Habilitación"
                      name="num_habilitacion"
                      placeholder="Número de habilitación"
                      value={formData.num_habilitacion}
                      onChange={handleChange}
                      disabled
                    />
                  </div>

                  {/* Calle */}
                  <div>
                    <Input
                      label="Calle"
                      name="direccion_calle"
                      placeholder="Av. San Martín"
                      value={formData.direccion_calle}
                      onChange={handleChange}
                      error={fieldErrors.direccion_calle}
                    />
                  </div>

                  {/* Número */}
                  <div>
                    <Input
                      label="Número"
                      name="direccion_numero"
                      placeholder="1234"
                      value={formData.direccion_numero}
                      onChange={handleChange}
                      error={fieldErrors.direccion_numero}
                    />
                  </div>

                  {/* Localidad */}
                  <div>
                    <Input
                      label="Localidad"
                      name="direccion_localidad"
                      placeholder="Ciudad"
                      value={formData.direccion_localidad}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Provincia */}
                  <Select
                    label="Provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    placeholder="Seleccionar provincia…"
                    options={PROVINCE_OPTIONS.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                  />

                  {/* Número de Teléfono */}
                  <div>
                    <Input
                      label="Número de teléfono"
                      name="telefono"
                      type="tel"
                      placeholder="11 9 12341234"
                      prefix={<img src={argentinaFlag} alt="Argentina" className="w-5 h-4" />}
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
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
