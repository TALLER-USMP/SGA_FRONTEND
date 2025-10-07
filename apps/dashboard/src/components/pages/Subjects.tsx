import { useState, useEffect, useRef } from "react";
import { Eye, X, Pencil, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import silaboImg from "../../assets/silaboDIS.png";

type Status = "green" | "red" | "yellow";

interface Subject {
  id: number;
  name: string;
  status: Status;
  thumbnail: string;
  semestre: string;
}

// 🧩 MOCKS — asignaturas adicionales para mostrar filtrado
const mockSubjects: Subject[] = [
  {
    id: 2,
    name: "Arquitectura de Software",
    status: "red",
    thumbnail: silaboImg,
    semestre: "2025-II",
  },
  {
    id: 3,
    name: "Gestión de Recursos de TI",
    status: "green",
    thumbnail: silaboImg,
    semestre: "2025-II",
  },
];

const statusMap: Record<Status, { color: string; label: string }> = {
  green: { color: "bg-green-500", label: "Aprobado" },
  red: { color: "bg-red-500", label: "Con observaciones" },
  yellow: { color: "bg-yellow-400", label: "Pendiente" },
};

export default function Subjects() {
  const [search, setSearch] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; subject?: Subject }>({
    open: false,
  });
  const navigate = useNavigate();
  const didFetchRef = useRef(false);

  // Filtrado local (nombre, semestre, estado)
  const applyFilters = (data: Subject[]) => {
    return data.filter((subject) => {
      const matchesSearch = subject.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesSemestre =
        !selectedCycle ||
        subject.semestre.toLowerCase() === selectedCycle.toLowerCase();
      const matchesStatus =
        !selectedStatus || subject.status === selectedStatus;
      return matchesSearch && matchesSemestre && matchesStatus;
    });
  };

  // ✅ API real del docente con ID=1 + mocks adicionales
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:7071/api/docente/1/asignaturas",
      );
      if (!res.ok) throw new Error("Error en la API de asignaturas");
      const apiData = await res.json();

      const apiSubjects: Subject[] =
        apiData?.data?.map((item: any) => ({
          id: item.idSilabo,
          name: item.cursoNombre,
          status: "yellow",
          thumbnail: silaboImg,
          semestre: item.semestreAcademico || "2025-II",
        })) || [];

      const combined = [
        ...apiSubjects,
        ...mockSubjects.filter((m) => !apiSubjects.some((a) => a.id === m.id)),
      ];

      setSubjects(applyFilters(combined));
    } catch (error) {
      console.error(
        "⚠️ Error al cargar desde backend, usando solo mocks:",
        error,
      );
      setSubjects(applyFilters(mockSubjects));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [search, selectedCycle, selectedStatus]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mis Asignaciones</h1>

      {/* Buscador y filtros */}
      <div className="mb-8 flex items-center gap-2 flex-wrap">
        <div className="relative w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar asignatura..."
            className="border border-gray-300 rounded px-9 py-2 w-full focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedCycle}
          onChange={(e) => setSelectedCycle(e.target.value)}
        >
          <option value="">Todos los semestres</option>
          <option value="2024-II">2024-II</option>
          <option value="2025-I">2025-I</option>
          <option value="2025-II">2025-II</option>
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="green">Aprobado</option>
          <option value="yellow">Pendiente</option>
          <option value="red">Con observaciones</option>
        </select>
      </div>

      {/* Lista de asignaturas */}
      {loading ? (
        <div className="text-center py-8">Cargando asignaturas...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron asignaturas
        </div>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between px-6 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-base font-semibold text-gray-800">
                {subject.name}
              </div>

              <div className="flex items-center gap-4">
                {(subject.status === "red" || subject.status === "yellow") && (
                  <button
                    onClick={() =>
                      navigate(
                        `/create-course?subject=${encodeURIComponent(subject.name)}`,
                      )
                    }
                    aria-label="Editar sílabo"
                  >
                    <Pencil className="w-6 h-6 text-blue-500" />
                  </button>
                )}

                <span
                  className={`w-5 h-5 rounded-full border border-gray-300 ${statusMap[subject.status].color}`}
                  title={statusMap[subject.status].label}
                ></span>

                <button
                  className="flex items-center"
                  onClick={() => setModal({ open: true, subject })}
                  aria-label="Ver sílabo"
                >
                  <Eye className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && modal.subject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 relative w-full max-w-lg text-center shadow-lg">
            <button
              className="absolute top-3 right-3 p-1 bg-gray-800 text-white rounded"
              onClick={() => setModal({ open: false })}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">{modal.subject.name}</h2>

            <div className="flex flex-col items-center gap-4">
              <img
                src={modal.subject.thumbnail}
                alt="Miniatura del sílabo"
                className="mx-auto mb-2 border shadow max-h-72 object-contain w-48"
              />

              {modal.subject.status === "green" && (
                <p className="text-sm text-gray-600">
                  El sílabo está aprobado. Puede descargar la versión oficial.
                </p>
              )}

              {modal.subject.status === "yellow" && (
                <p className="text-sm text-gray-600">
                  El sílabo está pendiente de aprobación.
                </p>
              )}

              {modal.subject.status === "red" && (
                <p className="text-sm text-gray-600">
                  El sílabo requiere modificaciones antes de su aprobación.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
