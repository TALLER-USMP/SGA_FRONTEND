import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "default", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded ${
        variant === "outline" ? "border border-gray-400" : "bg-blue-500 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
