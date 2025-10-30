import { Key, Mail, CheckSquare, List, Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

function ModuleCard({ icon, title, onClick }: ModuleCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-gray-50 border-2 border-gray-300 rounded-lg p-8 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-4 aspect-square"
    >
      <div className="bg-red-600 text-white p-4 rounded-lg">{icon}</div>
      <span className="text-base font-semibold text-black text-center">
        {title}
      </span>
    </button>
  );
}

export default function CoordinatorHome() {
  const navigate = useNavigate();

  const modules = [
    {
      icon: <Key size={32} />,
      title: "Activar permisos",
      onClick: () => navigate("/coordinator/permissions"),
    },
    {
      icon: <Mail size={32} />,
      title: "Enviar correos",
      onClick: () => navigate("/coordinator/send-email"),
    },
    {
      icon: <CheckSquare size={32} />,
      title: "Seguimiento de Silabo",
      onClick: () => navigate("/coordinator/review-syllabus"),
    },
    {
      icon: <List size={32} />,
      title: "Catalogo de Sumilla",
      onClick: () => navigate("/coordinator/syllabus-catalog"),
    },
    {
      icon: <Plus size={32} />,
      title: "Registrar nuevo Silabo",
      onClick: () => navigate("/syllabus"),
    },
    {
      icon: <Edit size={32} />,
      title: "Modificar nuevo Silabo",
      onClick: () => navigate("/mis-asignaciones"),
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <ModuleCard
            key={index}
            icon={module.icon}
            title={module.title}
            onClick={module.onClick}
          />
        ))}
      </div>
    </div>
  );
}
