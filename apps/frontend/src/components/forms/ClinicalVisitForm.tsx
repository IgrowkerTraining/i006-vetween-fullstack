import React, { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

// Types
export interface ClinicalVisitFormData {
  date: string;
  reason: string;
  diagnosis: string;
  treatments: string;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Fecha */}
      <Input
        type="date"
        label="Fecha"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
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
        required
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
        required
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
          <span className="text-sm font-medium text-slate-200">
            Tengo historial previo
          </span>
        </label>

        {/* Textarea condicional - solo aparece cuando el checkbox está marcado */}
        {formData.hasPreviousHistory && (
          <Input
            as="textarea"
            rows={4}
            label="Historial previo"
            name="previousHistory"
            placeholder="Describe el historial clínico previo..."
            value={formData.previousHistory}
            onChange={handleChange}
          />
        )}
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
