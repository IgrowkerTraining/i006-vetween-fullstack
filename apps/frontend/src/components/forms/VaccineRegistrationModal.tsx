import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface VaccineRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (vaccineData: VaccineFormData) => void;
}

export interface VaccineFormData {
  nombre: string;
  tipoVacuna: string;
  fecha: string;
}

export const VaccineRegistrationModal: React.FC<VaccineRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VaccineFormData>({
    nombre: "",
    tipoVacuna: "",
    fecha: "",
  });

  const [errors, setErrors] = useState<Partial<VaccineFormData>>({});

  const handleChange = (field: keyof VaccineFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Limpiando error del campo cuando el usuario comienza a escribir
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
      // Aquí puede llamar onSave con los datos del formulario
      // o hacer cualquier otra lógica necesaria
      if (onSave) {
        onSave(formData);
      }
      
      // Limpiar el formulario después de guardar (opcional)
      setFormData({
        nombre: "",
        tipoVacuna: "",
        fecha: "",
      });
      
      // Cerrar el modal
      onClose();
    }
  };

  const handleCancel = () => {
    // Limpiar formulario al cancelar
    setFormData({
      nombre: "",
      tipoVacuna: "",
      fecha: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Registro de Vacunas"
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campo Nombre de Vacuna */}
        <Input
          label="Nombre"
          placeholder="Ingrese el nombre de la vacuna"
          value={formData.nombre}
          onChange={handleChange("nombre")}
          error={errors.nombre}
        />

        {/* Campo Tipo de Vacuna */}
        <Input
          label="Tipo de Vacina"
          placeholder="Ingrese el tipo de vacuna"
          value={formData.tipoVacuna}
          onChange={handleChange("tipoVacuna")}
          error={errors.tipoVacuna}
        />

        {/* Campo Fecha */}
        <Input
          label="Fecha"
          type="date"
          value={formData.fecha}
          onChange={handleChange("fecha")}
          error={errors.fecha}
        />

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
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
