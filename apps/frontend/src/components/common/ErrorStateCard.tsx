import React from "react";
import huellaAzulIcon from "../../assets/huella-azul.svg";
import { Button } from "./Button";

interface ErrorStateCardProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  actionVariant?: "primary" | "back";
  className?: string;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "primary",
  className = "",
}) => {
  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <section className="w-full max-w-[760px] rounded-xl border border-[#BCD3E8] bg-[#E9EFF7] px-6 py-12 text-center shadow-sm sm:px-10">
        <img
          src={huellaAzulIcon}
          alt="Estado"
          className="mx-auto mb-8 w-[80px] max-w-full"
        />

        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-[#171717] sm:text-[36px]">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#2F2F2F]">
            {description}
          </p>
        )}

        <div className="mt-8">
          {actionVariant === "back" ? (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-md bg-[#F0F2FF] px-4 py-2 text-base font-semibold text-[#5451FF] transition-colors hover:bg-[#E5E8FF]"
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
              {actionLabel}
            </button>
          ) : (
            <Button
              type="button"
              onClick={onAction}
              className="mx-auto min-w-28 px-8 py-2.5 text-base"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ErrorStateCard;
