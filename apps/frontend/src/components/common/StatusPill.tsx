interface StatusPillProps {
  status: string;
}

const colorMap: Record<string, string> = {
  Activo: "bg-emerald-100 text-emerald-700",
  Inactivo: "bg-red-100 text-red-700",
};

export function StatusPill({ status }: StatusPillProps) {
  const colors = colorMap[status] ?? "bg-gray-100 text-gray-500";
  return (
    <span
      className={`inline-flex w-20 items-center justify-center rounded-full py-0.5 text-xs font-medium ${colors}`}
    >
      {status}
    </span>
  );
}
