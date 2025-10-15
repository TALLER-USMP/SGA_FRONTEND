import { useMutation } from "@tanstack/react-query";

interface SendTokenParams {
  baseUrl: string;
  microsoftToken: string;
}

async function sendTokenToBackend({
  baseUrl,
  microsoftToken,
}: SendTokenParams): Promise<void> {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ microsoftToken }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      (errorData && (errorData.message || JSON.stringify(errorData))) ||
      "Fallo en la creación de la sesión interna.";
    throw new Error(message);
  }
}

export const useSendTokenToBackend = () =>
  useMutation<void, Error, SendTokenParams>({
    mutationFn: sendTokenToBackend,
  });
