import React, { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

// Types
export interface ClinicalVisitFormData {
  date: string;
  reason: string;
  diagnosis: string;
  treatments: string;
  observaciones: string;
  hasPreviousHistory: boolean;
  previousHistory: string;
}

interface ClinicalVisitFormProps {
  onSubmit: (data: ClinicalVisitFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: ClinicalVisitFormData;
}

// Initial state
const initialFormData: ClinicalVisitFormData = {
  date: "",
  reason: "",
  diagnosis: "",
  treatments: "",
  observaciones: "",
  hasPreviousHistory: false,
  previousHistory: "",
};

export const ClinicalVisitForm: React.FC<ClinicalVisitFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}) => {
  const [formData, setFormData] = useState<ClinicalVisitFormData>(
    initialData ?? initialFormData,
  );
  const [fieldErrors, setFieldErrors] = useState<{
    date?: string;
    reason?: string;
    diagnosis?: string;
    treatments?: string;
    observaciones?: string;
  }>({});

  const LETTERS_SPACES_RE = /^[A-Za-z\u00C0-\u00FF\s]*$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "date") {
      let err: string | undefined;
      if (!value) err = "La fecha es requerida";
      else if (value > new Date().toISOString().slice(0, 10))
        err = "La fecha de la visita no puede ser futura";
      setFieldErrors((prev) => ({ ...prev, date: err }));
    }

    if (name === "reason") {
      let err: string | undefined;
      if (!value.trim()) err = "El motivo de consulta es requerido";
      else if (value.trim().length < 2) err = "El motivo debe tener al menos 2 caracteres";
      else if (value.length > 200) err = "El motivo no puede superar los 200 caracteres";
      setFieldErrors((prev) => ({ ...prev, reason: err }));
    }

    if (["diagnosis", "treatments", "observaciones"].includes(name)) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]:
          value && !LETTERS_SPACES_RE.test(value)
            ? "Solo puede contener letras y espacios"
            : undefined,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      hasPreviousHistory: checked,
      // Limpiar el historial si se desmarca
      previousHistory: checked ? prev.previousHistory : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldErrors = {};
    if (!formData.date) errors.date = "La fecha es requerida";
    else if (formData.date > new Date().toISOString().slice(0, 10))
      errors.date = "La fecha de la visita no puede ser futura";
    if (!formData.reason.trim()) errors.reason = "El motivo de consulta es requerido";
    else if (formData.reason.trim().length < 2) errors.reason = "El motivo debe tener al menos 2 caracteres";
    else if (formData.reason.length > 200) errors.reason = "El motivo no puede superar los 200 caracteres";
    if (fieldErrors.diagnosis) errors.diagnosis = fieldErrors.diagnosis;
    if (fieldErrors.treatments) errors.treatments = fieldErrors.treatments;
    if (fieldErrors.observaciones) errors.observaciones = fieldErrors.observaciones;
    if (Object.values(errors).some(Boolean)) {
      setFieldErrors(errors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Fecha */}
      <Input
        type="date"
        label="Fecha"
        name="date"
        value={formData.date}
        onChange={handleChange}
        error={fieldErrors.date}
      />

      {/* Motivo de consulta */}
      <Input
        as="textarea"
        rows={3}
        label="Motivo de consulta"
        name="reason"
        placeholder="Describe el motivo de la consulta..."
        value={formData.reason}
        onChange={handleChange}
        error={fieldErrors.reason}
      />

      {/* Diagnóstico */}
      <Input
        as="textarea"
        rows={3}
        label="Diagnóstico"
        name="diagnosis"
        placeholder="Diagnóstico realizado..."
        value={formData.diagnosis}
        onChange={handleChange}
        error={fieldErrors.diagnosis}
      />

      {/* Tratamientos */}
      <Input
        as="textarea"
        rows={3}
        label="Tratamientos"
        name="treatments"
        placeholder="Tratamientos prescritos..."
        value={formData.treatments}
        onChange={handleChange}
        error={fieldErrors.treatments}
      />

      {/* Observaciones */}
      <Input
        as="textarea"
        rows={3}
        label="Observaciones"
        name="observaciones"
        placeholder="Observaciones adicionales..."
        value={formData.observaciones}
        onChange={handleChange}
        error={fieldErrors.observaciones}
      />

      {/* Historial previo - Checkbox condicional */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="hasPreviousHistory"
            checked={formData.hasPreviousHistory}
            onChange={handleCheckboxChange}
            className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700">
            Tengo historial previo
          </span>
        </label>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between pt-4 border-t border-slate-700">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Guardar
        </Button>
      </div>
    </form>
  );
};
