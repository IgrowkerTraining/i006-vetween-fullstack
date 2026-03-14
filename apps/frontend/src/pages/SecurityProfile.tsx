import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { SuccessModal } from "../components/common/SuccessModal";
import { api } from "../services/api";
import { storage } from "../utils/storage";
import { SecurityProfileSkeleton } from "../components/common/Skeleton";
import eyeOpen from "../assets/eyeOpen.svg";
import eyeSlash from "../assets/eyeSlash.svg";
import iconSecurity from "../assets/iconSecurity.svg";

export default function SecurityProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Loading state - depends on user data availability
  const isLoadingPage = !user;

  // Estado del formulario
  const [formData, setFormData] = useState({
    contraseña_actual: "",
    contraseña_nueva: "",
    confirmPassword: "",
  });

  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de error y éxito
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const rawName =
    user?.nombre || user?.name || user?.email?.split("@")[0] || "Usuario";
  const firstName = rawName.trim().split(/[\s._-]+/)[0] || "Usuario";
  const userName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar contraseña actual
    if (!formData.contraseña_actual) {
      newErrors.contraseña_actual = "La contraseña actual es requerida";
    }

    // Validar nueva contraseña
    if (!formData.contraseña_nueva) {
      newErrors.contraseña_nueva = "La nueva contraseña es requerida";
    } else if (formData.contraseña_nueva.length < 8) {
      newErrors.contraseña_nueva =
        "La contraseña debe tener al menos 8 caracteres";
    }

    // Validar confirmación
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmación de contraseña es requerida";
    } else if (formData.contraseña_nueva !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (validateForm()) {
      const token = storage.getToken();
      if (!token) {
        setErrors({ general: "No hay sesión activa" });
        return;
      }

      try {
        setIsLoading(true);
        setSuccessMessage(null);

        await api.changePassword(
          {
            contraseña_actual: formData.contraseña_actual,
            contraseña_nueva: formData.contraseña_nueva,
          },
          token,
        );

        setSuccessMessage("Contraseña cambiada correctamente");
        setShowSuccessModal(true);
        // Limpiar formulario
        setFormData({
          contraseña_actual: "",
          contraseña_nueva: "",
          confirmPassword: "",
        });
      } catch (error: any) {
        setErrors({
          general: error.message || "Error al cambiar la contraseña",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show skeleton while loading
  if (isLoadingPage) {
    return (
      <MainLayout>
        <SecurityProfileSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SuccessModal
        isOpen={showSuccessModal}
        message="La contraseña se actualizó correctamente"
        onAccept={() => setShowSuccessModal(false)}
      />
        {/* Header */}
        <header className="border-b border-border px-8 py-5">
          <p className="text-sm text-muted-foreground">Hola, {userName}</p>
          <h1 className="text-2xl font-bold text-foreground">Mi Cuenta</h1>
        </header>

          {/* Breadcrumb */}
          <div className="border-b border-border px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate("/mi-cuenta")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Mi cuenta
              </button>
              <span className="text-muted-foreground">›</span>
              <span className="text-foreground font-medium">Seguridad</span>
            </nav>
          </div>

          {/* Contenido Centrado */}
          <div className="flex-1 flex items-start justify-center p-6 md:p-10 overflow-y-auto">
            <div className="w-full max-w-md">
              {/* Security Info Section */}
              <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  {/* Lock Icon */}
                  <div className="h-24 w-24 flex items-center justify-center rounded-full bg-vetween-teal">
                    <img src={iconSecurity} alt="Seguridad" className="h-12 w-12" />
                  </div>

                  {/* Security Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Seguridad
                    </h2>
                    <p className="text-muted-foreground">
                      Cambiá tu contraseña
                    </p>
                  </div>
                </div>
              </section>

              {/* Form Section */}
              <section className="bg-vetween-teal/5 border border-border rounded-2xl p-6">
                {/* Label */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Cambiar contraseña
                  </h3>
                </div>

                {/* Error general */}
                {errors.general && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                {/* Success message */}
                {successMessage && (
                  <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg">
                    {successMessage}
                  </div>
                )}

                {/* Form */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Contraseña Actual */}
                  <div>
                    <Input
                      label="Contraseña actual"
                      name="contraseña_actual"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.contraseña_actual}
                      onChange={handleChange}
                      error={errors.contraseña_actual}
                      suffix={
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="focus:outline-none pointer-events-auto"
                        >
                          {showCurrentPassword ? (
                            <img src={eyeSlash} alt="Ocultar" className="w-5 h-5" />
                          ) : (
                            <img src={eyeOpen} alt="Mostrar" className="w-5 h-5" />
                          )}
                        </button>
                      }
                    />
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <Input
                      label="Nueva contraseña"
                      name="contraseña_nueva"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.contraseña_nueva}
                      onChange={handleChange}
                      error={errors.contraseña_nueva}
                      suffix={
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="focus:outline-none pointer-events-auto"
                        >
                          {showNewPassword ? (
                            <img src={eyeSlash} alt="Ocultar" className="w-5 h-5" />
                          ) : (
                            <img src={eyeOpen} alt="Mostrar" className="w-5 h-5" />
                          )}
                        </button>
                      }
                    />
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <Input
                      label="Confirmar contraseña"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      suffix={
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="focus:outline-none pointer-events-auto"
                        >
                          {showConfirmPassword ? (
                            <img src={eyeSlash} alt="Ocultar" className="w-5 h-5" />
                          ) : (
                            <img src={eyeOpen} alt="Mostrar" className="w-5 h-5" />
                          )}
                        </button>
                      }
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-[#808080] hover:bg-[#A49D9D] text-white border-red-500 hover:border-red-600"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="flex-1"
                    isLoading={isLoading}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </section>
            </div>
          </div>
    </MainLayout>
  );
}
