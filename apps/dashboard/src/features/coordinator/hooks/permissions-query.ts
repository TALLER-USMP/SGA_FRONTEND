import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export interface Permission {
  numeroSeccion: number;
}

export interface PermissionsResponse {
  silaboId: number;
  docenteId: number;
  permisos: Permission[];
}

class PermissionsManager {
  async fetchByDocente(docenteId: number | string, baseUrl?: string) {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/permisos/${encodeURIComponent(String(docenteId))}`;
    const res = await fetch(url);
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    const json = await res.json();
    return json as Permission[];
  }

  async savePermissions(
    data: PermissionsResponse,
    baseUrl?: string,
  ): Promise<void> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/permisos/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
  }
}

export const permissionsManager = new PermissionsManager();

export const usePermissions = (
  docenteId: number | string | null | undefined,
  options?: UseQueryOptions<Permission[], Error>,
) => {
  return useQuery<Permission[], Error>({
    queryKey: ["permissions", docenteId],
    queryFn: () =>
      permissionsManager.fetchByDocente(docenteId as number | string),
    enabled: docenteId !== null && docenteId !== undefined,
    retry: false,
    staleTime: 30_000, // 30 segundos - balance entre frescura y performance
    refetchOnMount: true, // Siempre refetch al montar el componente
    refetchOnWindowFocus: false, // No refetch al volver al tab
    ...options,
  });
};

export const useSavePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionsResponse) =>
      permissionsManager.savePermissions(data),
    onSuccess: (_data, variables) => {
      // Invalidar la caché de permisos para el docente específico
      queryClient.invalidateQueries({
        queryKey: ["permissions", variables.docenteId],
      });
    },
  });
};
