import { useState } from "react";
import { api, ResponsableDetailResponse } from "../services/api";
import { ResponsibleData } from "../components/forms/ResponsibleFormFields";

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
    province: data.provincia != null ? String(data.provincia) : "",
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
        email: data.email,
        telefono: data.phone,
        relacion: data.relationship,
        direccion_calle: data.street,
        direccion_numero: data.number,
        direccion_localidad: data.locality,
        provincia: data.province,
      });
      await onSuccess();
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
