import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SendEmail() {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState(
    "Mg. Norma Birginia Leon  Lescano",
  );
  const [courseCode, setCourseCode] = useState("09072108042");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 400;

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setMessage(text);
      setCharCount(text.length);
    }
  };

  const handleSend = () => {
    console.log("Enviando correo:", { recipient, courseCode, message });
    // Aquí iría la llamada al backend
    navigate("/");
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
        <div className="mb-8">
          <label className="block text-xl font-bold text-black mb-3">
            3. Mensaje al Docente
          </label>
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Se te han activado permisos para modificar el silabo."
            rows={8}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {charCount}/{maxChars}
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
            onClick={handleSend}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
