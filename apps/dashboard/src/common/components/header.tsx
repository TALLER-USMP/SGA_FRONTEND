import { useState } from "react";
import type HeaderProps from "../types/headerProps";
import { Link } from "react-router-dom";
import { authService } from "../../features/auth/services/auth-service";
import { UserAvatar } from "@/components/ui/UserAvatar";

export default function Header({ user }: HeaderProps) {
  const displayName = user?.name || user?.email || "Docente";
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = import.meta.env.VITE_REDIRECT_LOGIN;
    } catch (error) {
      console.error("error en el logout" + error);
    }
  };

  return (
    <header className="w-full bg-red-700 text-white flex justify-end items-center px-6 py-3 relative">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-white text-black px-4 py-1 rounded shadow flex items-center gap-2"
        >
          <UserAvatar className="w-8 h-8 -ml-1 mr-1" />
          {displayName} ⬇
        </button>

        {open && (
          <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg overflow-hidden z-10">
            <li>
              <Link
                to="/perfil"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Ver perfil
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
