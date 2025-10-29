import { useRef, useState } from "react";
import toast from "react-hot-toast";

type GraphFileAttachment = {
  "@odata.type": "#microsoft.graph.fileAttachment";
  name: string;
  contentType: string;
  contentBytes: string; // base64
};

export default function CoordinatorEmail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILE_BYTES = 3 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
  const MAX_FILES = 5;

  const humanSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const capacity = MAX_FILES - files.length;
    if (capacity <= 0) {
      toast.error(`Máximo ${MAX_FILES} archivos`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const toAdd = selected.slice(0, capacity);

    const validBySize = toAdd.filter((f) => {
      const ok = f.size <= MAX_FILE_BYTES;
      if (!ok)
        toast.error(`Archivo muy grande: ${f.name} (${humanSize(f.size)})`);
      return ok;
    });

    const currentTotal = files.reduce((acc, f) => acc + f.size, 0);
    const incomingTotal = validBySize.reduce((acc, f) => acc + f.size, 0);
    if (currentTotal + incomingTotal > MAX_TOTAL_BYTES) {
      toast.error(
        `Límite total excedido (${humanSize(
          currentTotal + incomingTotal,
        )} > ${humanSize(MAX_TOTAL_BYTES)})`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFiles((prev) => [...prev, ...validBySize]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] ?? "";
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(f);
    });

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

      let attachments: GraphFileAttachment[] | undefined = undefined;
      if (files.length) {
        if (files.length > MAX_FILES) {
          toast.dismiss(loadingId);
          setIsSending(false);
          toast.error(`Máximo ${MAX_FILES} archivos`);
          return;
        }
        const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
        if (totalBytes > MAX_TOTAL_BYTES) {
          toast.dismiss(loadingId);
          setIsSending(false);
          toast.error(
            `Límite total excedido (${humanSize(totalBytes)} > ${humanSize(
              MAX_TOTAL_BYTES,
            )})`,
          );
          return;
        }
        for (const f of files) {
          if (f.size > MAX_FILE_BYTES) {
            toast.dismiss(loadingId);
            setIsSending(false);
            toast.error(`Archivo muy grande: ${f.name}`);
            return;
          }
        }
        const converted: GraphFileAttachment[] = [];
        for (const f of files) {
          const contentBytes = await fileToBase64(f);
          converted.push({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: f.name,
            contentType: f.type || "application/octet-stream",
            contentBytes,
          });
        }
        attachments = converted;
      }

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
            ...(attachments ? { attachments } : {}),
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
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjuntar archivos (opcional)
            </label>
            <div className="">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="inline-block text-sm text-gray-700 cursor-pointer file:mr-3 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 focus:outline-none"
              />
            </div>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="text-sm text-gray-600 flex items-center justify-between"
                  >
                    <span className="truncate">
                      {f.name} ({humanSize(f.size)})
                    </span>
                    <button
                      type="button"
                      className="text-red-600 hover:underline ml-2"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Quitar
                    </button>
                  </div>
                ))}
                <div className="text-xs text-gray-400">
                  {files.length}/{MAX_FILES} archivos. Total:{" "}
                  {humanSize(files.reduce((a, f) => a + f.size, 0))} /{" "}
                  {humanSize(MAX_TOTAL_BYTES)}
                </div>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Límites: {MAX_FILES} archivos, ≤ ~3MB por archivo, ≤{" "}
              {humanSize(MAX_TOTAL_BYTES)} total. Para archivos grandes se
              requiere flujo avanzado.
            </p>
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
