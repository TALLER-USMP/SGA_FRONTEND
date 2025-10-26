import { useState } from "react";
import { Search, Eye, Edit, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AssignmentStatus = "validado" | "analizando" | "desaprobado";

interface Assignment {
  id: number;
  name: string;
  status: AssignmentStatus;
}

const mockAssignments: Assignment[] = [
  {
    id: 1,
    name: "Investigación de Sistemas de información",
    status: "validado",
  },
  { id: 2, name: "Taller de Proyectos", status: "desaprobado" },
  { id: 3, name: "Algoritmos 2", status: "analizando" },
  { id: 4, name: "Base de Datos", status: "validado" },
  { id: 5, name: "Programación Web", status: "analizando" },
  { id: 6, name: "Ingeniería de Software", status: "desaprobado" },
];

const statusConfig = {
  validado: {
    label: "Validado",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  analizando: {
    label: "Analizando",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  desaprobado: {
    label: "Desaprobado",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
};

export default function MyAssignments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    AssignmentStatus | "all"
  >("all");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const navigate = useNavigate();

  const filteredAssignments = mockAssignments.filter((assignment) => {
    const matchesSearch = assignment.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || assignment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleEditAssignment = (assignmentId: number) => {
    navigate(`/syllabus?id=${assignmentId}`);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mis Asignaciones
        </h1>

        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6">
          {/* All Filter */}
          <button
            onClick={() => setSelectedStatus("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedStatus === "all"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm">Todos</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full text-black">
              {mockAssignments.length}
            </span>
          </button>

          {/* Status Filters */}
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = mockAssignments.filter(
              (a) => a.status === key,
            ).length;
            const isSelected = selectedStatus === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key as AssignmentStatus)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isSelected
                    ? `${config.color} text-white shadow-md`
                    : `${config.bgColor} ${config.textColor} hover:shadow-sm`
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${isSelected ? "bg-white bg-opacity-30" : config.color}`}
                ></div>
                <span className="text-sm">{config.label}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isSelected
                      ? "bg-white bg-opacity-20"
                      : "bg-white bg-opacity-60"
                  }`}
                >
                  <span className={`text-x text-black`}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const statusInfo = statusConfig[assignment.status];
          return (
            <div
              key={assignment.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {assignment.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full ${statusInfo.color}`}
                  ></div>

                  {/* Action Icons */}
                  {assignment.status === "desaprobado" && (
                    <button
                      onClick={() => handleEditAssignment(assignment.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleViewAssignment(assignment)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>

                  {assignment.status === "desaprobado" && (
                    <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
                {selectedAssignment.name}
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
                      {statusConfig[selectedAssignment.status].label}
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
