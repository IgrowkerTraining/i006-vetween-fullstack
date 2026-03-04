import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { api } from "../services/api";
import { storage } from "../utils/storage";

const PROVINCE_OPTIONS = [
  "CABA",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export default function ClinicProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [provinciaOpen, setProvinciaOpen] = useState(false);
  const provinciaRef = useRef<HTMLDivElement>(null);

  // Estado del formulario y nombre de la clínica
  const [clinicName, setClinicName] = useState("Nombre de la clínica");
  const [formData, setFormData] = useState({
    nombre: "",
    num_habilitacion: "",
    direccion_calle: "",
    direccion_numero: "",
    direccion_localidad: "",
    provincia: "",
    telefono: "",
  });
  const [originalFormData, setOriginalFormData] = useState<any>(null);

  // Cargar datos de la clínica desde la API
  useEffect(() => {
    const loadClinicData = async () => {
      const token = storage.getToken();

      if (token) {
        try {
          setIsLoading(true);
      const clinicData = await api.getClinic(token);
      setClinicName(clinicData.nombre || "Nombre de la clínica");
      const initial = {
        nombre: clinicData.nombre || "",
        num_habilitacion: clinicData.num_habilitacion || "",
        direccion_calle: clinicData.direccion_calle || "",
        direccion_numero: clinicData.direccion_numero || "",
        direccion_localidad: clinicData.direccion_localidad || "",
        provincia: clinicData.provincia || "",
        telefono: clinicData.telefono || "",
      };
      setFormData(initial);
      setOriginalFormData(initial);
        } catch (error) {
          console.error("Error loading clinic data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadClinicData();
  }, [user]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (provinciaRef.current && !provinciaRef.current.contains(e.target as Node)) {
        setProvinciaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinciaChange = (value: string) => {
    setFormData((prev) => ({ ...prev, provincia: value }));
    setProvinciaOpen(false);
  };

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

      if (!originalFormData) {
        alert("No hay datos originales para comparar");
        return;
      }

      // Preparar solo campos modificados
      const updateData: Partial<typeof formData> = {};
      (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
        const cur = formData[key];
        const orig = originalFormData[key];
        const changed = Array.isArray(cur) ? JSON.stringify(cur) !== JSON.stringify(orig) : cur !== orig;
        if (changed) {
          updateData[key] = cur;
        }
      });

      if (Object.keys(updateData).length === 0) {
        alert("No hay cambios para guardar");
        return;
      }

      await api.updateClinic(updateData, token);
      alert("Datos de la clínica actualizados correctamente");
      setOriginalFormData({ ...formData });
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
                  />
                </div>

                {/* Dirección Calle */}
                <div>
                  <Input
                    label="Calle"
                    name="direccion_calle"
                    placeholder="Av. San Martín"
                    value={formData.direccion_calle}
                    onChange={handleChange}
                  />
                </div>

                {/* Dirección Número */}
                <div>
                  <Input
                    label="Número"
                    name="direccion_numero"
                    placeholder="1234"
                    value={formData.direccion_numero}
                    onChange={handleChange}
                  />
                </div>

                {/* Dirección Localidad */}
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
                <div ref={provinciaRef}>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Provincia
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Seleccioná una provincia
                  </p>

                  {/* Trigger input */}
                  <button
                    type="button"
                    onClick={() => setProvinciaOpen((prev) => !prev)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 focus:ring-vetween-teal/50 focus:border-vetween-teal transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={formData.provincia === "" ? "text-muted-foreground" : "text-foreground truncate pr-2"}>
                      {formData.provincia === "" ? "Seleccionar provincia…" : formData.provincia}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${provinciaOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {provinciaOpen && (
                    <div className="mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="p-2 grid grid-cols-1 gap-1">
                        {PROVINCE_OPTIONS.map((province) => (
                          <label
                            key={province}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-vetween-teal/10 cursor-pointer text-sm text-foreground select-none"
                          >
                            <input
                              type="radio"
                              name="provincia"
                              value={province}
                              checked={formData.provincia === province}
                              onChange={() => handleProvinciaChange(province)}
                              className="w-4 h-4 accent-vetween-teal flex-shrink-0"
                            />
                            {province}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Número de Teléfono */}
                <div>
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      label="Número de teléfono"
                      name="telefono"
                      type="tel"
                      placeholder="54 9 11 12345678"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
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