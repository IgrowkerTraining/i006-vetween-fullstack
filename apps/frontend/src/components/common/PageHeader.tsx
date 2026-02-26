import React from "react";

interface PageHeaderProps {
  /** Subtítulo pequeño encima del título */
  subtitle?: string;
  /** Título principal */
  title: string;
  /** Mostrar botón de volver */
  showBackButton?: boolean;
  /** Acción personalizada para el botón volver */
  onBack?: () => void;
  /** Contenido a la derecha del header (botones, acciones) */
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  subtitle,
  title,
  showBackButton = false,
  onBack,
  actions,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="flex min-h-20 items-center justify-between border-b border-border bg-card px-8 py-4">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </button>
            <div className="h-6 w-px bg-border" />
          </>
        )}
        <div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};

export default PageHeader;
