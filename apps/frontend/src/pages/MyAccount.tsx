import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { storage } from "../utils/storage";
import stethoscopeIcon from "../assets/stethoscope.svg";
import keyIcon from "../assets/key.svg";
import lockIcon from "../assets/lock.svg";
import PageHeader from "../components/common/PageHeader";

interface MenuCardProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-vetween-teal/10 p-4 text-left transition-colors hover:bg-vetween-teal/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vetween-teal">
          <img src={icon} alt={title} className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="h-5 w-5 text-muted-foreground"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  );
};

export default function MyAccount() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState("Nombre de la clínica");

  const userName = user?.nombre || "Usuario";
  const firstName = userName.split(" ")[0];

  // Buscar nombre de la clínica desde la API
  useEffect(() => {
    const loadClinicName = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const clinicData = await api.getClinic(token);
          setClinicName(clinicData.nombre || "Nombre de la clínica");
        } catch (error) {
          console.error("Error loading clinic name:", error);
        }
      }
    };
    loadClinicName();
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-y-auto">
        <PageHeader subtitle={`Hola, ${firstName}`} title="Mi cuenta" />

        {/* User Info Section */}
        <section className="border-b border-border px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Avatar with upload */}
            <div className="relative">
              <div
                onClick={handleAvatarClick}
                className="h-24 w-24 cursor-pointer overflow-hidden rounded-full bg-vetween-teal ring-2 ring-border hover:ring-vetween-teal/70"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-vetween-teal text-2xl font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* User Details */}
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Dr(a). {userName}
              </h2>
              <p className="text-muted-foreground">{clinicName}</p>
            </div>
          </div>
        </section>

        {/* Menu Cards */}
        <section className="flex flex-col gap-4 px-8 py-6" aria-label="Opciones de cuenta">
          <MenuCard
            icon={stethoscopeIcon}
            title="Perfil Professional"
            description="Gestioná tu información personal y matrícula"
            onClick={() => navigate("/mi-cuenta/perfil-profesional")}
          />
          <MenuCard
            icon={keyIcon}
            title="Clínica"
            description="Datos del lugar donde atendés"
            onClick={() => navigate("/mi-cuenta/clinica")}
          />
          <MenuCard
            icon={lockIcon}
            title="Seguridad"
            description="Cambiar contraseña"
            onClick={() => navigate("/mi-cuenta/seguridad")}
          />
        </section>
      </main>
    </div>
  );
}
