import { useState } from "react";
import type HeaderProps from "../../interfaces/headerProps";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { ChevronDown, User, LogOut } from "lucide-react";
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
          className="bg-white text-black px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <User size={18} />
          <span className="font-medium">{displayName}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden z-10 border border-gray-200">
            <div className="py-1">
              <Link
                to="/perfil"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                onClick={() => setOpen(false)}
              >
                <User size={18} />
                <span>Perfil</span>
              </Link>
              <hr className="border-gray-200" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 text-left"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
                <span className="ml-auto text-gray-400">✕</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
