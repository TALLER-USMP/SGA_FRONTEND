export default function Subjects() {
  return (
    <div>
      {/* Legend */}
      <div className="flex gap-6 items-center mb-6">
        <span className="flex items-center gap-1 text-green-600">
          <span className="w-3 h-3 rounded-full bg-green-600"></span> Validado
        </span>
        <span className="flex items-center gap-1 text-gray-600">
          <span className="w-3 h-3 rounded-full border border-gray-600"></span>{" "}
          Pendiente
        </span>
        <span className="flex items-center gap-1 text-yellow-500">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>{" "}
          Analizando
        </span>
        <span className="flex items-center gap-1 text-red-600">
          <span className="w-3 h-3 rounded-full bg-red-600"></span> Desaprobado
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4 flex justify-between items-center shadow">
          <span className="font-medium">
            Investigación en Sistemas de Información
          </span>
          <span className="w-4 h-4 rounded-full bg-green-600"></span>
        </div>

        <div className="border rounded-lg p-4 flex justify-between items-center shadow">
          <span className="font-medium">Taller de Proyectos</span>
          <span className="w-4 h-4 rounded-full border border-gray-500"></span>
        </div>
      </div>
    </div>
  );
}
