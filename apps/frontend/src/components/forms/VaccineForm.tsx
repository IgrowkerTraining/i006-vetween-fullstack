import React, { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface VaccineFormProps {
  onClose: () => void;
  onSave?: (vaccineData: VaccineFormData) => void;
}

export interface VaccineFormData {
  nombre_cientifico: string;
  tipoVacuna: string;
  fecha: string;
  observaciones: string;
}

export const VaccineForm: React.FC<VaccineFormProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VaccineFormData>({
    nombre_cientifico: "",
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

    if (!formData.nombre_cientifico.trim()) {
      newErrors.nombre_cientifico = "El nombre científico es requerido";
    } else if (!/[A-Za-z\u00C0-\u00FF]/.test(formData.nombre_cientifico)) {
      newErrors.nombre_cientifico =
        "El nombre científico debe contener al menos una letra";
    } else if (formData.nombre_cientifico.length < 2) {
      newErrors.nombre_cientifico =
        "El nombre científico debe tener al menos 2 caracteres";
    } else if (formData.nombre_cientifico.length > 150) {
      newErrors.nombre_cientifico =
        "El nombre científico no puede superar los 150 caracteres";
    }
    if (!formData.tipoVacuna.trim()) {
      newErrors.tipoVacuna = "El tipo de vacuna es requerido";
    } else if (!/^[A-Za-z\u00C0-\u00FF\d\s.,:]+$/.test(formData.tipoVacuna)) {
      newErrors.tipoVacuna =
        "El tipo de vacuna solo puede contener letras, números, espacios y los caracteres . , :";
    } else if (!/[A-Za-z\u00C0-\u00FF]/.test(formData.tipoVacuna)) {
      newErrors.tipoVacuna = "El tipo de vacuna debe contener al menos una letra";
    } else if (formData.tipoVacuna.length < 2) {
      newErrors.tipoVacuna = "El tipo debe tener al menos 2 caracteres";
    } else if (formData.tipoVacuna.length > 100) {
      newErrors.tipoVacuna = "El tipo no puede superar los 100 caracteres";
    }
    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    } else if (formData.fecha > new Date().toISOString().slice(0, 10)) {
      newErrors.fecha = "La fecha de aplicación no puede ser futura";
    }
    if (formData.observaciones.trim()) {
      if (!/^[A-Za-z\u00C0-\u00FF\s\d.,:]*$/.test(formData.observaciones)) {
        newErrors.observaciones =
          "Las observaciones solo pueden contener letras, números, espacios y los caracteres . , :";
      } else if (!/[A-Za-z\u00C0-\u00FF]/.test(formData.observaciones)) {
        newErrors.observaciones = "Las observaciones deben contener al menos una letra";
      } else if (formData.observaciones.trim().length > 200) {
        newErrors.observaciones = "Las observaciones no pueden superar los 200 caracteres";
      }
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
        nombre_cientifico: "",
        tipoVacuna: "",
        fecha: "",
        observaciones: "",
      });

      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre_cientifico: "",
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
        label="Tipo de Vacuna"
        placeholder="Ingrese el tipo de vacuna"
        value={formData.tipoVacuna}
        onChange={handleChange("tipoVacuna")}
        error={errors.tipoVacuna}
      />

      {/* Campo Nombre Cientifico */}
      <Input
        label="Nombre cientifico"
        placeholder="Ingrese el nombre cientifico de la vacuna"
        value={formData.nombre_cientifico}
        onChange={handleChange("nombre_cientifico")}
        error={errors.nombre_cientifico}
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
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, observaciones: e.target.value }));
            if (errors.observaciones) {
              setErrors((prev) => ({ ...prev, observaciones: undefined }));
            }
          }}
          rows={3}
          className={`w-full bg-white border rounded-lg px-3 py-2.5 text-indigo-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none ${errors.observaciones ? "border-red-500" : "border-slate-700"}`}
        />
        {errors.observaciones && (
          <p className="text-xs text-red-500 mt-0.5">{errors.observaciones}</p>
        )}
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
