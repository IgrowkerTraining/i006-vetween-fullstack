import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import {
  ResponsibleFormFields,
  ResponsibleData,
  ResponsibleErrors,
  initialResponsibleData,
  validateResponsibleData,
} from "./ResponsibleFormFields";

export type { ResponsibleData };

interface EditResponsibleFormProps {
  onSubmit: (data: ResponsibleData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: ResponsibleData;
}

export const EditResponsibleForm: React.FC<EditResponsibleFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}) => {
  const [responsible, setResponsible] = useState<ResponsibleData>(
    initialData ?? initialResponsibleData,
  );
  const [errors, setErrors] = useState<ResponsibleErrors>({});

  useEffect(() => {
    if (initialData) {
      setResponsible(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setResponsible((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ResponsibleData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateResponsibleData(responsible);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(responsible);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ResponsibleFormFields
        data={responsible}
        errors={errors}
        onChange={handleChange}
      />
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
