import { Link } from "react-router-dom";
import usmpLogo from "../../assets/Logo_FIA.png";
import type HeaderProps from "../../interfaces/headerProps";
import { getRoleName } from "../../constants/roles";
import { sidebarMenusByRole, type RoleKey } from "../../constants/siderbar";

export default function Sidebar({ user }: HeaderProps) {
  const menuItems =
    sidebarMenusByRole[getRoleName(user?.role) as RoleKey] ?? [];

  return (
    <aside className="w-64 bg-[#111827] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <img src={usmpLogo} alt="USMP Logo" className="h-16 object-contain" />
      </div>

      {/* Menu options */}
      <nav className="flex-1 p-4">
        <ul className="space-y-3">
          {menuItems.map((item) => (
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
