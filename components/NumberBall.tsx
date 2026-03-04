"use client";

interface Props {
  number: number;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-13 h-13 text-base",
};

export default function NumberBall({ number, size = "md", highlight = false }: Props) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center font-bold
        ${highlight
          ? "bg-[#5BB745] text-white shadow-md"
          : "bg-[#005CA9] text-white shadow-sm"}
      `}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
}
