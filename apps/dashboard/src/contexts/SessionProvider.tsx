import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { SessionContext } from "./SessionContext";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["session"],
    queryFn: authService.fetchSession,
    retry: false,
  });

  return (
    <SessionContext.Provider value={{ user: data?.user, isLoading, isError }}>
      {children}
    </SessionContext.Provider>
  );
};
