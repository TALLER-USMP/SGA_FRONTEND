// src/pages/Subjects.tsx
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
  note: string;
  ciclo: string;
  semestre: string;
}

type ModalState = { open: false } | { open: true; subject: Subject };

const statusMap: Record<Status, { color: string; label: string }> = {
  green: { color: "bg-green-500", label: "Aprobado" },
  red: { color: "bg-red-500", label: "Modificaciones pendientes" },
  yellow: { color: "bg-yellow-400", label: "Pendiente de aprobación" },
};

export default function Subjects() {
  const [search, setSearch] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const didFetchRef = useRef(false);

  const currentTeacherId = "1";

  // 🔹 Cargar asignaturas del docente (única fuente real)
  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:7071/api/docente/${currentTeacherId}/asignaturas`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

      const json = await response.json();
      const backendRaw = json?.data ?? [];

      if (!Array.isArray(backendRaw) || backendRaw.length === 0) {
        setSubjects([]);
        setError("No se encontraron asignaturas");
        return;
      }

      // 🟢 Simulamos estado (ya que backend no lo tiene aún)
      let formattedSubjects: Subject[] = backendRaw.map((item: any) => {
        const semestreActual = "2025-II";
        const status: Status =
          item.semestreAcademico === semestreActual ? "yellow" : "green";

        return {
          id: Number(item.idSilabo),
          name: item.cursoNombre ?? "Sin nombre",
          status,
          thumbnail: silaboImg,
          ciclo: item.ciclo ?? "-",
          semestre: item.semestreAcademico ?? "-",
          note: `${item.docentesText ?? "Docente(s)"} • Ciclo: ${
            item.ciclo ?? "-"
          } • Código: ${item.cursoCodigo ?? "-"}`,
        };
      });

      // 🔎 Filtros locales
      if (search) {
        formattedSubjects = formattedSubjects.filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (selectedCycle) {
        formattedSubjects = formattedSubjects.filter(
          (s) => s.semestre === selectedCycle,
        );
      }

      if (selectedStatus) {
        formattedSubjects = formattedSubjects.filter(
          (s) => s.status === selectedStatus,
        );
      }

      setSubjects(formattedSubjects);
    } catch (err: any) {
      console.error("Error al cargar asignaturas:", err);
      setError("Error al cargar asignaturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchSubjects();
  }, [currentTeacherId]);

  // Refrescar cuando cambian filtros
  useEffect(() => {
    if (didFetchRef.current) fetchSubjects();
  }, [search, selectedCycle, selectedStatus]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mis Asignaciones</h1>

      {/* 🔍 Buscador y filtros */}
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

        {/* Filtro por semestre */}
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedCycle}
          onChange={(e) => setSelectedCycle(e.target.value)}
        >
          <option value="">Todos los semestres</option>
          <option value="2025-II">2025-II</option>
          <option value="2025-I">2025-I</option>
          <option value="2024-II">2024-II</option>
        </select>

        {/* Filtro por estado */}
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

      {loading && (
        <div className="text-center py-8">Cargando asignaturas...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      )}

      {/* 📚 Lista */}
      <div className="space-y-5">
        {subjects.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron asignaturas
          </div>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject.id}
              className="flex items-center justify-between px-7 py-5 bg-white border border-gray-300 rounded-2xl transition"
            >
              <span className="text-base font-semibold text-gray-800">
                {subject.name}
              </span>
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
          ))
        )}
      </div>

      {/* 🪟 Modal */}
      {modal.open && (
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
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-600">
                    El sílabo está aprobado. Puede descargar la versión oficial.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(modal.subject.thumbnail);
                        if (!res.ok) throw new Error("Error al descargar");
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${modal.subject.name.replace(/\s+/g, "_")}_silabo`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                      } catch (e) {
                        console.error("Descarga fallida:", e);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
                  >
                    Descargar
                  </button>
                </div>
              )}

              {modal.subject.status === "red" && (
                <div className="text-left w-full">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-sm font-medium">
                      Solicita modificaciones
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                    <strong>Observaciones:</strong>
                    <p className="mt-2">
                      {modal.subject.note ||
                        "El docente debe revisar las observaciones solicitadas."}
                    </p>
                  </div>
                </div>
              )}

              {modal.subject.status === "yellow" && (
                <div>
                  <p className="text-sm text-gray-600">
                    El sílabo está pendiente de aprobación por la autoridad
                    pertinente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
