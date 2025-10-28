import { FileText, BarChart3, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoordinatorHome() {
  const navigate = useNavigate();

  const handleReviewSyllabus = () => {
    navigate("/mis-asignaciones");
  };

  const handleViewReports = () => {
    // Navegar a reportes cuando esté disponible
    console.log("Ver reportes");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-[60vh]">
      {/* Botón Revisar Sílabos */}
      <button
        onClick={handleReviewSyllabus}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-8 px-12 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-4 min-w-[300px]"
      >
        <div className="bg-red-600 text-white p-3 rounded-lg">
          <FileText size={28} />
        </div>
        <span className="text-lg">Revisar Sílabos</span>
      </button>

      {/* Botón Ver Reportes */}
      <button
        onClick={handleViewReports}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-8 px-12 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-4 min-w-[300px]"
      >
        <div className="bg-red-600 text-white p-3 rounded-lg">
          <BarChart3 size={28} />
        </div>
        <span className="text-lg">Ver Reportes</span>
      </button>

      {/* Botón de prueba: Enviar correo */}
      <button
        onClick={() => navigate("/coordinator/email")}
        className="bg-white hover:bg-gray-50 text-black font-semibold py-8 px-12 rounded-lg border-2 border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-4 min-w-[300px]"
      >
        <div className="bg-red-600 text-white p-3 rounded-lg">
          <Mail size={28} />
        </div>
        <span className="text-lg">Enviar correo</span>
      </button>
    </div>
  );
}
