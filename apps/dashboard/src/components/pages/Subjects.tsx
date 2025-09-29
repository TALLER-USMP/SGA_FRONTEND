import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function Subjects() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Asignaturas</h1>

      {/* Legend */}
      <div className="flex gap-6 items-center mb-8">
        <span className="flex items-center gap-2 text-green-600 text-sm">
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          Validado
        </span>
        <span className="flex items-center gap-2 text-gray-600 text-sm">
          <span className="w-3 h-3 rounded-full border border-gray-600"></span>
          Pendiente
        </span>
        <span className="flex items-center gap-2 text-orange-500 text-sm">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          Analizando
        </span>
        <span className="flex items-center gap-2 text-red-600 text-sm">
          <span className="w-3 h-3 rounded-full bg-red-600"></span>
          Desaprobado
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        <Link
          to="/create-course?subject=investigacion"
          className="group flex items-center justify-between p-5 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 rounded-full bg-gray-600"></span>
            <span className="text-base font-medium text-gray-800">
              Investigación en Sistemas de Información
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-green-600"></span>
            <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link
          to="/create-course?subject=taller"
          className="group flex items-center justify-between p-5 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="w-4 h-4 rounded-full bg-gray-600"></span>
            <span className="text-base font-medium text-gray-800">
              Taller de Proyectos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-gray-600"></span>
            <Eye className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  );
}
