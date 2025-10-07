import React, { useState } from "react";

export default function StepWeeks() {
  const [conceptual, setConceptual] = useState("");
  const [procedimental, setProcedimental] = useState("");
  const MAX_CHARS = 400;

  return (
    <div className="p-6 space-y-8">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white font-semibold">
          2
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Editar Sílabos
        </h2>
      </div>

      {/* Unidad */}
      <div>
        <h3 className="font-semibold mb-2">4. Unidades</h3>
        <input
          type="text"
          value="Unidad: I. DISEÑO DE SOLUCIONES INNOVADORAS"
          readOnly
          className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
        />
      </div>

      {/* Semana */}
      <div>
        <h3 className="font-semibold mb-2">4. Semanas</h3>
        <label className="block mb-1 text-sm text-gray-600">
          Selecciona una semana
        </label>
        <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
          <option>Semana 1</option>
          <option>Semana 2</option>
          <option>Semana 3</option>
          <option>Semana 4</option>
        </select>
      </div>

      {/* Textareas con contador */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold mb-2">Contenidos conceptuales</h4>
          <textarea
            className="w-full min-h-[140px] resize-y border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"
            value={conceptual}
            onChange={(e) => setConceptual(e.target.value)}
            maxLength={MAX_CHARS}
            placeholder="Escribe aquí los contenidos conceptuales…"
          />
          <div className="text-right text-sm text-gray-500">
            {conceptual.length}/{MAX_CHARS}
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <h4 className="font-semibold mb-2">Contenidos Procedimentales</h4>
          <textarea
            className="w-full min-h-[140px] resize-y border rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500"
            value={procedimental}
            onChange={(e) => setProcedimental(e.target.value)}
            maxLength={MAX_CHARS}
            placeholder="Escribe aquí los contenidos procedimentales…"
          />
          <div className="text-right text-sm text-gray-500">
            {procedimental.length}/{MAX_CHARS}
          </div>
        </div>
      </div>
    </div>
  );
}
