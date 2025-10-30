import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - reemplazar con datos del backend
interface Syllabus {
  id: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  status: string;
}

const mockSyllabi: Syllabus[] = [
  {
    id: "1",
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    teacherName: "Norma Birginia Leon Lescano",
    status: "EN_REVISION",
  },
  {
    id: "2",
    courseName: "Programación Orientada a Objetos",
    courseCode: "09072108043",
    teacherName: "Juan Manuel Huapalla García",
    status: "EN_REVISION",
  },
  {
    id: "3",
    courseName: "Base de Datos",
    courseCode: "09072108044",
    teacherName: "María Elena García López",
    status: "APROBADO",
  },
];

export default function PermissionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSyllabi = mockSyllabi.filter(
    (syllabus) =>
      syllabus.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.courseCode.includes(searchTerm) ||
      syllabus.teacherName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelectSyllabus = (syllabusId: string) => {
    navigate(`/coordinator/permissions/${syllabusId}`);
  };

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
        {filteredSyllabi.map((syllabus) => (
          <div
            key={syllabus.id}
            onClick={() => handleSelectSyllabus(syllabus.id)}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {syllabus.courseName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Código: {syllabus.courseCode}
                </p>
                <p className="text-sm text-gray-600">
                  Docente: {syllabus.teacherName}
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

      {filteredSyllabi.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron sílabos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
