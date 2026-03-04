"use client";

interface Props {
  number: number;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
  variant?: "green" | "blue" | "white";
}

const sizeClasses = {
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-xl",
};

export default function NumberBall({ number, size = "md", highlight = false, variant }: Props) {
  // variant explícito sobrescreve tudo
  const colorClass = variant === "white"
    ? "bg-white text-[#005CA9] shadow-md"
    : variant === "blue"
    ? "bg-[#005CA9] text-white shadow-md"
    : highlight
    ? "bg-amber-500 text-white shadow-md"
    : "bg-[#5BB745] text-white shadow-md"; // padrão: verde Caixa

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center font-bold tracking-tight
        ${colorClass}
      `}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
}
