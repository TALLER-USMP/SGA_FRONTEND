import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Tipos de datos
interface Asignatura {
  cursoCodigo: string;
  cursoNombre: string;
  estadoRevision: string;
  syllabusId: number;
  docenteEmail: string;
}

interface FormData {
  course: string;
  cycle: string;
  file: File | null;
}

interface FormErrors {
  course?: string;
  cycle?: string;
  file?: string;
}

const CYCLES = ["2024-1", "2024-2", "2025-1", "2025-2"];

// 📡 Función para traer asignaturas desde el backend
async function fetchAsignaturas(): Promise<Asignatura[]> {
  const response = await fetch("/api/assignments");
  if (!response.ok) {
    throw new Error("Error al obtener asignaturas");
  }
  const data = await response.json();
  // Retorna solo las aprobadas
  return data.data.filter(
    (asignatura: Asignatura) => asignatura.estadoRevision === "APROBADO",
  );
}

export default function ImportSyllabusForm() {
  const [formData, setFormData] = useState<FormData>({
    course: "",
    cycle: CYCLES[CYCLES.length - 1],
    file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧩 TanStack Query para obtener las asignaturas
  const {
    data: asignaturas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["asignaturas"],
    queryFn: fetchAsignaturas,
  });

  // ✅ Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.course) newErrors.course = "Selecciona una asignatura";
    if (!formData.cycle) newErrors.cycle = "Selecciona un ciclo";

    if (!formData.file) {
      newErrors.file = "Selecciona un archivo PDF";
    } else if (formData.file.type !== "application/pdf") {
      newErrors.file = "El archivo debe ser PDF";
    } else if (formData.file.size > 5 * 1024 * 1024) {
      newErrors.file = "El archivo no debe superar 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Manejar cambios
  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("course", formData.course);
      data.append("cycle", formData.cycle);
      if (formData.file) data.append("file", formData.file);

      // Simulación de subida (puedes cambiar la URL a tu backend real)
      const response = await fetch("/api/assignments", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Error al subir el archivo");

      alert("✅ Sílabo subido exitosamente");
      setFormData({
        course: "",
        cycle: CYCLES[CYCLES.length - 1],
        file: null,
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error al subir el archivo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🧠 Estado de carga o error
  if (isLoading)
    return (
      <p className="text-center mt-6 text-gray-600">Cargando asignaturas...</p>
    );

  if (isError)
    return (
      <p className="text-center mt-6 text-red-600">
        Error al cargar las asignaturas
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Importar Sílabo con Firma
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sube el sílabo firmado (PDF) solo para asignaturas aprobadas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campo Asignatura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asignatura *
            </label>
            <select
              value={formData.course}
              onChange={(e) => handleInputChange("course", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.course ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar Asignatura</option>
              {asignaturas?.map((asig) => (
                <option key={asig.cursoCodigo} value={asig.cursoCodigo}>
                  {asig.cursoNombre}
                </option>
              ))}
            </select>
            {errors.course && (
              <p className="mt-1 text-sm text-red-600">{errors.course}</p>
            )}
          </div>

          {/* Campo Ciclo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciclo *
            </label>
            <select
              value={formData.cycle}
              onChange={(e) => handleInputChange("cycle", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.cycle ? "border-red-500" : "border-gray-300"
              }`}
            >
              {CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </select>
            {errors.cycle && (
              <p className="mt-1 text-sm text-red-600">{errors.cycle}</p>
            )}
          </div>

          {/* Campo Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo de Sílabo (PDF firmado) *
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                handleInputChange("file", e.target.files?.[0] || null)
              }
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Solo se permiten archivos PDF (máx. 5MB).
            </p>
          </div>

          {/* Botón */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting ? "Subiendo..." : "Subir Sílabo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
