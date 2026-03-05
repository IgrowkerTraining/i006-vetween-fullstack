import React from "react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { RadioGroup } from "../common/RadioGroup";
import { ESPECIES } from "../../constants/enums";

export interface PatientData {
  name: string;
  species: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  color: string;
  characteristic: string;
  sterilized: string;
  microchip: string;
  microchipNumber: string;
}

export const initialPatientData: PatientData = {
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

export type PatientErrors = Partial<Record<keyof PatientData, string>>;

export const validatePatientData = (data: PatientData): PatientErrors => {
  const errors: PatientErrors = {};
  if (!data.name.trim()) errors.name = "El nombre es requerido";
  if (!data.species) errors.species = "La especie es requerida";
  if (!data.breed.trim()) errors.breed = "La raza es requerida";
  if (!data.age.trim()) {
    errors.age = "La edad es requerida";
  } else if (
    !/^\d+$/.test(data.age.trim()) ||
    parseInt(data.age.trim(), 10) <= 0
  ) {
    errors.age = "La edad debe ser un número entero positivo";
  }
  if (!data.sex) errors.sex = "El sexo es requerido";
  const weightNormalized = data.weight.trim().replace(",", ".");
  if (!data.weight.trim()) {
    errors.weight = "El peso es requerido";
  } else if (
    isNaN(parseFloat(weightNormalized)) ||
    parseFloat(weightNormalized) <= 0
  ) {
    errors.weight = "El peso debe ser un número positivo";
  }
  if (!data.color.trim()) errors.color = "El color es requerido";
  if (!data.sterilized) errors.sterilized = "Este campo es requerido";
  if (!data.microchip) errors.microchip = "Este campo es requerido";
  if (data.microchip === "yes" && !data.microchipNumber.trim()) {
    errors.microchipNumber = "El número de microchip es requerido";
  }
  return errors;
};

const SPECIES_OPTIONS = ESPECIES as unknown as {
  value: string;
  label: string;
}[];

const SEX_OPTIONS = [
  { value: "Macho", label: "Macho" },
  { value: "Hembra", label: "Hembra" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
];

interface PatientFormFieldsProps {
  data: PatientData;
  errors: PatientErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onRadioChange: (name: keyof PatientData, value: string) => void;
}

export const PatientFormFields: React.FC<PatientFormFieldsProps> = ({
  data,
  errors,
  onChange,
  onRadioChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Datos básicos */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
          Datos básicos
        </h3>
        <Input
          label="Nombre *"
          name="name"
          placeholder="Nombre del paciente"
          value={data.name}
          onChange={onChange}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Especie *"
            name="species"
            options={SPECIES_OPTIONS}
            value={data.species}
            onChange={onChange}
            placeholder="Seleccionar especie"
            error={errors.species}
          />
          <Input
            label="Raza *"
            name="breed"
            placeholder="Raza del paciente"
            value={data.breed}
            onChange={onChange}
            error={errors.breed}
          />
        </div>
      </section>

      {/* Datos biológicos */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
          Datos biológicos
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Edad *"
            name="age"
            placeholder="Ej: 3"
            value={data.age}
            onChange={onChange}
            error={errors.age}
          />
          <RadioGroup
            label="Sexo *"
            name="sex"
            options={SEX_OPTIONS}
            value={data.sex}
            onChange={(value) => onRadioChange("sex", value)}
            error={errors.sex}
          />
        </div>
      </section>

      {/* Características físicas */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
          Características físicas
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Peso *"
            name="weight"
            placeholder="Ej. 4.5"
            value={data.weight}
            onChange={onChange}
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
            value={data.color}
            onChange={onChange}
            error={errors.color}
          />
        </div>
        <Input
          label="Seña / Característica"
          name="characteristic"
          placeholder="Características distintivas"
          value={data.characteristic}
          onChange={onChange}
        />
      </section>

      {/* Condiciones clínicas */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
          Condiciones clínicas
        </h3>
        <div className="grid grid-cols-2 gap-3 items-start">
          <RadioGroup
            label="Esterilizado *"
            name="sterilized"
            options={YES_NO_OPTIONS}
            value={data.sterilized}
            onChange={(value) => onRadioChange("sterilized", value)}
            error={errors.sterilized}
          />
          <div className="space-y-2">
            <RadioGroup
              label="Microchip *"
              name="microchip"
              options={YES_NO_OPTIONS}
              value={data.microchip}
              onChange={(value) => onRadioChange("microchip", value)}
              error={errors.microchip}
            />
            {data.microchip === "yes" && (
              <div className="space-y-2">
                <Input
                  name="microchipNumber"
                  placeholder="Número de microchip"
                  value={data.microchipNumber}
                  onChange={onChange}
                  error={errors.microchipNumber}
                />
                {data.microchipNumber && (
                  <div className="bg-indigo-100 text-indigo-800 font-semibold px-4 py-2.5 rounded-xl text-sm">
                    Número: {data.microchipNumber}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
