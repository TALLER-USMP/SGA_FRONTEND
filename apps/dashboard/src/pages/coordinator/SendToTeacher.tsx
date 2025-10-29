import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useSession } from "../../contexts/useSession";
import { getRoleName } from "../../constants/roles";

export default function SendToTeacher() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherName = searchParams.get("teacherName") || "Docente";
  const courseCode = searchParams.get("courseCode") || "";
  const { user, isLoading: sessionLoading } = useSession();

  // Validar que el usuario sea coordinadora
  useEffect(() => {
    if (!sessionLoading && user) {
      const roleName = getRoleName(user.role);
      if (roleName !== "coordinadora_academica") {
        navigate("/");
      }
    }
  }, [user, sessionLoading, navigate]);

  const [formData, setFormData] = useState({
    destinatario: teacherName,
    codigoAsignatura: courseCode,
    mensaje: "",
  });

  const maxCharacters = 400;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, mensaje: value });
    }
  };

  const handleSubmit = () => {
    // TODO: Implementar lógica de envío
    // - Validar que los campos no estén vacíos
    // - Enviar petición al backend para activar permisos
    // - Mostrar mensaje de éxito/error
    // - Redirigir a la vista anterior
    alert("Funcionalidad de envío pendiente de implementación");
  };

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1400px" }}>
      {/* Formulario */}
      <div className="space-y-6">
        {/* 1. Destinatario */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            1. Destinatario
          </label>
          <input
            type="text"
            value={formData.destinatario}
            onChange={(e) =>
              setFormData({ ...formData, destinatario: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            placeholder="Nombre del destinatario"
          />
        </div>

        {/* 2. Código de Asignatura */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            2. Código de Asignatura
          </label>
          <input
            type="text"
            value={formData.codigoAsignatura}
            onChange={(e) =>
              setFormData({ ...formData, codigoAsignatura: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            placeholder="Código de la asignatura"
          />
        </div>

        {/* 3. Mensaje al Docente */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            3. Mensaje al Docente
          </label>
          <div className="relative">
            <textarea
              value={formData.mensaje}
              onChange={handleMessageChange}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
              placeholder="Se te han activado permisos para modificar el sílabo."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.mensaje.length}/{maxCharacters}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-2 justify-between w-full mt-12">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="px-8 py-2 bg-black text-white hover:bg-gray-800 rounded-full"
        >
          {"< Volver"}
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
}
