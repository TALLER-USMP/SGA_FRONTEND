import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - reemplazar con datos del backend
interface SyllabusReview {
  id: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  status: "ANALIZANDO" | "VALIDADO" | "DESAPROBADO";
  submittedDate: string;
}

const mockSyllabiInReview: SyllabusReview[] = [
  {
    id: "1",
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    teacherName: "Norma Birginia Leon Lescano",
    status: "ANALIZANDO",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    courseName: "Programación Orientada a Objetos",
    courseCode: "09072108043",
    teacherName: "Juan Manuel Huapalla García",
    status: "VALIDADO",
    submittedDate: "2024-01-16",
  },
  {
    id: "3",
    courseName: "Base de Datos",
    courseCode: "09072108044",
    teacherName: "María Elena García López",
    status: "DESAPROBADO",
    submittedDate: "2024-01-17",
  },
  {
    id: "4",
    courseName: "Desarrollo de Aplicaciones Web",
    courseCode: "09072108045",
    teacherName: "Carlos Alberto Pérez Ramos",
    status: "ANALIZANDO",
    submittedDate: "2024-01-18",
  },
  {
    id: "5",
    courseName: "Inteligencia Artificial",
    courseCode: "09072108046",
    teacherName: "Ana María Torres Silva",
    status: "VALIDADO",
    submittedDate: "2024-01-19",
  },
];

type SyllabusStatus = "ANALIZANDO" | "VALIDADO" | "DESAPROBADO";
type FilterStatus = "ALL" | SyllabusStatus;

export default function ReviewSyllabusList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  // Configuración de estados
  const statusConfig: Record<
    SyllabusStatus,
    { label: string; color: string; textColor: string; bgColor: string }
  > = {
    ANALIZANDO: {
      label: "Analizado",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    VALIDADO: {
      label: "Validado",
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    DESAPROBADO: {
      label: "Desaprobado",
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
  };

  const filteredSyllabi = mockSyllabiInReview.filter((syllabus) => {
    const matchesSearch =
      syllabus.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.courseCode.includes(searchTerm) ||
      syllabus.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || syllabus.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleReviewSyllabus = (syllabusId: string) => {
    navigate(`/coordinator/review-syllabus/${syllabusId}`);
  };

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1600px" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Revisión de Sílabos
        </h1>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mb-6">
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

        {/* Filtros por estado */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedStatus("ALL")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedStatus === "ALL"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm">Todos</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full text-black">
              {mockSyllabiInReview.length}
            </span>
          </button>

          {(Object.keys(statusConfig) as SyllabusStatus[]).map((key) => {
            const cfg = statusConfig[key];
            const count = mockSyllabiInReview.filter(
              (s) => s.status === key,
            ).length;
            const isSelected = selectedStatus === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isSelected
                    ? `${cfg.color} text-white shadow-md`
                    : `${cfg.bgColor} ${cfg.textColor} hover:shadow-sm`
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${isSelected ? "bg-white bg-opacity-30" : cfg.color}`}
                ></div>
                <span className="text-sm">{cfg.label}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${isSelected ? "bg-white bg-opacity-20" : "bg-white bg-opacity-60"}`}
                >
                  <span className="text-black">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Syllabi List */}
      <div className="space-y-4">
        {filteredSyllabi.map((syllabus) => (
          <div
            key={syllabus.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {syllabus.courseName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Código: {syllabus.courseCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Docente: {syllabus.teacherName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enviado:{" "}
                    {new Date(syllabus.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(() => {
                  const cfg = statusConfig[syllabus.status];
                  return (
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded ${cfg.bgColor} ${cfg.textColor}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${cfg.color}`}
                      ></div>
                      <span className="text-xs font-semibold">{cfg.label}</span>
                    </div>
                  );
                })()}
                <button
                  onClick={() => handleReviewSyllabus(syllabus.id)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Revisar"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSyllabi.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron sílabos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
