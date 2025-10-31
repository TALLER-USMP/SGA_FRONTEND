import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authService } from "../services/auth-service";
import { SessionContext } from "./session-context";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = React.useState<string | undefined>();
  const [shouldFetch, setShouldFetch] = React.useState(false);

  React.useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const mailToken = urlParams.get("mailToken");

    if (tokenFromUrl && mailToken) {
      setToken(tokenFromUrl);
      sessionStorage.setItem("mailToken", mailToken);
      const clear = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, clear);
    }
    setShouldFetch(true);
  }, []);

  const getSession = useQuery({
    queryKey: ["session", token],
    queryFn: () => authService.fetchSession(token),
    enabled: shouldFetch,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return (
    <SessionContext.Provider
      value={{
        user: getSession.data?.user,
        isLoading: getSession.isLoading,
        isError: getSession.isError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
