import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import onlylogo from "../../assets/onlylogo.svg";

const navItems = [
  { label: "Pacientes", id: "pacientes", path: "/lista-pacientes" },
  { label: "Responsables", id: "historial", path: "/responsables" },
  { label: "Resumen clínico", id: "resumen", path: "/resumen-clinico" },
  { label: "Mi cuenta", id: "mi-cuenta", path: "/mi-cuenta" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Determine active nav based on current path
  const getActiveNav = () => {
    const currentPath = location.pathname;
    if (currentPath === "/mi-cuenta" || currentPath.startsWith("/mi-cuenta/")) return "mi-cuenta";
    if (currentPath === "/resumen-clinico" || currentPath.startsWith("/resumen-clinico/")) return "resumen";
    if (currentPath === "/responsables" || currentPath === "/register-patient") return "historial";
    return "pacientes";
  };
  
  const activeNav = getActiveNav();

  const handleNavClick = (item: typeof navItems[0]) => {
    navigate(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-vetween-ice">
      <div className="flex items-center justify-center py-6">
        <img src={onlylogo} alt="vetween Logo" className="w-full" />
      </div>

      <nav
        className="flex flex-1 flex-col px-3"
        aria-label="Navegacion principal"
      >
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item)}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeNav === item.id
                    ? "bg-[#5451FF] text-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-indigo-100 hover:text-indigo-700 hover:translate-x-1"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-red-100 hover:text-red-600 hover:translate-x-1"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
