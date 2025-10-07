import type { CreateSessionParams, UserSession } from "../types/session";

export async function createSession({
  baseUrl,
  apiToken,
  graphToken,
}: CreateSessionParams): Promise<UserSession> {
  const res = await fetch(`${baseUrl}/session/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ graphToken }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Error creando sesión: ${res.statusText}`);
  }

  return res.json();
}

export async function verifySession(baseUrl: string): Promise<UserSession> {
  const res = await fetch(`${baseUrl}/session/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Sesión no verificada: ${res.statusText}`);
  }

  return res.json();
}
