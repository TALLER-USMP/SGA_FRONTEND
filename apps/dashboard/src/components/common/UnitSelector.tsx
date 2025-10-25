import type { FC } from "react";

type Unidad = {
  id: number;
  numero: number;
  titulo: string;
};

type UnitSelectorProps = {
  unidades: Unidad[];
  unidadSeleccionada: number | "";
  onChange: (unidadId: number | "") => void;
};

export const UnitSelector: FC<UnitSelectorProps> = ({
  unidades,
  unidadSeleccionada,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2 text-left">4. Unidades</h2>
      <select
        value={unidadSeleccionada}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
      >
        <option value="">Selecciona una unidad</option>
        {unidades.map((u) => (
          <option key={u.id} value={u.id}>
            {`Unidad ${u.numero}: ${u.titulo}`}
          </option>
        ))}
      </select>
    </div>
  );
};
