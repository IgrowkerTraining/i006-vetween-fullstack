import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { User } from "../types";
import { getSecurityTip } from "../services/service";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { storage } from "../utils/storage";
import logo from "../assets/logo.svg";
import onlylogo from "../assets/onlylogo.svg";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    registration: "",
    specialties: "",
    consultancy: "",
    habilitation: "",
    addressStreet: "",
    addressNumber: "",
    addressLocality: "",
    province: "",
    phone: "",
    animalTypes: [] as string[],
    consultationCost: "",
  });

  const [specialtiesOpen, setSpecialtiesOpen] = useState(false);
  const specialtiesRef = useRef<HTMLDivElement>(null);

  const [animalTypesOpen, setAnimalTypesOpen] = useState(false);
  const animalTypesRef = useRef<HTMLDivElement>(null);

  const [provinceOpen, setProvinceOpen] = useState(false);
  const provinceRef = useRef<HTMLDivElement>(null);

  const ANIMAL_TYPES_OPTIONS = ["Caninos", "Felinos", "Peces", "Otro"];

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

  const SPECIALTIES_OPTIONS = [
    "Clínica general",
    "Medicina preventiva",
    "Dermatología",
    "Diagnóstico",
    "Urgencias",
    "Otra",
  ];

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialties: value }));
    setSpecialtiesOpen(false);
    setErrors((prev) => {
      const e = { ...prev };
      delete e.specialties;
      return e;
    });
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, province: value }));
    setProvinceOpen(false);
    setErrors((prev) => {
      const e = { ...prev };
      delete e.province;
      return e;
    });
  };

  const handleAnimalTypeChange = (value: string) => {
    setFormData((prev) => {
      const already = prev.animalTypes.includes(value);
      const updated = already
        ? prev.animalTypes.filter((item) => item !== value)
        : [...prev.animalTypes, value];
      if (updated.length > 0)
        setErrors((e) => {
          const n = { ...e };
          delete n.animalTypes;
          return n;
        });
      return { ...prev, animalTypes: updated };
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        specialtiesRef.current &&
        !specialtiesRef.current.contains(e.target as Node)
      ) {
        setSpecialtiesOpen(false);
      }
      if (
        animalTypesRef.current &&
        !animalTypesRef.current.contains(e.target as Node)
      ) {
        setAnimalTypesOpen(false);
      }
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

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [securityTip, setSecurityTip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getSecurityTip();
      setSecurityTip(tip);
    };
    fetchTip();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerError(null);
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2)
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "La contraseña solo puede contener letras (A-Z) y números. No se permiten caracteres como ñ, tildes o símbolos.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número.";
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    const registration = parseInt(formData.registration);
    if (
      !formData.registration ||
      isNaN(registration) ||
      String(registration).length < 4
    )
      newErrors.registration = "La matrícula debe tener al menos 4 dígitos";
    if (!formData.specialties)
      newErrors.specialties = "Debés seleccionar al menos una especialidad";
    if (formData.animalTypes.length === 0)
      newErrors.animalTypes = "Debés seleccionar al menos un tipo de animal";
    const cost = parseFloat(formData.consultationCost);
    if (!formData.consultationCost || isNaN(cost) || cost < 0)
      newErrors.consultationCost =
        "El costo de consulta debe ser mayor o igual a 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    const newErrors: Record<string, string> = {};

    // Datos personales
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2)
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";

    // Contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "La contraseña solo puede contener letras (A-Z) y números. No se permiten caracteres como ñ, tildes o símbolos.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
        "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número.";
    }

    // Datos profesionales
    const registration = parseInt(formData.registration);
    if (
      !formData.registration ||
      isNaN(registration) ||
      String(registration).length < 4
    )
      newErrors.registration = "La matrícula debe tener al menos 4 dígitos";
    if (!formData.specialties)
      newErrors.specialties = "Debés seleccionar al menos una especialidad";
    if (formData.animalTypes.length === 0)
      newErrors.animalTypes = "Debés seleccionar al menos un tipo de animal";
    const cost = parseFloat(formData.consultationCost);
    if (!formData.consultationCost || isNaN(cost) || cost < 0)
      newErrors.consultationCost =
        "El costo de consulta debe ser mayor o igual a 0";

    // Datos del consultorio
    if (!formData.consultancy.trim() || formData.consultancy.trim().length < 2)
      newErrors.consultancy =
        "El nombre del consultorio debe tener al menos 2 caracteres";
    if (
      !formData.habilitation.trim() ||
      formData.habilitation.trim().length < 5
    )
      newErrors.habilitation =
        "El número de habilitación debe tener al menos 5 caracteres";
    if (
      formData.addressStreet.trim() &&
      formData.addressStreet.trim().length < 2
    )
      newErrors.addressStreet = "La calle debe tener al menos 2 caracteres";
    if (
      formData.addressStreet.trim() &&
      !/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/.test(formData.addressStreet.trim())
    )
      newErrors.addressStreet =
        "La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)";
    if (
      formData.addressStreet.trim() &&
      /^[^A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(formData.addressStreet.trim())
    )
      newErrors.addressStreet =
        "La calle solo puede contener letras, espacios y números (pero debe contener al menos una letra)";
    if (
      formData.addressLocality.trim() &&
      formData.addressLocality.trim().length < 2
    )
      newErrors.addressLocality =
        "La ciudad / localidad debe tener al menos 2 caracteres";
    if (!formData.province)
      newErrors.province = "Debés seleccionar una provincia válida";
    if (!formData.phone.trim() || formData.phone.trim().length < 8)
      newErrors.phone = "El teléfono debe tener al menos 8 caracteres";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register({
        nombre: formData.name,
        apellido: formData.lastName,
        email: formData.email,
        password: formData.password,
        matricula: parseInt(formData.registration) || 0,
        especialidad: formData.specialties
          ? [
              formData.specialties
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, ""),
            ]
          : [],
        tipos_animales: formData.animalTypes,
        costo_consulta: parseFloat(formData.consultationCost) || 0,
        nombre_consultorio: formData.consultancy,
        num_habilitacion: formData.habilitation,
        direccion_calle: formData.addressStreet,
        direccion_numero: formData.addressNumber,
        direccion_localidad: formData.addressLocality,
        provincia: formData.province,
        telefono: formData.phone,
      });

      let user = response.user;
      let token = response.token;

      if (!token) {
        const loginResponse = await api.login({
          email: formData.email,
          password: formData.password,
        });
        user = loginResponse.user;
        token = loginResponse.token;
      }

      if (token) {
        storage.setToken(token);
      }

      login(user);
      setShowSuccessModal(true);
    } catch (err: any) {
      setServerError(err.message || "Error al registrar. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        message="Clínica y veterinario registrados exitosamente"
        onAccept={() => {
          setShowSuccessModal(false);
          navigate("/lista-pacientes");
        }}
      />
      <div className="min-h-screen flex bg-white">
        <aside className="hidden md:flex w-72 bg-[#f1f9ff] items-center justify-center shadow-2xl">
          <div className="w-48">
            <img src={logo} alt="Vetween Logo" className="w-full" />
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="bg-[#f1f9ff] backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <img src={onlylogo} alt="vetween logo" />
                </div>
                <h1 className="text-3xl font-bold text-[#0b1001] mb-6">
                  Crear cuenta
                </h1>

                {/* Stepper */}
                <div className="flex items-center justify-center w-full mb-2">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step === 1 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                      1
                    </div>
                    <span
                      className={`mt-2 text-sm transition-all duration-300 ${step === 1 ? "text-[#0b1001] font-semibold" : "text-slate-400"}`}
                    >
                      Profesional
                    </span>
                  </div>

                  {/* Line */}
                  <div className="flex-1 h-[2px] bg-slate-300 mx-4"></div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${step === 2 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                      2
                    </div>
                    <span
                      className={`mt-2 text-sm transition-all duration-300 ${step === 2 ? "text-[#0b1001] font-semibold" : "text-slate-400"}`}
                    >
                      Clínica
                    </span>
                  </div>
                </div>
              </div>

              {serverError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                  {serverError}
                </div>
              )}

              {step === 1 && (
                <form
                  onSubmit={handleStep1Submit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <h2 className="font-bold text-[#0b1001] mb-1">
                    Datos básicos
                  </h2>
                  <div className="md:col-span-2">
                    <Input
                      label="Nombre"
                      name="name"
                      placeholder="Nombre"
                      required
                      disabled={isLoading}
                      error={errors.name}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Apellido"
                      name="lastName"
                      placeholder="Apellido"
                      required
                      disabled={isLoading}
                      error={errors.lastName}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="nombre@email.com"
                      required
                      disabled={isLoading}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    label="Contraseña"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    error={errors.password}
                    value={formData.password}
                    onChange={handleChange}
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none pointer-events-auto"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-1.664 1.664a2.25 2.25 0 0 1-3.182 0l-1.664-1.664Z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    }
                  />
                  <Input
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    error={errors.confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    suffix={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="focus:outline-none pointer-events-auto"
                      >
                        {showConfirmPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-1.664 1.664a2.25 2.25 0 0 1-3.182 0l-1.664-1.664Z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    }
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Número de matrícula"
                      name="registration"
                      placeholder="Matrícula"
                      required
                      disabled={isLoading}
                      error={errors.registration}
                      value={formData.registration}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4" ref={animalTypesRef}>
                    <label className="block text-sm font-semibold text-[#0b1001] mb-1">
                      Especies atendidas
                    </label>
                    {errors.animalTypes && (
                      <p className="text-red-500 text-xs mt-1 mb-1">
                        {errors.animalTypes}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">
                      Seleccioná todas las que correspondan
                    </p>

                    {/* Trigger input */}
                    <button
                      type="button"
                      onClick={() => setAnimalTypesOpen((prev) => !prev)}
                      className={`w-full bg-white rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between ${
                        errors.animalTypes
                          ? "border border-red-500 focus:ring-red-500/50 focus:border-red-500"
                          : "border border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"
                      }`}
                    >
                      <span
                        className={
                          formData.animalTypes.length === 0
                            ? "text-slate-300"
                            : "text-indigo-800 truncate pr-2"
                        }
                      >
                        {formData.animalTypes.length === 0
                          ? "Seleccionar tipos de animales…"
                          : formData.animalTypes.join(", ")}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${animalTypesOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown list */}
                    {animalTypesOpen && (
                      <div className="mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                          {ANIMAL_TYPES_OPTIONS.map((animal) => (
                            <label
                              key={animal}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 select-none"
                            >
                              <input
                                type="checkbox"
                                value={animal}
                                checked={formData.animalTypes.includes(animal)}
                                onChange={() => handleAnimalTypeChange(animal)}
                                className="w-4 h-4 accent-indigo-600 flex-shrink-0"
                              />
                              {animal}
                            </label>
                          ))}
                        </div>
                        {formData.animalTypes.length > 0 && (
                          <div className="border-t border-slate-100 px-3 py-2 flex justify-between items-center">
                            <span className="text-xs text-slate-500">
                              {formData.animalTypes.length} seleccionado
                              {formData.animalTypes.length !== 1 ? "s" : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  animalTypes: [],
                                }));
                              }}
                              className="text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              Limpiar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-4" ref={specialtiesRef}>
                    <label className="block text-sm font-semibold text-[#0b1001] mb-1">
                      Especialidad
                    </label>
                    {errors.specialties && (
                      <p className="text-red-500 text-xs mt-1 mb-1">
                        {errors.specialties}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">
                      Seleccioná una opción
                    </p>

                    {/* Trigger input */}
                    <button
                      type="button"
                      onClick={() => setSpecialtiesOpen((prev) => !prev)}
                      className={`w-full bg-white rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between ${
                        errors.specialties
                          ? "border border-red-500 focus:ring-red-500/50 focus:border-red-500"
                          : "border border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"
                      }`}
                    >
                      <span
                        className={
                          formData.specialties === ""
                            ? "text-slate-300"
                            : "text-indigo-800 truncate pr-2"
                        }
                      >
                        {formData.specialties === ""
                          ? "Seleccionar especialidad…"
                          : formData.specialties}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${specialtiesOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {specialtiesOpen && (
                      <div className="mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-10 overflow-hidden">
                        <div className="p-2 grid grid-cols-1 gap-1">
                          {SPECIALTIES_OPTIONS.map((specialty) => (
                            <label
                              key={specialty}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 select-none"
                            >
                              <input
                                type="radio"
                                name="specialty"
                                value={specialty}
                                checked={formData.specialties === specialty}
                                onChange={() =>
                                  handleSpecialtyChange(specialty)
                                }
                                className="w-4 h-4 accent-indigo-600 flex-shrink-0"
                              />
                              {specialty}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <Input
                      label="Costo de consulta"
                      name="consultationCost"
                      type="number"
                      placeholder="5000"
                      prefix="$"
                      disabled={isLoading}
                      error={errors.consultationCost}
                      value={formData.consultationCost}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowe mb-5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    >
                      Siguiente
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <h2 className="font-bold text-[#0b1001] mb-1">
                    Datos de la clínica
                  </h2>
                  <div className="md:col-span-2">
                    <Input
                      label="Nombre"
                      name="consultancy"
                      placeholder="Nombre de la clínica"
                      required
                      disabled={isLoading}
                      error={errors.consultancy}
                      value={formData.consultancy}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Número habilitación"
                      name="habilitation"
                      placeholder="Número Habilitación"
                      required
                      disabled={isLoading}
                      error={errors.habilitation}
                      value={formData.habilitation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Calle"
                      name="addressStreet"
                      placeholder="Av. San Martín"
                      required
                      disabled={isLoading}
                      error={errors.addressStreet}
                      value={formData.addressStreet}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Número"
                      name="addressNumber"
                      placeholder="1234"
                      required
                      disabled={isLoading}
                      value={formData.addressNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Localidad"
                      name="addressLocality"
                      placeholder="Ciudad"
                      required
                      disabled={isLoading}
                      error={errors.addressLocality}
                      value={formData.addressLocality}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:col-span-2" ref={provinceRef}>
                    <label className="block text-sm font-semibold text-[#0b1001] mb-1">
                      Provincia
                    </label>
                    {errors.province && (
                      <p className="text-red-500 text-xs mt-1 mb-1">
                        {errors.province}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setProvinceOpen((prev) => !prev)}
                      className={`w-full bg-white rounded-lg px-3 py-2.5 text-left text-sm focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between ${
                        errors.province
                          ? "border border-red-500 focus:ring-red-500/50 focus:border-red-500"
                          : "border border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"
                      }`}
                    >
                      <span
                        className={
                          formData.province === ""
                            ? "text-slate-300"
                            : "text-indigo-800 truncate pr-2"
                        }
                      >
                        {formData.province === ""
                          ? "Seleccionar provincia…"
                          : formData.province}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${provinceOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {provinceOpen && (
                      <div className="mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                        <div className="p-2 grid grid-cols-1 gap-1">
                          {PROVINCE_OPTIONS.map((prov) => (
                            <label
                              key={prov}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 select-none"
                            >
                              <input
                                type="radio"
                                name="province"
                                value={prov}
                                checked={formData.province === prov}
                                onChange={() => handleProvinceChange(prov)}
                                className="w-4 h-4 accent-indigo-600 flex-shrink-0"
                              />
                              {prov}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Número de teléfono"
                      name="phone"
                      type="tel"
                      placeholder="(011)999-9999"
                      required
                      disabled={isLoading}
                      error={errors.phone}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mb-5 bg-slate-700 hover:bg-slate-600 text-white"
                    >
                      Atrás
                    </button>
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isLoading}
                    >
                      Crear cuenta
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-slate-400 text-sm">
                  ¿Ya tenés cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Register;
