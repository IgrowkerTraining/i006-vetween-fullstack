import React, { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface VaccineFormProps {
  onClose: () => void;
  onSave?: (vaccineData: VaccineFormData) => void;
}

export interface VaccineFormData {
  nombre: string;
  tipoVacuna: string;
  fecha: string;
  observaciones: string;
}

export const VaccineForm: React.FC<VaccineFormProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VaccineFormData>({
    nombre: "",
    tipoVacuna: "",
    fecha: "",
    observaciones: "",
  });

  const [errors, setErrors] = useState<Partial<VaccineFormData>>({});

  const handleChange =
    (field: keyof VaccineFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<VaccineFormData> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.tipoVacuna.trim()) {
      newErrors.tipoVacuna = "El tipo de vacuna es requerido";
    }
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (onSave) {
        onSave(formData);
      }

      setFormData({
        nombre: "",
        tipoVacuna: "",
        fecha: "",
        observaciones: "",
      });

      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: "",
      tipoVacuna: "",
      fecha: "",
      observaciones: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Campo Fecha */}
      <Input
        label="Fecha"
        type="date"
        value={formData.fecha}
        onChange={handleChange("fecha")}
        error={errors.fecha}
      />

      {/* Campo Tipo de Vacuna */}
      <Input
        label="Tipo de Vacina"
        placeholder="Ingrese el tipo de vacuna"
        value={formData.tipoVacuna}
        onChange={handleChange("tipoVacuna")}
        error={errors.tipoVacuna}
      />

      {/* Campo Nombre de Vacuna */}
      <Input
        label="Nombre"
        placeholder="Ingrese el nombre de la vacuna"
        value={formData.nombre}
        onChange={handleChange("nombre")}
        error={errors.nombre}
      />

      {/* Campo Observaciones */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="block text-sm font-semibold text-[#0b1001] mb-1">
          Observaciones
        </label>
        <textarea
          name="observaciones"
          placeholder="Ingrese observaciones adicionales sobre la vacuna"
          value={formData.observaciones}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
          }
          rows={3}
          className="w-full bg-white border border-slate-700 rounded-lg px-3 py-2.5 text-indigo-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 mt-2 border-t border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          Guardar
        </Button>
      </div>
    </form>
  );
};
