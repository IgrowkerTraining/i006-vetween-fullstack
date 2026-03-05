import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { PatientForm, PatientFormData, PatientFormMode } from "./PatientForm";
import { api } from "../../services/api";
import pawIconPlus from "../../assets/pawIconPlus.svg";

interface PatientButtonProps {
  /** Modo del formulario: crear o editar */
  mode: PatientFormMode;
  /** Datos iniciales para modo edición */
  initialData?: PatientFormData;
  /** Callback al completar exitosamente */
  onSuccess?: () => void;
}

const PatientButton: React.FC<PatientButtonProps> = ({
  mode,
  initialData,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (data: PatientFormData) => {
    setIsFormLoading(true);
    try {
      if (mode === "create") {
        await api.createPatient({
          nombre: data.patient.name,
          especie: data.patient.species,
          edad: parseFloat(data.patient.age) || 0,
          color: data.patient.color,
          senia: data.patient.characteristic,
          sexo: data.patient.sex as "Macho" | "Hembra",
          raza: data.patient.breed,
          peso: parseFloat(data.patient.weight) || 0,
          esterilizado: data.patient.sterilized === "yes",
          tiene_microchip: data.patient.microchip === "yes",
          num_microchip: data.patient.microchipNumber,
          activo: true,
          id_responsable: 0,
          id_clinica: 0,
        });
      } else {
        // TODO: Implementar api.updatePatient cuando esté disponible
        console.log("Editando paciente:", data);
      }
      handleCloseModal();
      onSuccess?.();
    } catch (err: any) {
      console.error(
        `Error al ${mode === "create" ? "crear" : "editar"} paciente:`,
        err.message,
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const buttonLabel = mode === "create" ? "Añadir paciente" : "Editar paciente";
  const modalTitle =
    mode === "create" ? "Registrar paciente" : "Editar paciente";

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 rounded-lg bg-vetween-teal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-vetween-teal/85"
      >
        <img src={pawIconPlus} alt="" className="size-10" />
        {buttonLabel}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        size="lg"
      >
        <PatientForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          isLoading={isFormLoading}
          onStepChange={setModalStep}
          initialData={initialData}
        />
      </Modal>
    </>
  );
};

export default PatientButton;
