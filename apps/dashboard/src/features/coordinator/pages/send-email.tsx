import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import {
  useSendMail,
  MAX_FILES,
  MAX_FILE_BYTES,
} from "../../../common/hooks/useSendMail";
import { toast } from "sonner";
import { useSession } from "../../auth/hooks/use-session";
import { getRoleName } from "../../../common/constants/roles";
import { useCoordinator } from "../contexts/coordinator-context";
import { useSendMessage } from "../hooks/messages-query";

export default function SendEmail() {
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

  // Mutation para enviar mensaje (API backend)
  const sendMessageMutation = useSendMessage();
  // Hook para enviar email con archivos adjuntos
  const { sendMail, isSending } = useSendMail();

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

  const [attachments, setAttachments] = useState<File[]>([]);
  const maxCharacters = 400;

  // Actualizar formulario cuando cambian los valores del contexto
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      destinatario: teacherName,
      codigoAsignatura: courseCode,
    }));
  }, [teacherName, courseCode]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxCharacters) {
      setFormData({ ...formData, mensaje: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (attachments.length + files.length > MAX_FILES) {
      toast.error(`Máximo ${MAX_FILES} archivos permitidos`);
      return;
    }
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`El archivo ${file.name} supera los 3MB`);
        return;
      }
    }
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validar que los campos no estén vacíos
    if (!formData.destinatario.trim()) {
      toast.error("Por favor, ingrese el nombre del destinatario");
      return;
    }

    if (!formData.codigoAsignatura.trim()) {
      toast.error("Por favor, ingrese el código de la asignatura");
      return;
    }

    if (!formData.mensaje.trim()) {
      toast.error("Por favor, ingrese un mensaje");
      return;
    }

    try {
      // 1. Enviar mensaje a la API (para notificaciones internas)
      await sendMessageMutation.mutateAsync({
        destinatario: formData.destinatario,
        codigoAsignatura: formData.codigoAsignatura,
        nombreAsignatura: courseName,
        mensaje: formData.mensaje,
        docenteId: selectedDocenteId ?? undefined,
        silaboId: selectedSilaboId ?? undefined,
      });

      // 2. Si hay archivos adjuntos, enviar email con archivos
      if (attachments.length > 0) {
        await sendMail({
          to: formData.destinatario,
          subject: `Notificación - Curso ${formData.codigoAsignatura}`,
          body: formData.mensaje,
          files: attachments,
        });
        toast.success("Mensaje y archivos enviados exitosamente");
      } else {
        toast.success("Mensaje enviado exitosamente");
      }

      // Redirigir a la lista de asignaturas
      navigate("/coordinator/assignments");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("Error al enviar el mensaje. Por favor, intente de nuevo.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Destinatario */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            1. Destinatario
          </label>
          <input
            type="text"
            value={formData.destinatario}
            onChange={(e) =>
              setFormData({ ...formData, destinatario: e.target.value })
            }
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del destinatario"
          />
        </div>

        {/* Código de Asignatura */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            2. Código de Asignatura
          </label>
          <input
            type="text"
            value={formData.codigoAsignatura}
            onChange={(e) =>
              setFormData({ ...formData, codigoAsignatura: e.target.value })
            }
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Código de la asignatura"
          />
        </div>

        {/* Mensaje al Docente */}
        <div className="mb-6">
          <label className="block text-xl font-bold text-black mb-3">
            3. Mensaje al Docente
          </label>
          <div className="relative">
            <textarea
              value={formData.mensaje}
              onChange={handleMessageChange}
              placeholder="Se te han activado permisos para modificar el sílabo."
              rows={8}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.mensaje.length}/{maxCharacters}
            </div>
          </div>
        </div>

        {/* Archivos Adjuntos */}
        <div className="mb-8">
          <label className="block text-xl font-bold text-black mb-3">
            4. Archivos Adjuntos (opcional)
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={attachments.length >= MAX_FILES}
            />
            <label
              htmlFor="file-upload"
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                attachments.length >= MAX_FILES
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : "border-gray-400 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <Upload size={20} className="text-gray-600" />
              <span className="text-gray-700">
                {attachments.length >= MAX_FILES
                  ? `Máximo ${MAX_FILES} archivos`
                  : "Seleccionar archivos (máx. 3MB c/u)"}
              </span>
            </label>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-sm text-gray-700 truncate">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={sendMessageMutation.isPending || isSending}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendMessageMutation.isPending || isSending
              ? "Enviando..."
              : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
