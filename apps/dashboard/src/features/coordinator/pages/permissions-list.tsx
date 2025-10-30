import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAllAssignments,
  type Assignment,
} from "../../assignments/hooks/assignments-query";

export default function PermissionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  // Sin parámetro docenteId, obtiene todas las asignaciones
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useAllAssignments();

  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    return (
      assignment.cursoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.cursoCodigo.includes(searchTerm) ||
      assignment.nombreDocente.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectSyllabus = (syllabusId: string | number) => {
    navigate(`/coordinator/permissions/${syllabusId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">Cargando sílabos...</div>
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Activar Permisos
        </h1>
        <p className="text-gray-600 mb-6">
          Selecciona un sílabo para gestionar los permisos de edición
        </p>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por curso, código o docente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Syllabi List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.syllabusId ?? assignment.cursoCodigo}
            onClick={() =>
              handleSelectSyllabus(
                assignment.syllabusId ?? assignment.cursoCodigo,
              )
            }
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {assignment.cursoNombre}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Código: {assignment.cursoCodigo}
                </p>
                <p className="text-sm text-gray-600">
                  Docente: {assignment.nombreDocente}
                </p>
              </div>
              <ChevronRight
                size={24}
                className="text-gray-400 group-hover:text-gray-600 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron sílabos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
