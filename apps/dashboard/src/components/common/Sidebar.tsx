import { Home, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import usmpLogo from "../../assets/Logo_FIA.png";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#111827] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <img src={usmpLogo} alt="USMP Logo" className="h-16 object-contain" />
      </div>

      {/* Menu options */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
            >
              <Home size={18} /> Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/syllabus"
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-700"
            >
              <BookOpen size={18} /> Asignaturas
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
