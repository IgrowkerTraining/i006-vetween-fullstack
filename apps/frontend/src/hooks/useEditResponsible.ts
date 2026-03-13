import { useState } from "react";
import { api, ResponsableDetailResponse } from "../services/api";
import { ResponsibleData } from "../components/forms/ResponsibleFormFields";
import { PROVINCIAS } from "../constants/enums";

export function mapToResponsibleData(
  data: ResponsableDetailResponse,
): ResponsibleData {
  return {
    firstName: data.nombre != null ? String(data.nombre) : "",
    lastName: data.apellido != null ? String(data.apellido) : "",
    email: data.email != null ? String(data.email) : "",
    street: data.direccion_calle != null ? String(data.direccion_calle) : "",
    number: data.direccion_numero != null ? String(data.direccion_numero) : "",
    locality:
      data.direccion_localidad != null ? String(data.direccion_localidad) : "",
    province: (() => {
      const raw = data.provincia != null ? String(data.provincia) : "";
      const match = (PROVINCIAS as readonly { value: string; label: string }[]).find(
        (p) => p.value === raw || p.label === raw,
      );
      return match ? match.value : raw;
    })(),
    phone: data.telefono != null ? String(data.telefono) : "",
    relationship: data.relacion != null ? String(data.relacion) : "",
  };
}

export function useEditResponsible(onSuccess: () => Promise<void>) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditFormLoading, setIsEditFormLoading] = useState(false);
  const [editApiError, setEditApiError] = useState<string | null>(null);
  const [editingResponsableId, setEditingResponsableId] = useState<
    string | null
  >(null);
  const [editInitialData, setEditInitialData] = useState<
    ResponsibleData | undefined
  >(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openEdit = async (responsableId: string) => {
    setEditApiError(null);
    setEditInitialData(undefined);
    setEditingResponsableId(responsableId);
    setIsEditModalOpen(true);
    try {
      const data = await api.getResponsableById(responsableId);
      setEditInitialData(mapToResponsibleData(data));
    } catch (err: any) {
      setEditApiError(err?.message || "No se pudo cargar el responsable.");
    }
  };

  const closeEdit = () => {
    setIsEditModalOpen(false);
    setEditApiError(null);
  };

  const submitEdit = async (data: ResponsibleData) => {
    if (!editingResponsableId) return;
    setIsEditFormLoading(true);
    setEditApiError(null);
    try {
      await api.updateResponsable(editingResponsableId, {
        nombre: data.firstName,
        apellido: data.lastName,
        email: data.email.trim().toLowerCase(),
        telefono: data.phone,
        relacion: data.relationship,
        direccion_calle: data.street,
        direccion_numero: data.number,
        direccion_localidad: data.locality,
        provincia: data.province,
      });
      await onSuccess();
      setIsEditModalOpen(false);
      setShowSuccessModal(true);
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
    showSuccessModal,
    closeSuccessModal: () => setShowSuccessModal(false),
  };
}
