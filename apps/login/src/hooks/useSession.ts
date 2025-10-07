// hooks/useSession.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSession, verifySession } from "./../api/sessions";
import type { CreateSessionParams, UserSession } from "../types/session";

export function useCreateSession() {
  return useMutation<UserSession, Error, CreateSessionParams>({
    mutationFn: createSession,
  });
}

export function useVerifySession(baseUrl: string) {
  return useQuery<UserSession, Error>({
    queryKey: ["session"],
    queryFn: () => verifySession(baseUrl),
    retry: false,
  });
}
