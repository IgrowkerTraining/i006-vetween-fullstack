import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { MultiSelect } from "../components/common/MultiSelect";
import { Stepper } from "../components/common/Stepper";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { User } from "../types";
import { getSecurityTip } from "../services/service";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { storage } from "../utils/storage";
import logo from "../assets/logo.svg";
import onlylogo from "../assets/onlylogo.svg";
import eyeOpen from "../assets/eyeOpen.svg";
import eyeSlash from "../assets/eyeSlash.svg";
import argentinaFlag from "../assets/argentinaFlag.svg";

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

  const ANIMAL_TYPES_OPTIONS = ["Caninos", "Felinos", "Aves", "Peces", "Roedores", "Otro"];

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
    const processed = name === "email" ? value.toLowerCase() : value;
    setFormData((prev) => ({ ...prev, [name]: processed }));
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

    // Nombre
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = "El nombre es requerido";
    } else if (nameTrimmed.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (nameTrimmed.length > 50) {
      newErrors.name = "El nombre no puede superar los 50 caracteres";
    } else if (/\d/.test(nameTrimmed)) {
      newErrors.name = "El nombre no puede contener números";
    }

    // Apellido
    const lastNameTrimmed = formData.lastName.trim();
    if (!lastNameTrimmed) {
      newErrors.lastName = "El apellido es requerido";
    } else if (lastNameTrimmed.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (lastNameTrimmed.length > 100) {
      newErrors.lastName = "El apellido no puede superar los 100 caracteres";
    } else if (/\d/.test(lastNameTrimmed)) {
      newErrors.lastName = "El apellido no puede contener números";
    }

    // Email
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = "El formato de email no es válido";
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número";
    }

    // Confirmar contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Matrícula
    const registrationTrimmed = formData.registration.trim();
    const matricula = parseInt(registrationTrimmed);
    if (!registrationTrimmed) {
      newErrors.registration = "La matrícula es requerida";
    } else if (!/^\d+$/.test(registrationTrimmed)) {
      newErrors.registration = "La matrícula solo puede contener números";
    } else if (matricula <= 0) {
      newErrors.registration = "La matrícula debe ser un número positivo";
    } else if (registrationTrimmed.length < 4) {
      newErrors.registration = "La matrícula debe tener al menos 4 dígitos";
    } else if (registrationTrimmed.length > 15) {
      newErrors.registration = "La matrícula no puede superar los 15 dígitos";
    }

    // Especialidad
    if (!formData.specialties) {
      newErrors.specialties = "Tenés que seleccionar al menos una especialidad";
    }

    // Tipos de animales
    if (formData.animalTypes.length === 0) {
      newErrors.animalTypes = "Tenés que seleccionar al menos un tipo de animal";
    }

    // Costo de consulta
    const costStr = formData.consultationCost.trim();
    const cost = parseFloat(costStr);
    if (!costStr) {
      newErrors.consultationCost = "El costo de consulta es requerido";
    } else if (isNaN(cost) || cost < 0) {
      newErrors.consultationCost = "El costo de consulta debe ser mayor o igual a 0";
    } else if (cost > 999999) {
      newErrors.consultationCost = "El costo de consulta no puede superar los 6 dígitos";
    }

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

    // Nombre
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = "El nombre es requerido";
    } else if (nameTrimmed.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (nameTrimmed.length > 50) {
      newErrors.name = "El nombre no puede superar los 50 caracteres";
    } else if (/\d/.test(nameTrimmed)) {
      newErrors.name = "El nombre no puede contener números";
    }

    // Apellido
    const lastNameTrimmed = formData.lastName.trim();
    if (!lastNameTrimmed) {
      newErrors.lastName = "El apellido es requerido";
    } else if (lastNameTrimmed.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    } else if (lastNameTrimmed.length > 100) {
      newErrors.lastName = "El apellido no puede superar los 100 caracteres";
    } else if (/\d/.test(lastNameTrimmed)) {
      newErrors.lastName = "El apellido no puede contener números";
    }

    // Contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d).{8,}$/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Matrícula
    const registrationTrimmed = formData.registration.trim();
    const matricula = parseInt(registrationTrimmed);
    if (!registrationTrimmed) {
      newErrors.registration = "La matrícula es requerida";
    } else if (!/^\d+$/.test(registrationTrimmed)) {
      newErrors.registration = "La matrícula solo puede contener números";
    } else if (matricula <= 0) {
      newErrors.registration = "La matrícula debe ser un número positivo";
    } else if (registrationTrimmed.length < 4) {
      newErrors.registration = "La matrícula debe tener al menos 4 dígitos";
    } else if (registrationTrimmed.length > 15) {
      newErrors.registration = "La matrícula no puede superar los 15 dígitos";
    }

    // Especialidad
    if (!formData.specialties) {
      newErrors.specialties = "Tenés que seleccionar al menos una especialidad";
    }

    // Tipos de animales
    if (formData.animalTypes.length === 0) {
      newErrors.animalTypes = "Tenés que seleccionar al menos un tipo de animal";
    }

    // Costo de consulta
    const costStr = formData.consultationCost.trim();
    const cost = parseFloat(costStr);
    if (!costStr) {
      newErrors.consultationCost = "El costo de consulta es requerido";
    } else if (isNaN(cost) || cost < 0) {
      newErrors.consultationCost = "El costo de consulta debe ser mayor o igual a 0";
    } else if (cost > 999999) {
      newErrors.consultationCost = "El costo de consulta no puede superar los 6 dígitos";
    }

    // Nombre del consultorio
    const consultancyTrimmed = formData.consultancy.trim();
    if (!consultancyTrimmed) {
      newErrors.consultancy = "El nombre del consultorio es requerido";
    } else if (consultancyTrimmed.length < 2) {
      newErrors.consultancy = "El nombre del consultorio debe tener al menos 2 caracteres";
    } else if (consultancyTrimmed.length > 150) {
      newErrors.consultancy = "El nombre del consultorio no puede superar los 150 caracteres";
    } else if (!/^[A-Za-z\u00C0-\u00FF\s]+$/.test(consultancyTrimmed)) {
      newErrors.consultancy = "El nombre del consultorio solo puede contener letras y espacios";
    }

    // Número de habilitación
    const habilitationTrimmed = formData.habilitation.trim();
    if (!habilitationTrimmed) {
      newErrors.habilitation = "El número de habilitación es requerido";
    } else if (habilitationTrimmed.length < 5) {
      newErrors.habilitation = "El número de habilitación debe tener al menos 5 caracteres";
    } else if (habilitationTrimmed.length > 50) {
      newErrors.habilitation = "El número de habilitación no puede superar los 50 caracteres";
    }

    // Calle
    const streetTrimmed = formData.addressStreet.trim();
    if (!streetTrimmed) {
      newErrors.addressStreet = "La calle es requerida";
    } else if (streetTrimmed.length < 2) {
      newErrors.addressStreet = "La calle debe tener al menos 2 caracteres";
    } else if (streetTrimmed.length > 150) {
      newErrors.addressStreet = "La calle no puede superar los 150 caracteres";
    } else if (/\d/.test(streetTrimmed)) {
      newErrors.addressStreet = "La calle no puede contener números";
    }

    // Número de dirección (opcional)
    const numberTrimmed = formData.addressNumber.trim();
    if (numberTrimmed) {
      const num = parseInt(numberTrimmed);
      if (isNaN(num) || num <= 0) {
        newErrors.addressNumber = "El número debe ser un valor positivo";
      } else if (numberTrimmed.length > 5) {
        newErrors.addressNumber = "El número no puede superar los 5 dígitos";
      }
    }

    // Localidad
    const localidadTrimmed = formData.addressLocality.trim();
    if (!localidadTrimmed) {
      newErrors.addressLocality = "La localidad es requerida";
    } else if (localidadTrimmed.length < 2) {
      newErrors.addressLocality = "La localidad debe tener al menos 2 caracteres";
    } else if (localidadTrimmed.length > 100) {
      newErrors.addressLocality = "La localidad no puede superar los 100 caracteres";
    } else if (/\d/.test(localidadTrimmed)) {
      newErrors.addressLocality = "La localidad no puede contener números";
    }

    // Provincia
    if (!formData.province) {
      newErrors.province = "Tenés que seleccionar una provincia";
    }

    // Teléfono
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\d+$/.test(phoneTrimmed)) {
      newErrors.phone = "El teléfono solo puede contener números";
    } else if (phoneTrimmed.length < 8) {
      newErrors.phone = "El teléfono debe tener al menos 8 dígitos";
    } else if (phoneTrimmed.length > 20) {
      newErrors.phone = "El teléfono no puede superar los 20 dígitos";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register({
        nombre: formData.name,
        apellido: formData.lastName,
        email: formData.email.trim(),
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
          email: formData.email.trim(),
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
                <Stepper
                  steps={[
                    { number: 1, label: "Profesional" },
                    { number: 2, label: "Clínica" },
                  ]}
                  currentStep={step}
                />
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
                      error={errors.email}
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
                          <img src={eyeSlash} alt="Ocultar" className="w-5 h-5" />
                        ) : (
                          <img src={eyeOpen} alt="Mostrar" className="w-5 h-5" />
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
                          <img src={eyeSlash} alt="Ocultar" className="w-5 h-5" />
                        ) : (
                          <img src={eyeOpen} alt="Mostrar" className="w-5 h-5" />
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

                  <div className="md:col-span-2 mt-4">
                    <MultiSelect
                      label="Especies atendidas"
                      value={formData.animalTypes}
                      onChange={(value) => {
                        setFormData((prev) => ({ ...prev, animalTypes: value }));
                        if (value.length > 0) {
                          setErrors((e) => {
                            const n = { ...e };
                            delete n.animalTypes;
                            return n;
                          });
                        }
                      }}
                      placeholder="Seleccionar tipos de animales…"
                      error={errors.animalTypes}
                      options={ANIMAL_TYPES_OPTIONS.map((opt) => ({
                        value: opt,
                        label: opt,
                      }))}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <Select
                      label="Especialidad"
                      name="specialties"
                      value={formData.specialties}
                      onChange={(e) => handleSpecialtyChange(e.target.value)}
                      placeholder="Seleccionar especialidad…"
                      error={errors.specialties}
                      options={SPECIALTIES_OPTIONS.map((opt) => ({
                        value: opt,
                        label: opt,
                      }))}
                    />
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
                      disabled={isLoading}
                      error={errors.addressNumber}
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
                  <div className="md:col-span-2">
                    <Select
                      label="Provincia"
                      name="province"
                      value={formData.province}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      placeholder="Seleccionar provincia…"
                      error={errors.province}
                      options={PROVINCE_OPTIONS.map((opt) => ({
                        value: opt,
                        label: opt,
                      }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      label="Número de teléfono"
                      name="phone"
                      type="tel"
                      placeholder="11 9 12341234"
                      prefix={<img src={argentinaFlag} alt="Argentina" className="w-5 h-4" />}
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
