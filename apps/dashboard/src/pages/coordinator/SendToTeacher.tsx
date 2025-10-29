import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useSession } from "../../contexts/useSession";
import { getRoleName } from "../../constants/roles";
import { useCoordinator } from "../../contexts/CoordinatorContext";
import { useSendMessage } from "../../hooks/api/MessagesQuery";

export default function SendToTeacher() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: sessionLoading } = useSession();
  const {
    selectedDocenteName,
    selectedCourseCode,
    selectedCourseName,
    selectedDocenteId,
    selectedSilaboId,
  } = useCoordinator();

  // Obtener valores desde contexto o fallback a searchParams
  const teacherName =
    selectedDocenteName || searchParams.get("teacherName") || "Docente";
  const courseCode = selectedCourseCode || searchParams.get("courseCode") || "";
  const courseName = selectedCourseName || searchParams.get("courseName") || "";

  // Mutation para enviar mensaje
  const sendMessageMutation = useSendMessage();

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

  // Actualizar formulario cuando cambian los valores del contexto
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      destinatario: teacherName,
      codigoAsignatura: courseCode,
    }));
  }, [teacherName, courseCode]);

  const maxCharacters = 400;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, mensaje: value });
    }
  };

  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!formData.destinatario.trim()) {
      alert("Por favor, ingrese el nombre del destinatario");
      return;
    }

    if (!formData.codigoAsignatura.trim()) {
      alert("Por favor, ingrese el código de la asignatura");
      return;
    }

    if (!formData.mensaje.trim()) {
      alert("Por favor, ingrese un mensaje");
      return;
    }

    try {
      // Enviar mensaje
      await sendMessageMutation.mutateAsync({
        destinatario: formData.destinatario,
        codigoAsignatura: formData.codigoAsignatura,
        nombreAsignatura: courseName,
        mensaje: formData.mensaje,
        docenteId: selectedDocenteId ?? undefined,
        silaboId: selectedSilaboId ?? undefined,
      });

      alert("Mensaje enviado exitosamente");
      // Redirigir a la lista de asignaturas
      navigate("/coordinator/assignments");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje. Por favor, intente de nuevo.");
    }
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
          disabled={sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
