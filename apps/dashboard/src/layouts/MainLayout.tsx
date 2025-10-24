import React from "react";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";
import { useSession } from "../contexts/useSession";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { user, isLoading, isError } = useSession();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-gray-600 text-lg">Verificando sesión...</span>
      </div>
    );
  }

  const redirectUrl = import.meta.env.VITE_REDIRECT_LOGIN as string;
  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          No has iniciado sesión
        </h2>
        <a href={redirectUrl} className="text-blue-600 hover:underline">
          Ir al inicio de sesión
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col max-h-screen">
        <Header user={user} />
        <main className="p-6 bg-white flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
