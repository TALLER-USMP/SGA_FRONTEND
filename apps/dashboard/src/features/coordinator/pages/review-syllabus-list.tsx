import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - reemplazar con datos del backend
interface SyllabusReview {
  id: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  status: "EN_REVISION";
  submittedDate: string;
}

const mockSyllabiInReview: SyllabusReview[] = [
  {
    id: "1",
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    teacherName: "Norma Birginia Leon Lescano",
    status: "EN_REVISION",
    submittedDate: "2024-01-15",
  },
  {
    id: "2",
    courseName: "Programación Orientada a Objetos",
    courseCode: "09072108043",
    teacherName: "Juan Manuel Huapalla García",
    status: "EN_REVISION",
    submittedDate: "2024-01-16",
  },
  {
    id: "3",
    courseName: "Base de Datos",
    courseCode: "09072108044",
    teacherName: "María Elena García López",
    status: "EN_REVISION",
    submittedDate: "2024-01-17",
  },
];

export default function ReviewSyllabusList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSyllabi = mockSyllabiInReview.filter(
    (syllabus) =>
      syllabus.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.courseCode.includes(searchTerm) ||
      syllabus.teacherName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleReviewSyllabus = (syllabusId: string) => {
    navigate(`/coordinator/review-syllabus/${syllabusId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Revisión de Sílabos
        </h1>
        <p className="text-gray-600 mb-6">Sílabos pendientes de revisión</p>

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
        {filteredSyllabi.map((syllabus) => (
          <div
            key={syllabus.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
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

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full border border-yellow-200">
                  En Revisión
                </span>
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
          No se encontraron sílabos en revisión que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
