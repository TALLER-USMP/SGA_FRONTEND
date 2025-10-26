import { useState } from "react";
import { Search, Eye, Edit, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/useSession";
import { useAssignments, type Assignment } from "../hooks/api/AssignmentsQuery";
// Nota: el backend devuelve estadoRevision (e.g. "DESAPROBADO", "APROBADO"),
// y campos cursoCodigo/cursoNombre.

export default function MyAssignments() {
  const { user, isLoading: sessionLoading } = useSession();
  const docenteId = user?.id as number | string | undefined;
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useAssignments(docenteId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const navigate = useNavigate();

  const filteredAssignments = assignments.filter((assignment: Assignment) =>
    assignment.cursoNombre.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleEditAssignment = (codigo: string) => {
    navigate(`/syllabus?codigo=${codigo}`);
  };

  const closeModal = () => setSelectedAssignment(null);

  if (sessionLoading || isLoading) {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mis Asignaciones
        </h1>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Assignments List */}
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
                {/* Estado */}
                <span className="text-sm text-gray-600 font-semibold">
                  {assignment.estadoRevision}
                </span>

                {/* Editar */}
                {assignment.estadoRevision === "DESAPROBADO" && (
                  <button
                    onClick={() => handleEditAssignment(assignment.cursoCodigo)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                )}

                {/* Ver */}
                <button
                  onClick={() => handleViewAssignment(assignment)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron asignaciones que coincidan con tu búsqueda.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 h-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Content */}
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {selectedAssignment.cursoNombre}
              </h2>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <Eye size={32} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-lg font-medium">Vista previa del sílabo</p>
                  <p className="text-sm mt-2">
                    Contenido del sílabo aparecerá aquí
                  </p>
                  <p className="text-xs mt-4 text-gray-400">
                    Estado:{" "}
                    <span className="font-medium">
                      {selectedAssignment.estadoRevision}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
