// src/pages/Subjects.tsx
import { useState, useEffect, useRef } from "react";
import { Eye, X, Pencil, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import silaboImg from "../../assets/SILABO_DIS.png"; // Importación la imagen del sílabo

type Status = "green" | "red" | "yellow";

interface Subject {
  id: number;
  name: string;
  status: Status;
  thumbnail: string;
  note: string;
}

type ModalState = { open: false } | { open: true; subject: Subject };

const statusMap: Record<Status, { color: string; label: string }> = {
  green: { color: "bg-green-500", label: "Aprobado" },
  red: { color: "bg-red-500", label: "Modificaciones pendientes" },
  yellow: { color: "bg-yellow-400", label: "Pendiente de aprobación" },
};

export default function Subjects() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>({ open: false });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const didFetchRef = useRef(false);

  // ID fijo del docente    (PARA SPRINT 1)
  const currentTeacherId = "1";

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:7071/api/docente/${currentTeacherId}/asignaturas`
        );

        if (!response.ok)
          throw new Error(`Error en la API: ${response.status}`);

        const json = await response.json();
        const backendRaw = json?.data ?? [];

        if (!Array.isArray(backendRaw) || backendRaw.length === 0) {
          setSubjects([]);
          setError("No se encontraron asignaturas para este docente");
          return;
        }

        const formattedSubjects: Subject[] = backendRaw.map((item: any) => ({
          id: Number(item.idSilabo),
          name: item.cursoNombre ?? "Sin nombre",
          status: item.semestreAcademico === "2025-II" ? "yellow" : "green",
          thumbnail: silaboImg,
          /*thumbnail: "/sylabus-default.png",*/
          note: `${item.docentesText ?? "Docente(s)"} • Ciclo: ${
            item.ciclo ?? "-"
          } • Código: ${item.cursoCodigo ?? "-"}`,
        }));

        const uniqueSubjects = Array.from(
          new Map(formattedSubjects.map((s) => [s.id, s])).values()
        );

        setSubjects(uniqueSubjects);
      } catch (err: any) {
        console.error("Error al cargar asignaturas:", err);
        setError("Error al cargar asignaturas");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [currentTeacherId]);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mis Asignaciones</h1>

      {/* Buscador */}
      <div className="mb-8 flex items-center gap-2">
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
      </div>

      {loading && (
        <div className="text-center py-8">Cargando asignaturas...</div>
      )}
      {error && (
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      )}

      <div className="space-y-5">
        {filteredSubjects.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron asignaturas
          </div>
        ) : (
          filteredSubjects.map((subject) => (
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
                        `/create-course?subject=${encodeURIComponent(subject.name)}`
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

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 relative w-full max-w-md text-center">
            <button
              className="absolute top-4 right-4"
              onClick={() => setModal({ open: false })}
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">{modal.subject.name}</h2>
            <img
              src={modal.subject.thumbnail}
              alt="Miniatura del sílabo"
              className="mx-auto mb-4 border shadow max-h-64"
            />
            <p className="text-gray-600 mt-4">{modal.subject.note}</p>
          </div>
        </div>
      )}
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

              {/* Estado: verde -> descargar, rojo -> mostrar nota de modificación, amarillo -> info */}
              {modal.subject.status === "green" && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-600">
                    El sílabo está aprobado. Puede descargar la versión oficial.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        // Intentamos descargar la miniatura / archivo remoto.
                        const res = await fetch(modal.subject.thumbnail);
                        if (!res.ok) throw new Error("Error al descargar");
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        // Nombre de archivo legible
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
