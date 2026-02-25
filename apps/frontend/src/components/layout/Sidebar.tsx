import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import onlylogo from "../../assets/onlylogo.svg";

const navItems = [
  { label: "Pacientes", id: "pacientes" },
  { label: "Historial clínico", id: "historial" },
  { label: "Resumen clínico", id: "resumen" },
  { label: "Administración", id: "administracion" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeNav, setActiveNav] = useState("pacientes");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-center py-6">
        <img src={onlylogo} alt="vetween Logo" className="w-full" />
      </div>

      <nav className="flex flex-1 flex-col px-3" aria-label="Navegacion principal">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeNav === item.id
                    ? "bg-indigo-600 text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <button className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted">
          Mi cuenta
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-muted"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
