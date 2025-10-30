import {
  useAssignments,
  type Assignment,
} from "../../assignments/hooks/assignments-query";
import { useState } from "react";
import { Eye } from "lucide-react";

export default function CoordinatorAssignments() {
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useAssignments(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    return assignment.cursoNombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando asignaciones...
      </div>
    );
  }
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Asignaciones</h1>
      <div className="relative flex-1 max-w-md mb-6">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="space-y-4">
        {filteredAssignments.map((assignment: Assignment) => (
          <div
            key={assignment.cursoCodigo}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <h3 className="text-lg font-medium text-gray-800">
                  {assignment.cursoNombre}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-gray-700">
                  <span className="text-xs font-semibold">
                    {assignment.estadoRevision}
                  </span>
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron asignaciones que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
