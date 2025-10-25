import type { FC } from "react";

type Props = {
  semanas: number[];
  semanaSeleccionada: number | "";
  onChange: (semana: number | "") => void;
};

export const WeekSelector: FC<Props> = ({
  semanas,
  semanaSeleccionada,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 w-auto">
      <label className="text-sm font-semibold text-gray-700 text-left">
        Selecciona una semana
      </label>
      <select
        value={semanaSeleccionada}
        onChange={(e) =>
          onChange(e.target.value === "" ? "" : Number(e.target.value))
        }
        name="semana"
        className="border border-gray-300 rounded-md px-3 py-2 bg-black text-white text-sm w-auto"
      >
        <option value="">Selecciona</option>
        {semanas.map((s) => (
          <option key={s} value={s}>
            Semana {s}
          </option>
        ))}
      </select>
    </div>
  );
};
