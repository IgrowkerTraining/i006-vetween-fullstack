import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { User } from "../types";
import { getSecurityTip } from "../services/service";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.svg";
import onlylogo from "../assets/onlylogo.svg"

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
    specialties: [] as string[],
    consultancy: "",
    habilitation: "",
    animalTypes: [] as string[],
    consultationCost: "",
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          specialties: [...prev.specialties, value],
        };
      } else {
        return {
          ...prev,
          specialties: prev.specialties.filter((item) => item !== value),
        };
      }
    });
  };

  const handleAnimalTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          animalTypes: [...prev.animalTypes, value],
        };
      } else {
        return {
          ...prev,
          animalTypes: prev.animalTypes.filter((item) => item !== value),
        };
      }
    });
  };

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [securityTip, setSecurityTip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError(null);

    const newErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        registration: formData.registration,
        specialties: formData.specialties,
        consultancy: formData.consultancy,
        habilitation: formData.habilitation,
      });
      login(response.user);
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <h1 className="text-3xl font-bold text-[#0b1001] mb-1">
                Crear cuenta
              </h1>
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
              onSubmit={(e) => { e.preventDefault(); setStep(2); }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h2 className="font-bold text-[#0b1001] mb-1">
                Datos Básicos
              </h2>
              <div className="md:col-span-2">
                <Input
                  label="Nombre"
                  name="name"
                  placeholder="Nombre"
                  required
                  disabled={isLoading}
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
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                error={errors.password}
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                error={errors.confirmPassword}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <Input
                  label="Número de Matrícula"
                  name="registration"
                  placeholder="Matrícula"
                  required
                  disabled={isLoading}
                  value={formData.registration}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-semibold text-[#0b1001] mb-1">
                  Especialidad
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Seleccioná todas las que correspondan
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Clínica general",
                    "Medicina preventiva",
                    "Cirugía general",
                    "Odontología",
                    "Nutrición",
                    "Dermatología",
                    "Diagnóstico",
                    "Urgencias leves",
                    "Otra",
                  ].map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 accent-indigo-600"
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <button type="submit" className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/20 mb-5 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  Siguiente
                </button>
              </div>

            </form>
            )}

            {step === 2 && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <h2 className="font-bold text-[#0b1001] mb-1">
                Datos Consultorio
              </h2>
              <div className="md:col-span-2">
                <Input
                  label="Nombre Consultorio"
                  name="consultancy"
                  placeholder="Consultorio"
                  required
                  disabled={isLoading}
                  value={formData.consultancy}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Número Habilitación"
                  name="habilitation"
                  placeholder="Número Habilitación"
                  required
                  disabled={isLoading}
                  value={formData.habilitation}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-semibold text-[#0b1001] mb-1">
                  Tipos de animales atendidos
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Seleccioná todas las que correspondan
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Perros",
                    "Gatos",
                    "Conejos",
                    "Hámster",
                    "Otro",
                  ].map((animal) => (
                    <label
                      key={animal}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        value={animal}
                        checked={formData.animalTypes.includes(animal)}
                        onChange={handleAnimalTypeChange}
                        className="w-4 h-4 accent-indigo-600"
                      />
                      {animal}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <Input
                  label="Costo de consulta"
                  name="consultationCost"
                  type="number"
                  placeholder="Ej: 5000"
                  disabled={isLoading}
                  value={formData.consultationCost}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-500/20 mb-5 bg-slate-700 hover:bg-slate-600 text-white">
                  Atrás
                </button>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Crear Cuenta
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
                  Iniciá sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
