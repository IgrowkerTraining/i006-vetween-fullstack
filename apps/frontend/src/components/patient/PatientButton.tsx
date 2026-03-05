import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../common/Modal";
import { PatientForm, PatientFormData, PatientFormMode } from "./PatientForm";
import { ROUTES } from "../../constants/routes";
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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modo create: navega a la página dedicada
  const handleOpenModal = () => {
    if (mode === "create") {
      navigate(ROUTES.REGISTER_PATIENT);
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setApiError(null);
  };

  const handleFormSubmit = async (data: PatientFormData) => {
    setIsFormLoading(true);
    try {
      // TODO: Implementar edición de paciente + responsable
      console.log("Editando paciente:", data);
      handleCloseModal();
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.message || "Ocurrió un error inesperado. Intentá de nuevo.";
      console.error("Error al editar paciente:", msg);
      setApiError(msg);
    } finally {
      setIsFormLoading(false);
    }
  };

  const buttonLabel = mode === "create" ? "Añadir paciente" : "Editar paciente";

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 rounded-lg bg-vetween-teal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-vetween-teal/85"
      >
        <img src={pawIconPlus} alt="" className="size-10" />
        {buttonLabel}
      </button>

      {/* Modal solo aplica al modo edición */}
      {mode === "edit" && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Editar paciente"
          size="lg"
        >
          {apiError && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {apiError}
            </div>
          )}
          <PatientForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            isLoading={isFormLoading}
            initialData={initialData}
          />
        </Modal>
      )}
    </>
  );
};

export default PatientButton;
