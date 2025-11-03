import { useState } from "react";
import { Search, Eye } from "lucide-react";

interface SyllabusCatalog {
  id: string;
  courseName: string;
  courseCode: string;
  sumilla: string;
  credits: number;
}

const mockCatalog: SyllabusCatalog[] = [
  {
    id: "1",
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    sumilla:
      "La asignatura de Taller de Proyectos es de naturaleza teórico-práctica...",
    credits: 4,
  },
  {
    id: "2",
    courseName: "Programación Orientada a Objetos",
    courseCode: "09072108043",
    sumilla:
      "Asignatura que desarrolla competencias en programación orientada a objetos...",
    credits: 4,
  },
  {
    id: "3",
    courseName: "Base de Datos",
    courseCode: "09072108044",
    sumilla:
      "Curso que aborda los fundamentos de bases de datos relacionales...",
    credits: 4,
  },
];

export default function SyllabusCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSyllabus, setSelectedSyllabus] =
    useState<SyllabusCatalog | null>(null);

  const filteredCatalog = mockCatalog.filter(
    (item) =>
      item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.courseCode.includes(searchTerm),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Catálogo de Sumilla
        </h1>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por curso o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Catalog List */}
      <div className="space-y-4">
        {filteredCatalog.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.courseName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Código: {item.courseCode} | Créditos: {item.credits}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {item.sumilla}
                </p>
              </div>
              <button
                onClick={() => setSelectedSyllabus(item)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors ml-4"
                title="Ver detalles"
              >
                <Eye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron cursos que coincidan con tu búsqueda.
        </div>
      )}

      {/* Modal de detalles */}
      {selectedSyllabus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedSyllabus.courseName}
              </h2>
              <p className="text-sm text-gray-600">
                Código: {selectedSyllabus.courseCode} | Créditos:{" "}
                {selectedSyllabus.credits}
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sumilla
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedSyllabus.sumilla}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSyllabus(null)}
                className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
