import React from "react";

interface UnidadOption {
  numero: number;
  titulo: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  unidades: UnidadOption[];
}

export const UnitSelector: React.FC<Props> = ({
  value,
  onChange,
  unidades,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      {unidades.map((u) => (
        <label
          key={u.numero}
          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 rounded"
        >
          <input
            type="radio"
            name="unidad"
            value={u.numero}
            checked={value === String(u.numero)}
            onChange={(e) => onChange(e.target.value)}
            className="mr-3 h-4 w-4 text-blue-600"
          />
          <span className="font-medium">
            Unidad {u.numero}: {u.titulo}
          </span>
        </label>
      ))}
    </div>
  );
};
