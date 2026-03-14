import React from "react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#5451FF] text-white shadow-md"
                      : isCompleted
                        ? "bg-[#5451FF] text-white"
                        : "bg-[#5451FF]/30 text-[#5451FF]"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className={isActive ? "" : "text-[#737373]"}>{step.number}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-gray-900 font-semibold" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-0.5 -mt-5 transition-all duration-300
                  ${isCompleted ? "bg-[#5451FF]" : "bg-slate-300"}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
