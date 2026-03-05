import React, { useState, useEffect } from "react";
import { Button } from "../common/Button";
import { Stepper } from "../common/Stepper";
import {
  PatientFormFields,
  PatientData,
  PatientErrors,
  initialPatientData,
  validatePatientData,
} from "./PatientFormFields";
import {
  ResponsibleFormFields,
  ResponsibleData,
  ResponsibleErrors,
  initialResponsibleData,
  validateResponsibleData,
} from "./ResponsibleFormFields";

export interface PatientFormData {
  patient: PatientData;
  responsible: ResponsibleData;
}

interface EditPatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: PatientFormData;
}

const STEPS = [
  { number: 1, label: "Responsable" },
  { number: 2, label: "Paciente" },
];

export const EditPatientForm: React.FC<EditPatientFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patient, setPatient] = useState<PatientData>(
    initialData?.patient ?? initialPatientData,
  );
  const [responsible, setResponsible] = useState<ResponsibleData>(
    initialData?.responsible ?? initialResponsibleData,
  );
  const [patientErrors, setPatientErrors] = useState<PatientErrors>({});
  const [responsibleErrors, setResponsibleErrors] = useState<ResponsibleErrors>(
    {},
  );

  useEffect(() => {
    if (initialData) {
      setPatient(initialData.patient);
      setResponsible(initialData.responsible);
    }
  }, [initialData]);

  const handlePatientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (patientErrors[name as keyof PatientData]) {
      setPatientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePatientRadioChange = (name: keyof PatientData, value: string) => {
    setPatient((prev) => ({ ...prev, [name]: value }));
    if (patientErrors[name]) {
      setPatientErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleResponsibleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setResponsible((prev) => ({ ...prev, [name]: value }));
    if (responsibleErrors[name as keyof ResponsibleData]) {
      setResponsibleErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNext = () => {
    const errors = validateResponsibleData(responsible);
    setResponsibleErrors(errors);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePatientData(patient);
    setPatientErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit({ patient, responsible });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Stepper steps={STEPS} currentStep={currentStep} />

      {currentStep === 1 && (
        <div className="space-y-5">
          <ResponsibleFormFields
            data={responsible}
            errors={responsibleErrors}
            onChange={handleResponsibleChange}
          />
          <div className="flex justify-end pt-4">
            <Button type="button" variant="primary" onClick={handleNext}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <PatientFormFields
            data={patient}
            errors={patientErrors}
            onChange={handlePatientChange}
            onRadioChange={handlePatientRadioChange}
          />
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
