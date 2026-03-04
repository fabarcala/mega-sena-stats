"use client";

interface Props {
  number: number;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

const sizeClasses = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-lg",
};

export default function NumberBall({ number, size = "md", highlight = false }: Props) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center font-bold
        ${highlight
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
          : "bg-green-600 text-white shadow-md"}
      `}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
}
