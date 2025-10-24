import { Link } from "react-router-dom";
import usmpLogo from "../../assets/Logo_FIA.png";
import type HeaderProps from "../../interfaces/headerProps";

const roleNames: Record<number, string> = {
  1: "docente",
  2: "indeterminado",
  3: "coordinadora_academica",
  4: "director_escuela",
};

export default function Sidebar({ user }: HeaderProps) {
  const userRoleName = user?.role ? roleNames[user.role] : "indeterminado";

  const menuItems = [
    {
      to: "/",
      label: "Inicio",
      roles: ["docente", "indeterminado", "coordinadora_academica"],
    },
    { to: "/mis-asignaciones", label: "Mis sílabos", roles: ["indeterminado"] },
    {
      to: "/syllabus",
      label: "Crear curso",
      roles: ["docente", "indeterminado"],
    },
  ];

  return (
    <aside className="w-64 bg-[#111827] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <img src={usmpLogo} alt="USMP Logo" className="h-16 object-contain" />
      </div>

      {/* Menu options */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {menuItems
            .filter((item) => userRoleName && item.roles.includes(userRoleName))
            .map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block p-2 hover:bg-gray-700 rounded"
                >
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
