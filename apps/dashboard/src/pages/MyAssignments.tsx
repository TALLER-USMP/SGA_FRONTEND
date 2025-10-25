import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Search, AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// URL del backend
const SUBJECTS_URL = "/api/assignments/";

type Subject = {
  id: string | number;
  name: string;
  status: "asignado" | "pendiente";
  code: string;
  link: string;
};

// 🔹 Tipo que representa lo que devuelve el backend
type RawSubject = {
  cursoNombre: string;
  cursoCodigo: string;
  estadoRevision: string;
};

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isLikelyCode(term: string) {
  const t = term.trim();
  if (!t) return false;
  if (/\d/.test(t)) return true;
  if (/^[A-Z]{2,}\d{2,}$/i.test(t)) return true;
  return false;
}

async function fetchSubjects(searchTerm = ""): Promise<Subject[]> {
  const term = searchTerm.trim();
  let url = SUBJECTS_URL;
  if (term) {
    const param = isLikelyCode(term) ? "codigo" : "nombre";
    url += `?${param}=${encodeURIComponent(term)}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw = await res.json();
  const arr = Array.isArray(raw?.data) ? (raw.data as RawSubject[]) : [];

  const unique = Array.from(
    new Map(
      arr
        .filter((item: RawSubject) => item.cursoNombre && item.cursoCodigo)
        .map((item: RawSubject, idx: number) => {
          const statusRaw = String(item.estadoRevision || "")
            .trim()
            .toLowerCase();
          const status: "asignado" | "pendiente" =
            statusRaw === "asignado" ? "asignado" : "pendiente";

          return [
            item.cursoCodigo ?? idx,
            {
              id: item.cursoCodigo ?? idx,
              code: item.cursoCodigo ?? "",
              name: item.cursoNombre ?? "Sin nombre",
              status,
              link:
                "/syllabus?codigo=" +
                encodeURIComponent(item.cursoCodigo ?? ""),
            } as Subject,
          ];
        }),
    ).values(),
  ) as Subject[];

  if (term) {
    const t = norm(term);
    return unique.filter(
      (s: Subject) =>
        norm(String(s.code)).includes(t) || norm(s.name).includes(t),
    );
  }

  return unique;
}

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedTerm(searchTerm), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const {
    data: subjects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subjects", debouncedTerm],
    queryFn: () => fetchSubjects(debouncedTerm),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Mis Asignaciones
      </h1>

      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col"></div>
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm w-full max-w-xs">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Buscar asignatura..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin ml-2" />
          )}
        </div>
      </div>

      {isError && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">
            Error al obtener datos: {(error as Error).message}
          </span>
        </div>
      )}

      <div className="flex gap-6 items-center mb-6">
        <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
          <span className="w-3 h-3 rounded-full bg-green-600"></span> Asignado
        </span>
        <span className="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <span className="w-3 h-3 rounded-full border-2 border-gray-600"></span>{" "}
          Pendiente
        </span>
      </div>

      <div className="space-y-3">
        {isLoading && subjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
            <p>Cargando asignaturas…</p>
          </div>
        ) : subjects.length > 0 ? (
          subjects.map((subject) => (
            <Link
              key={subject.id}
              to={subject.link}
              className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-800">
                    {subject.name}
                  </span>
                  <span className="text-sm text-gray-500 font-mono">
                    {subject.code}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full transition-all ${
                    subject.status === "asignado"
                      ? "bg-green-600"
                      : "border-2 border-gray-600"
                  }`}
                  title={
                    subject.status === "asignado" ? "Asignado" : "Pendiente"
                  }
                />
                <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No se encontraron asignaturas</p>
            {searchTerm && (
              <p className="text-sm mt-2">
                Prueba con otro término de búsqueda
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
