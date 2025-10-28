import { useState } from "react";
import toast from "react-hot-toast";

export default function CoordinatorEmail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error("Completa destinatario, asunto y mensaje");
      return;
    }

    try {
      const mailToken = sessionStorage.getItem("mailToken");
      if (!mailToken) {
        toast.error("No se encontró mailToken en la sesión");
        return;
      }

      setIsSending(true);
      const loadingId = toast.loading("Enviando correo...");

      const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mailToken}`,
        },
        body: JSON.stringify({
          message: {
            subject,
            body: {
              contentType: "HTML",
              content: body,
            },
            toRecipients: [
              {
                emailAddress: {
                  address: to,
                },
              },
            ],
          },
          saveToSentItems: "true",
        }),
      });

      toast.dismiss(loadingId);
      setIsSending(false);

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al enviar el correo");
      }

      toast.success("Mensaje enviado con éxito");
      setTo("");
      setSubject("");
      setBody("");
    } catch (err) {
      setIsSending(false);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-6">Enviar correo a docente</h1>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinatario (email)
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="docente@usmp.edu.pe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asunto
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Asunto del correo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu mensaje...
Ej: Estimado docente, recuerde completar el sílabo del curso ..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSending ? "Enviando..." : "Enviar correo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
