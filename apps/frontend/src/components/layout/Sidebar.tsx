import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import onlylogo from "../../assets/onlylogo.svg";

const navItems = [
  { label: "Pacientes", id: "pacientes", path: "/dashboard" },
  { label: "Resumen clínico", id: "resumen", path: "/clinical-summary" },
  { label: "Responsables", id: "historial", path: "/responsables" },
  { label: "Mi Cuenta", id: "mi-cuenta", path: "/mi-cuenta" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Determine active nav based on current path
  const getActiveNav = () => {
    const currentPath = location.pathname;
    if (currentPath === "/mi-cuenta" || currentPath.startsWith("/mi-cuenta/")) return "mi-cuenta";
    if (currentPath === "/clinical-summary" || currentPath.startsWith("/clinical-summary/")) return "resumen";
    if (currentPath === "/responsables") return "historial";
    return "pacientes";
  };
  
  const [activeNav, setActiveNav] = useState(getActiveNav);

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveNav(item.id);
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
                    ? "bg-indigo-600 text-accent-foreground shadow-sm"
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
