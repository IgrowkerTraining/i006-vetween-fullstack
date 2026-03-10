import { useState } from "react";
import { api, PatientDetailResponse } from "../services/api";
import { PatientData } from "../components/forms/PatientFormFields";

export function mapToPatientData(data: PatientDetailResponse): PatientData {
  return {
    name: data.nombre ?? data.nombre_paciente ?? "",
    species: data.especie ?? "",
    breed: data.raza ?? "",
    age: data.edad != null ? String(data.edad) : "",
    sex: data.sexo ?? "",
    weight: data.peso != null ? String(data.peso) : "",
    color: data.color ?? "",
    characteristic: data.senia ?? "",
    sterilized:
      data.esterilizado === true
        ? "yes"
        : data.esterilizado === false
          ? "no"
          : "",
    microchip:
      data.tiene_microchip === true
        ? "yes"
        : data.tiene_microchip === false
          ? "no"
          : "",
    microchipNumber: data.num_microchip ?? "",
  };
}

export function useEditPatient(
  onSuccess: (patientId: string) => Promise<void>,
) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const [editApiError, setEditApiError] = useState<string | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editInitialData, setEditInitialData] = useState<
    PatientData | undefined
  >(undefined);

  const openEdit = async (patientId: string) => {
    setEditApiError(null);
    setEditInitialData(undefined);
    setEditingPatientId(patientId);
    setIsEditModalOpen(true);
    try {
      const data = await api.getPatientById(patientId);
      setEditInitialData(mapToPatientData(data));
    } catch (err: any) {
      setEditApiError(err?.message || "No se pudo cargar el paciente.");
    }
  };

  const closeEdit = () => {
    setIsEditModalOpen(false);
    setEditApiError(null);
  };

  const submitEdit = async (data: PatientData) => {
    if (!editingPatientId) return;
    setIsEditFormLoading(true);
    setEditApiError(null);
    try {
      await api.updatePatient(editingPatientId, {
        nombre: data.name,
        especie: data.species,
        raza: data.breed,
        edad: parseInt(data.age, 10),
        sexo: data.sex as "Macho" | "Hembra",
        peso: parseFloat(data.weight.replace(",", ".")),
        color: data.color,
        ...(data.characteristic ? { senia: data.characteristic } : {}),
        esterilizado: data.sterilized === "yes",
        tiene_microchip: data.microchip === "yes",
        ...(data.microchip === "yes"
          ? { num_microchip: data.microchipNumber }
          : {}),
      });
      await onSuccess(editingPatientId);
      setIsEditModalOpen(false);
    } catch (err: any) {
      setEditApiError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setIsEditFormLoading(false);
    }
  };

  return {
    isEditModalOpen,
    isEditFormLoading,
    editApiError,
    editInitialData,
    openEdit,
    closeEdit,
    submitEdit,
  };
}
