import React, { useState, useEffect } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { RadioGroup } from "../common/RadioGroup";
import { Select } from "../common/Select";
import { Stepper } from "../common/Stepper";

// Types
interface PatientData {
  // Datos básicos
  name: string;
  species: string;
  breed: string;
  // Datos biológicos
  age: string;
  sex: string;
  // Características físicas
  weight: string;
  color: string;
  characteristic: string;
  // Condiciones clínicas
  sterilized: string;
  microchip: string;
  microchipNumber: string;
}

interface ResponsibleData {
  firstName: string;
  lastName: string;
  email: string;
  // Dirección
  street: string;
  number: string;
  locality: string;
  province: string;
  // Contacto
  phone: string;
  relationship: string;
}

export interface PatientFormData {
  patient: PatientData;
  responsible: ResponsibleData;
}

export type PatientFormMode = "create" | "edit";

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onStepChange?: (step: number) => void;
  /** Si se provee, el formulario entra en modo edición */
  initialData?: PatientFormData;
  /** Callback para notificar el modo actual (útil para el título del modal) */
  onModeChange?: (mode: PatientFormMode) => void;
}

// Constants
const STEPS = [
  { number: 1, label: "Paciente" },
  { number: 2, label: "Responsable" },
];

const SEX_OPTIONS = [
  { value: "male", label: "Macho" },
  { value: "female", label: "Hembra" },
];

// TODO: Estas opciones vendrán del backend
const SPECIES_OPTIONS = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "bird", label: "Ave" },
  { value: "rabbit", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "reptile", label: "Reptil" },
  { value: "other", label: "Otro" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
];

// TODO: Estas opciones vendrán del backend
const PROVINCE_OPTIONS = [
  { value: "buenos_aires", label: "Buenos Aires" },
  { value: "cordoba", label: "Córdoba" },
  { value: "santa_fe", label: "Santa Fe" },
  { value: "mendoza", label: "Mendoza" },
  { value: "tucuman", label: "Tucumán" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "owner", label: "Dueño" },
  { value: "tutor", label: "Tutor" },
  { value: "caretaker", label: "Cuidador" },
];

// Initial state
const initialPatientData: PatientData = {
  name: "",
  species: "",
  breed: "",
  age: "",
  sex: "",
  weight: "",
  color: "",
  characteristic: "",
  sterilized: "",
  microchip: "",
  microchipNumber: "",
};

