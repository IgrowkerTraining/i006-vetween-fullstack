import React, { useState } from "react";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import {
  PatientForm,
  PatientFormData,
  PatientFormMode,
} from "../components/forms/PatientForm";

// Datos de ejemplo para modo edición
const mockPatientData: PatientFormData = {
  patient: {
    name: "Firulais",
    species: "dog",
    breed: "Labrador",
    age: "5 años",
    sex: "male",
    weight: "25 kg",
    color: "Dorado",
    characteristic: "Mancha blanca en el pecho",
    sterilized: "yes",
    microchip: "yes",
    microchipNumber: "1234567890",
  },
  responsible: {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@email.com",
    street: "Av. Corrientes",
    number: "1234",
    locality: "CABA",
    province: "buenos_aires",
    phone: "+54 11 1234 5678",
    relationship: "owner",
  },
};

const DevPlayground: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formMode, setFormMode] = useState<PatientFormMode>("create");
  const [editData, setEditData] = useState<PatientFormData | undefined>(
    undefined,
  );

  const handleOpenCreateModal = () => {
    setEditData(undefined);
    setCurrentFormStep(1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setEditData(mockPatientData);
    setCurrentFormStep(1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitPatient = (data: PatientFormData) => {
    setIsLoading(true);
    console.log(
      `${formMode === "create" ? "POST" : "PUT"} - Patient data:`,
      data,
    );

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(false);
      alert(
        formMode === "create"
          ? "Paciente creado exitosamente!"
          : "Paciente actualizado exitosamente!",
      );
    }, 1500);
  };

  // Generar título dinámico basado en modo y paso
  const getModalTitle = () => {
    const action = formMode === "create" ? "Registro" : "Editar";
    const entity = currentFormStep === 1 ? "Paciente" : "Responsable";
    return `${action} - ${entity}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">
              DEV ONLY
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100">
            Component Playground
          </h1>
          <p className="text-slate-400 mt-2">
            Página de desarrollo para probar componentes de forma aislada.
          </p>
        </div>

        {/* Components Section */}
        <div className="space-y-8">
          {/* Modal + PatientForm Demo */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Modal + PatientForm (Multi-step)
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Formulario de registro de paciente en 2 pasos: datos del paciente
              y datos del responsable.
            </p>

            <div className="flex gap-3">
              <Button onClick={handleOpenCreateModal} variant="primary">
                Registrar Paciente (POST)
              </Button>
              <Button onClick={handleOpenEditModal} variant="outline">
                Editar Paciente (PUT)
              </Button>
            </div>

            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              title={getModalTitle()}
              size="lg"
            >
              <PatientForm
                onSubmit={handleSubmitPatient}
                onCancel={handleCloseModal}
                isLoading={isLoading}
                onStepChange={setCurrentFormStep}
                initialData={editData}
                onModeChange={setFormMode}
              />
            </Modal>
          </section>

          {/* Modal Sizes Demo */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Modal - Diferentes Tamaños
            </h2>
            <div className="flex flex-wrap gap-3">
              <ModalSizeDemo size="sm" label="Small" />
              <ModalSizeDemo size="md" label="Medium" />
              <ModalSizeDemo size="lg" label="Large" />
              <ModalSizeDemo size="xl" label="Extra Large" />
            </div>
          </section>

          {/* Buttons Demo */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Buttons
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Helper component for modal size demo
const ModalSizeDemo: React.FC<{
  size: "sm" | "md" | "lg" | "xl";
  label: string;
}> = ({ size, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        {label}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Modal ${label}`}
        size={size}
      >
        <p className="text-slate-300">
          Este es un modal de tamaño <strong>{label}</strong>.
        </p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DevPlayground;
