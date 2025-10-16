import { useMutation } from "@tanstack/react-query";

interface SendTokenParams {
  baseUrl: string;
  microsoftToken: string;
}

async function sendTokenToBackend({
  baseUrl,
  microsoftToken,
}: SendTokenParams): Promise<{ url: string }> {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ microsoftToken }),
  });
  const data = await res.json();

  if (!res.ok) {
    const message =
      (data && (data.message || JSON.stringify(data))) ||
      "Fallo en la creación de la sesión interna.";
    throw new Error(message);
  }

  return { url: data.url };
}

export const useSendTokenToBackend = () =>
  useMutation<{ url: string }, Error, SendTokenParams>({
    mutationFn: sendTokenToBackend,
  });