const initialResponsibleData: ResponsibleData = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  number: "",
  locality: "",
  province: "",
  phone: "",
  relationship: "",
};

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  onStepChange,
  initialData,
  onModeChange,
}) => {
  const mode: PatientFormMode = initialData ? "edit" : "create";
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState<PatientData>(
    initialData?.patient ?? initialPatientData,
  );
  const [responsible, setResponsible] = useState<ResponsibleData>(
    initialData?.responsible ?? initialResponsibleData,
  );

  // Notificar modo al padre
  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  // Actualizar datos si cambia initialData (útil para edición)
  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patient);
      setResponsible(initialData.responsible);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<PatientData & ResponsibleData>>(
    {},
  );

  // Handlers
  const handlePatientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof PatientData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePatientRadioChange = (name: keyof PatientData, value: string) => {
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResponsibleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setResponsible((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ResponsibleData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validation
  const validateStep1 = (): boolean => {
    const newErrors: Partial<PatientData> = {};

    // Datos básicos
    if (!patient.name.trim()) newErrors.name = "El nombre es requerido";
    if (!patient.species) newErrors.species = "La especie es requerida";
    if (!patient.breed.trim()) newErrors.breed = "La raza es requerida";
    // Datos biológicos
    if (!patient.age.trim()) newErrors.age = "La edad es requerida";
    if (!patient.sex) newErrors.sex = "El sexo es requerido";
    // Características físicas
    if (!patient.weight.trim()) newErrors.weight = "El peso es requerido";
    if (!patient.color.trim()) newErrors.color = "El color es requerido";
    // Condiciones clínicas
    if (!patient.sterilized) newErrors.sterilized = "Este campo es requerido";
    if (!patient.microchip) newErrors.microchip = "Este campo es requerido";
    if (patient.microchip === "yes" && !patient.microchipNumber.trim()) {
      newErrors.microchipNumber = "El número de microchip es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<ResponsibleData> = {};

    // Datos personales
    if (!responsible.firstName.trim())
      newErrors.firstName = "El nombre es requerido";
    if (!responsible.lastName.trim())
      newErrors.lastName = "El apellido es requerido";
    if (!responsible.email.trim()) newErrors.email = "El email es requerido";
    // Dirección
    if (!responsible.street.trim()) newErrors.street = "La calle es requerida";
    if (!responsible.number.trim()) newErrors.number = "El número es requerido";
    if (!responsible.locality.trim())
      newErrors.locality = "La localidad es requerida";
    if (!responsible.province) newErrors.province = "La provincia es requerida";
    // Contacto
    if (!responsible.phone.trim()) newErrors.phone = "El teléfono es requerido";
    if (!responsible.relationship)
      newErrors.relationship = "La relación es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      onStepChange?.(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    onStepChange?.(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      onSubmit({ patient, responsible });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={currentStep} />

      {/* Step 1: Patient Data */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Datos básicos */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Datos básicos
            </h3>
            <Input
              label="Nombre *"
              name="name"
              placeholder="Nombre del paciente"
              value={patient.name}
              onChange={handlePatientChange}
              error={errors.name}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Especie *"
                name="species"
                options={SPECIES_OPTIONS}
                value={patient.species}
                onChange={handlePatientChange}
                placeholder="Seleccionar especie"
                error={errors.species}
              />
              <Input
                label="Raza *"
                name="breed"
                placeholder="Raza del paciente"
                value={patient.breed}
                onChange={handlePatientChange}
                error={errors.breed}
              />
            </div>
          </section>

          {/* Datos biológicos */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Datos biológicos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Edad *"
                name="age"
                placeholder="Ej: 3 años"
                value={patient.age}
                onChange={handlePatientChange}
                error={errors.age}
              />
              <RadioGroup
                label="Sexo *"
                name="sex"
                options={SEX_OPTIONS}
                value={patient.sex}
                onChange={(value) => handlePatientRadioChange("sex", value)}
                error={errors.sex}
              />
            </div>
          </section>

          {/* Características físicas */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">
              Características físicas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Peso *"
                name="weight"
                placeholder="Ej. 4,5"
                value={patient.weight}
                onChange={handlePatientChange}
                error={errors.weight}
                suffix={
                  <span className="absolute right-0 top-0 h-full flex items-center px-3 bg-indigo-600 text-white text-sm font-bold rounded-r-lg pointer-events-none">
                    kg
                  </span>
                }
              />
              <Input
                label="Color *"
                name="color"
                placeholder="Color del pelaje"
                value={patient.color}
                onChange={handlePatientChange}
                error={errors.color}
              />
            </div>
            <Input
              label="Seña / Característica"
              name="characteristic"
              placeholder="Características distintivas"
              value={patient.characteristic}
              onChange={handlePatientChange}
            />
          </section>

          {/* Condiciones clínicas */}
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900 text-center">
              Condiciones clínicas
            </h3>
            <div className="grid grid-cols-2 gap-3 items-start">
              <RadioGroup
                label="Esterilizado *"
                name="sterilized"
                options={YES_NO_OPTIONS}
                value={patient.sterilized}
                onChange={(value) =>
                  handlePatientRadioChange("sterilized", value)
                }
                error={errors.sterilized}
              />
              <div className="space-y-2">
                <RadioGroup
                  label="Microchip *"
                  name="microchip"
                  options={YES_NO_OPTIONS}
                  value={patient.microchip}
                  onChange={(value) =>
                    handlePatientRadioChange("microchip", value)
                  }
                  error={errors.microchip}
                />
                {patient.microchip === "yes" && (
                  <div className="space-y-2">
                    <Input
                      name="microchipNumber"
                      placeholder="Número de microchip"
                      value={patient.microchipNumber}
                      onChange={handlePatientChange}
                      error={errors.microchipNumber}
                    />
                    {patient.microchipNumber && (
                      <div className="bg-indigo-100 text-indigo-800 font-semibold px-4 py-2.5 rounded-xl text-sm">
                        Número: {patient.microchipNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Actions Step 1 */}
          <div className="flex justify-end pt-4">
            <Button type="button" variant="primary" onClick={handleNext}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Responsible Data */}
      {currentStep === 2 && (
        <div className="space-y-5">
          <section className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre *"
                name="firstName"
                placeholder="Nombre"
                value={responsible.firstName}
                onChange={handleResponsibleChange}
                error={errors.firstName}
              />
              <Input
                label="Apellido *"
                name="lastName"
                placeholder="Apellido"
                value={responsible.lastName}
                onChange={handleResponsibleChange}
                error={errors.lastName}
              />
            </div>
            <Input
              label="Email *"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={responsible.email}
              onChange={handleResponsibleChange}
              error={errors.email}
            />
          </section>

          {/* Dirección */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
              Dirección
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Calle / Avenida *"
                name="street"
                placeholder="Nombre de la calle"
                value={responsible.street}
                onChange={handleResponsibleChange}
                error={errors.street}
              />
              <Input
                label="Número *"
                name="number"
                placeholder="Número"
                value={responsible.number}
                onChange={handleResponsibleChange}
                error={errors.number}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Localidad *"
                name="locality"
                placeholder="Localidad"
                value={responsible.locality}
                onChange={handleResponsibleChange}
                error={errors.locality}
              />
              <Select
                label="Provincia *"
                name="province"
                options={PROVINCE_OPTIONS}
                value={responsible.province}
                onChange={handleResponsibleChange}
                placeholder="Seleccionar provincia"
                error={errors.province}
              />
            </div>
          </section>

          {/* Contacto */}
          <section className="space-y-3">
            <Input
              label="Teléfono *"
              name="phone"
              placeholder="+54 11 1234 5678"
              value={responsible.phone}
              onChange={handleResponsibleChange}
              error={errors.phone}
            />
            <Select
              label="Relación con el animal *"
              name="relationship"
              options={RELATIONSHIP_OPTIONS}
              value={responsible.relationship}
              onChange={handleResponsibleChange}
              placeholder="Seleccionar relación"
              error={errors.relationship}
            />
          </section>

          {/* Actions Step 2 */}
          <div className="flex justify-between pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={handleBack}>
              Atrás
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
