import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { api } from "../services/api";
import { storage } from "../utils/storage";

export default function ClinicProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Estado del formulario y nombre de la clínica
  const [clinicName, setClinicName] = useState("Nombre de la clínica");
  const [provinceOpen, setProvinceOpen] = useState(false);
  const provinceRef = useRef<HTMLDivElement>(null);

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
        }
      }
    };

    loadClinicData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, provincia: value }));
    setProvinceOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
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
      alert("No hay sesión activa");
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
        provincia: [formData.provincia],
        telefono: formData.telefono,
      };

      await api.updateClinic(updateData, token);
      alert("Datos de la clínica actualizados correctamente");
    } catch (error: any) {
      alert(error.message || "Error al guardar los cambios");
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-12 w-12 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
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
                <div ref={provinceRef}>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Provincia
                  </label>
                  <button
                    type="button"
                    onClick={() => setProvinceOpen((prev) => !prev)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-vetween-teal/50 focus:border-vetween-teal transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={formData.provincia === "" ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.provincia === "" ? "Seleccionar provincia…" : formData.provincia}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${provinceOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>
                  {provinceOpen && (
                    <div className="mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {PROVINCE_OPTIONS.map((prov) => (
                          <label
                            key={prov}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-vetween-teal/10 cursor-pointer text-sm text-foreground select-none"
                          >
                            <input
                              type="radio"
                              name="provincia"
                              value={prov}
                              checked={formData.provincia === prov}
                              onChange={() => handleProvinceChange(prov)}
                              className="w-4 h-4 accent-vetween-teal flex-shrink-0"
                            />
                            {prov}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Número de Teléfono */}
                <div>
                  <Input
                    label="Número de teléfono"
                    name="telefono"
                    type="tel"
                    placeholder="(011) 999-9999"
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
