import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authService } from "../services/auth-service";
import { SessionContext } from "./session-context";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = React.useState<string | undefined>(() => {
    // Intentar obtener el token guardado al inicializar
    return sessionStorage.getItem("authToken") || undefined;
  });

  React.useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const mailToken = urlParams.get("mailToken");

    if (tokenFromUrl && mailToken) {
      // Guardar el token en sessionStorage para persistencia
      sessionStorage.setItem("authToken", tokenFromUrl);
      sessionStorage.setItem("mailToken", mailToken);
      setToken(tokenFromUrl);

      // Limpiar la URL
      const clear = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, clear);
    }
  }, []);

  const getSession = useQuery({
    queryKey: ["session", token],
    queryFn: () => authService.fetchSession(token),
    enabled: !!token,
    retry: 2, // Intentar 2 veces más antes de marcar como error
    retryDelay: 1000, // Esperar 1 segundo antes de reintentar
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos en caché
    refetchOnWindowFocus: false, // No refetch al cambiar de ventana
    refetchOnMount: false, // No refetch al montar si hay datos en caché
    refetchOnReconnect: true, // Sí refetch cuando se recupera la conexión
  });

  // Limpiar token si la sesión falló definitivamente
  React.useEffect(() => {
    if (getSession.isError && token && getSession.failureCount >= 2) {
      console.warn("Sesión inválida, limpiando token...");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("mailToken");
      setToken(undefined);
    }
  }, [getSession.isError, getSession.failureCount, token]);

  // Si no hay token guardado, marcar como error
  const hasNoToken = !token;

  return (
    <SessionContext.Provider
      value={{
        user: getSession.data?.user,
        isLoading: getSession.isLoading || getSession.isFetching,
        isError: hasNoToken || getSession.isError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
