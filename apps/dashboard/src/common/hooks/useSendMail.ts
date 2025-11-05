import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type GraphFileAttachment = {
  "@odata.type": "#microsoft.graph.fileAttachment";
  name: string;
  contentType: string;
  contentBytes: string;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  body: string;
  files?: File[];
}

export const MAX_FILE_BYTES = 3 * 1024 * 1024; // ~3MB por archivo
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // ~10MB total
export const MAX_FILES = 5; // máximo 5 adjuntos

const humanSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

const sendMailRequest = async (opts: SendMailOptions): Promise<void> => {
  const { to, subject, body, files = [] } = opts;

  if (!to.trim() || !subject.trim() || !body.trim()) {
    throw new Error("Completa destinatario, asunto y mensaje");
  }

  const mailToken = sessionStorage.getItem("mailToken");
  if (!mailToken) {
    throw new Error(
      "No se encontraron los permisos para enviar email, vuelva a iniciar sesión",
    );
  }

  let attachments: GraphFileAttachment[] | undefined = undefined;
  if (files.length) {
    if (files.length > MAX_FILES) {
      throw new Error(`Máximo ${MAX_FILES} archivos`);
    }
    const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
    if (totalBytes > MAX_TOTAL_BYTES) {
      throw new Error(
        `Límite total excedido (${humanSize(totalBytes)} > ${humanSize(MAX_TOTAL_BYTES)})`,
      );
    }
    for (const f of files) {
      if (f.size > MAX_FILE_BYTES) {
        throw new Error(`Archivo muy grande: ${f.name}`);
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

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Error al enviar el correo");
  }
};

export function useSendMail() {
  const mutation = useMutation({
    mutationFn: sendMailRequest,
    onMutate: () => {
      toast.loading("Enviando correo...", { id: "send-mail" });
    },
    onSuccess: () => {
      toast.dismiss("send-mail");
      toast.success("Mensaje enviado con éxito", {
        duration: 5000, // 5 segundos visible
      });
    },
    onError: (error: Error) => {
      toast.dismiss("send-mail");
      toast.error(error.message || "Error al enviar el correo", {
        duration: 5000, // 5 segundos visible
      });
    },
  });

  return {
    sendMail: mutation.mutateAsync,
    isSending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
}
