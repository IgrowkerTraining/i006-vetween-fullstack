import React from "react";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { PROVINCIAS } from "../../constants/enums";

export interface ResponsibleData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  number: string;
  locality: string;
  province: string;
  phone: string;
  relationship: string;
}

export const initialResponsibleData: ResponsibleData = {
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

export type ResponsibleErrors = Partial<Record<keyof ResponsibleData, string>>;

export const validateResponsibleData = (
  data: ResponsibleData,
): ResponsibleErrors => {
  const errors: ResponsibleErrors = {};
  if (!data.firstName.trim()) errors.firstName = "El nombre es requerido";
  if (!data.lastName.trim()) errors.lastName = "El apellido es requerido";
  if (!data.email.trim()) {
    errors.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "El formato de email no es válido";
  }
  if (!data.street.trim()) errors.street = "La calle es requerida";
  if (!data.number.trim()) errors.number = "El número es requerido";
  if (!data.locality.trim()) errors.locality = "La localidad es requerida";
  if (!data.province) errors.province = "La provincia es requerida";
  if (!data.phone.trim()) errors.phone = "El teléfono es requerido";
  if (!data.relationship) errors.relationship = "La relación es requerida";
  return errors;
};

const PROVINCE_OPTIONS = PROVINCIAS as unknown as {
  value: string;
  label: string;
}[];

const RELATIONSHIP_OPTIONS = [
  { value: "Dueño/a", label: "Dueño/a" },
  { value: "Tutor/a", label: "Tutor/a" },
  { value: "Cuidador/a", label: "Cuidador/a" },
];

interface ResponsibleFieldsProps {
  data: ResponsibleData;
  errors: ResponsibleErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const ResponsibleFields: React.FC<ResponsibleFieldsProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nombre *"
            name="firstName"
            placeholder="Nombre"
            value={data.firstName}
            onChange={onChange}
            error={errors.firstName}
          />
          <Input
            label="Apellido *"
            name="lastName"
            placeholder="Apellido"
            value={data.lastName}
            onChange={onChange}
            error={errors.lastName}
          />
        </div>
        <Input
          label="Email *"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={data.email}
          onChange={onChange}
          error={errors.email}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">
          Dirección
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Calle / Avenida *"
            name="street"
            placeholder="Nombre de la calle"
            value={data.street}
            onChange={onChange}
            error={errors.street}
          />
          <Input
            label="Número *"
            name="number"
            placeholder="Número"
            value={data.number}
            onChange={onChange}
            error={errors.number}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Localidad *"
            name="locality"
            placeholder="Localidad"
            value={data.locality}
            onChange={onChange}
            error={errors.locality}
          />
          <Select
            label="Provincia *"
            name="province"
            options={PROVINCE_OPTIONS}
            value={data.province}
            onChange={onChange}
            placeholder="Seleccionar provincia"
            error={errors.province}
          />
        </div>
      </section>

      <section className="space-y-3">
        <Input
          label="Teléfono *"
          name="phone"
          placeholder="+54 11 1234 5678"
          value={data.phone}
          onChange={onChange}
          error={errors.phone}
        />
        <Select
          label="Relación con el animal *"
          name="relationship"
          options={RELATIONSHIP_OPTIONS}
          value={data.relationship}
          onChange={onChange}
          placeholder="Seleccionar relación"
          error={errors.relationship}
        />
      </section>
    </div>
  );
};
