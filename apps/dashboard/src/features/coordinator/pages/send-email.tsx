import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import {
  useSendMail,
  MAX_FILES,
  MAX_FILE_BYTES,
} from "../../../common/hooks/useSendMail";
import { toast } from "sonner";

export default function SendEmail() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const maxChars = 400;

  const { sendMail, isSending } = useSendMail();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
      setCharCount(text.length);
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
    if (!recipient.trim()) {
      toast.error("Ingresa el destinatario");
      return;
    }

    if (!courseCode.trim()) {
      toast.error("Ingresa el código de asignatura");
      return;
    }

    if (!message.trim()) {
      toast.error("Ingresa el mensaje");
      return;
    }

    try {
      await sendMail({
        to: recipient,
        subject: `Notificación - Curso ${courseCode}`,
        body: message,
        files: attachments,
      });
      // Limpiar formulario después del éxito
      setRecipient("");
      setCourseCode("");
      setMessage("");
      setCharCount(0);
      setAttachments([]);
    } catch {
      // El error ya se maneja en el hook con toast
    }
  };

  const handleGoBack = () => {
    navigate("/");
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
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
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
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
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
              value={message}
              onChange={handleMessageChange}
              placeholder="Se te han activado permisos para modificar el sílabo."
              rows={8}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {charCount}/{maxChars}
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
            disabled={isSending}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
